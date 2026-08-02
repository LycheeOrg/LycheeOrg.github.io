// Based on github.com/LycheeOrg/Wizard's internal/generator/generator.go:
// turns the fetched/embedded Lychee templates plus the wizard's answers into
// docker-compose.yaml, .env, and (when requested) Docker secrets file
// contents. Unlike the Go CLI, nothing is written to disk here — callers
// get strings back to display, copy, or download. Extended with database
// engine/location and NSFW classification, which the CLI doesn't offer.
import { enableDockerSecrets } from './dockerSecrets';
import { removeDbService, addSqliteVolume } from './dbCompose';
import { insertNsfwService } from './nsfwService';
import { removeWorkerService } from './workerCompose';
import { addTraefikLabels } from './traefikCompose';
import { removePhpMyAdminService } from './phpMyAdminCompose';
import { removeEnvFileReferences, removePhpMyAdminProfileGate, inlineEnvVars } from './envFileCompose';
import { OAUTH_PROVIDERS } from './oauthProviders';
import { needsDbService, type WizardAnswers } from './answers';

interface KV {
  key: string;
  value: string;
}

// Random values are generated once per page load (or on demand via a
// "regenerate" action) by the caller, not on every render — otherwise every
// keystroke elsewhere in the form would silently rotate the displayed
// secrets. generate() only decides *whether* a given secret is used, based
// on the answers (e.g. a.generatePasswords), and never generates entropy
// itself.
export interface GeneratedSecrets {
  appKey: string;
  dbPassword: string;
  dbRootPassword: string;
  aiVisionApiKey: string;
  nsfwApiKey: string;
}

export interface GenerateResult {
  env: string;
  compose: string;
  // filename -> content, only populated when Docker secrets were enabled
  secretFiles: KV[];
  warnings: string[];
  secretsUsed: boolean;
  envFileUsed: boolean;
  appUrl: string;
}

const DB_CONNECTION_VALUE: Record<WizardAnswers['dbEngine'], string> = {
  mariadb: 'mysql',
  pgsql: 'pgsql',
  sqlite: 'sqlite',
};

const DB_DEFAULT_PORT: Record<WizardAnswers['dbEngine'], string> = {
  mariadb: '3306',
  pgsql: '5432',
  sqlite: '',
};

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatKV(key: string, value: string): string {
  if (value !== '' && /[ #"'$]/.test(value)) {
    value = JSON.stringify(value);
  }
  return `${key}=${value}`;
}

function boolStr(b: boolean): string {
  return b ? 'true' : 'false';
}

// extractHost pulls just the hostname out of the wizard's Application URL
// answer, for use in a Traefik Host() rule (which doesn't want a scheme,
// port, or path). Falls back to a best-effort strip if the URL doesn't
// parse (e.g. mid-edit while typing).
function extractHost(appUrl: string): string {
  try {
    return new URL(appUrl).hostname || appUrl;
  } catch {
    return appUrl.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '').split(/[/:]/)[0];
  }
}

// buildEnv produces the final .env content: envExample with envSets values
// substituted in place, plus an appended "Docker Compose overrides" section
// for overrides (and any envSets) that have no line in envExample.
function buildEnv(envExample: string, envSets: KV[], overrides: KV[]): string {
  let lines = envExample.split('\n');
  const matched = new Set<string>();

  for (const set of envSets) {
    const re = new RegExp('^#?\\s*' + escapeRegExp(set.key) + '=.*$');
    const newLines: string[] = [];
    let replacedOnce = false;
    for (const l of lines) {
      if (!replacedOnce && re.test(l)) {
        newLines.push(formatKV(set.key, set.value));
        replacedOnce = true;
        matched.add(set.key);
        continue;
      }
      newLines.push(l);
    }
    lines = newLines;
  }

  let out = lines.join('\n');
  if (!out.endsWith('\n')) out += '\n';

  const extraSets = envSets.filter((s) => !matched.has(s.key));
  const pending = [...extraSets, ...overrides];
  if (pending.length > 0) {
    out += '\n# ---- Docker Compose overrides ----\n';
    for (const o of pending) {
      out += formatKV(o.key, o.value) + '\n';
    }
  }

  return out;
}

// generate mirrors generator.Generate, minus the filesystem writes. Secret
// values are supplied by the caller (see GeneratedSecrets) rather than
// generated here.
export function generate(
  envExample: string,
  composeTemplate: string,
  a: WizardAnswers,
  secrets: GeneratedSecrets
): GenerateResult {
  const warnings: string[] = [];
  let compose = composeTemplate;
  const needsDb = needsDbService(a);

  if (!needsDb) {
    const { compose: patched, removed } = removeDbService(compose);
    compose = patched;
    if (!removed) {
      warnings.push('could not remove the bundled database service automatically; please remove `lychee_db` by hand');
    }
  }
  if (a.dbEngine === 'sqlite') {
    const { compose: patched, added } = addSqliteVolume(compose);
    compose = patched;
    if (!added) {
      warnings.push(
        'could not add a persistent volume for the SQLite database automatically; add `./lychee/database/database.sqlite:/app/database/database.sqlite` under lychee_api/lychee_worker by hand, or your data will be lost when the container is recreated'
      );
    }
  }
  if (a.enableNsfw) {
    const { compose: patched, inserted } = insertNsfwService(compose);
    compose = patched;
    if (!inserted) {
      warnings.push(
        'could not add the NSFW classification service automatically; add it to docker-compose.yaml by hand'
      );
    }
  }
  if (!a.useWorker) {
    const { compose: patched, removed } = removeWorkerService(compose);
    compose = patched;
    if (!removed) {
      warnings.push('could not remove the queue worker service automatically; please remove `lychee_worker` by hand');
    }
  }
  if (a.enablePhpMyAdmin && needsDb) {
    const { compose: patched, removed } = removePhpMyAdminProfileGate(compose);
    compose = patched;
    if (!removed) {
      warnings.push('could not enable phpMyAdmin automatically; remove its `profiles:` entry from docker-compose.yaml by hand, or it will stay off');
    }
  } else {
    const { compose: patched, removed } = removePhpMyAdminService(compose);
    compose = patched;
    if (!removed) {
      warnings.push('could not remove the phpMyAdmin service automatically; please remove `phpmyadmin` by hand');
    }
  }

  let traefikAdded = false;
  if (a.enableTraefik) {
    const { compose: patched, added } = addTraefikLabels(compose, {
      hostname: extractHost(a.appUrl),
      entrypoint: a.traefikEntrypoint,
      certResolver: a.traefikCertResolver,
    });
    compose = patched;
    traefikAdded = added;
    if (!added) {
      warnings.push('could not add Traefik labels automatically; add them to docker-compose.yaml by hand');
    }
  }

  let secretsUsed = false;
  if (a.useDockerSecrets) {
    const { patched, ok, reason } = enableDockerSecrets(compose);
    if (ok) {
      compose = patched;
      secretsUsed = true;
    } else {
      warnings.push(`could not enable Docker secrets automatically (${reason}); falling back to plain .env values`);
    }
  }

  // Collapse blank-line runs left behind by removeDbService/insertNsfwService.
  compose = compose.replace(/\n{3,}/g, '\n\n');

  const appKey = secrets.appKey;
  const dbPassword = a.generatePasswords ? secrets.dbPassword : a.dbPassword;
  const dbRootPassword = a.generatePasswords ? secrets.dbRootPassword : a.dbRootPassword;
  const aiVisionApiKey = a.enableAiVision && !a.customAiVisionKey ? secrets.aiVisionApiKey : a.aiVisionApiKey;
  const nsfwApiKey = a.enableNsfw && !a.customNsfwKey ? secrets.nsfwApiKey : a.nsfwApiKey;

  const envSets: KV[] = [
    { key: 'APP_NAME', value: a.appName },
    { key: 'APP_URL', value: a.appUrl },
    { key: 'APP_FORCE_HTTPS', value: boolStr(a.appForceHttps) },
    { key: 'TIMEZONE', value: a.timezone },
    { key: 'DB_CONNECTION', value: DB_CONNECTION_VALUE[a.dbEngine] },
    { key: 'QUEUE_CONNECTION', value: a.useWorker ? 'database' : 'sync' },
    // Traefik sits in front of Lychee on the same Docker network, so its
    // requests need to be trusted for X-Forwarded-* headers to be honored.
    { key: 'TRUSTED_PROXIES', value: a.enableTraefik ? '*' : 'null' },
  ];
  if (a.dbEngine !== 'sqlite') {
    envSets.push({ key: 'DB_DATABASE', value: a.dbDatabase }, { key: 'DB_USERNAME', value: a.dbUsername });
  }
  for (const providerId of a.activeOAuthProviders) {
    const provider = OAUTH_PROVIDERS.find((p) => p.id === providerId);
    if (!provider) continue;
    for (const field of provider.fields) {
      envSets.push({ key: field.envKey, value: a.oauthFieldValues[`${providerId}:${field.key}`] ?? '' });
    }
  }

  let secretFiles: KV[] = [];
  if (secretsUsed) {
    secretFiles = [
      { key: 'app_key', value: appKey },
      { key: 'db_password', value: dbPassword },
      { key: 'db_master_password', value: dbRootPassword },
    ];
  } else {
    envSets.push({ key: 'APP_KEY', value: appKey });
    if (a.dbEngine !== 'sqlite') {
      envSets.push({ key: 'DB_PASSWORD', value: dbPassword });
    }
  }

  const overrides: KV[] = [{ key: 'APP_PORT', value: a.appPort }];
  // docker-compose.yaml already falls back to 1000 for both (`${PUID:-1000}`),
  // so only emit them when the user actually changed the default.
  if (a.puid !== '1000') overrides.push({ key: 'PUID', value: a.puid });
  if (a.pgid !== '1000') overrides.push({ key: 'PGID', value: a.pgid });
  if (needsDb && !secretsUsed) {
    overrides.push({ key: 'DB_ROOT_PASSWORD', value: dbRootPassword });
  }
  if (!needsDb && a.dbEngine !== 'sqlite') {
    overrides.push(
      { key: 'DB_HOST', value: a.dbHost },
      { key: 'DB_PORT', value: a.dbPort || DB_DEFAULT_PORT[a.dbEngine] }
    );
  }
  const aiVisionEnabled = a.enableAiVision || a.enableNsfw;
  overrides.push({ key: 'AI_VISION_ENABLED', value: boolStr(aiVisionEnabled) });
  if (a.enableAiVision) {
    overrides.push({ key: 'AI_VISION_FACE_API_KEY', value: aiVisionApiKey });
  }
  if (a.enableNsfw) {
    overrides.push(
      { key: 'AI_VISION_NSFW_URL', value: 'http://lychee_nsfw_classification:8000' },
      { key: 'AI_VISION_NSFW_API_KEY', value: nsfwApiKey }
    );
  }

  if (a.useWorker) {
    overrides.push({ key: 'WORKER_REPLICAS', value: a.workerCount });
  }
  if (a.enableTraefik && traefikAdded) {
    overrides.push({ key: 'TRAEFIK_NETWORK', value: a.traefikNetwork });
  }

  let env = '';
  if (a.useEnvFile) {
    env = buildEnv(envExample, envSets, overrides);
  } else {
    const { compose: patched, removed } = removeEnvFileReferences(compose);
    compose = patched;
    if (!removed) {
      warnings.push('could not remove the env_file reference automatically; please remove it from docker-compose.yaml by hand');
    }
    const values: Record<string, string> = {};
    for (const kv of [...envSets, ...overrides]) values[kv.key] = kv.value;
    compose = inlineEnvVars(compose, values);
    compose = compose.replace(/\n{3,}/g, '\n\n');
  }

  return { env, compose, secretFiles, warnings, secretsUsed, envFileUsed: a.useEnvFile, appUrl: a.appUrl };
}
