// Based on github.com/LycheeOrg/Wizard's internal/generator/generator.go:
// turns the fetched/embedded Lychee templates plus the wizard's answers into
// docker-compose.yaml, .env, and (when requested) Docker secrets file
// contents. Unlike the Go CLI, nothing is written to disk here — callers
// get strings back to display, copy, or download. Extended with database
// engine/location and NSFW classification, which the CLI doesn't offer.
import { enableDockerSecrets } from './dockerSecrets';
import { removeDbService, addSqliteVolume } from './dbCompose';
import { insertNsfwService } from './nsfwService';
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
        'could not add a persistent volume for the SQLite database automatically; add `./lychee/database:/app/database` under lychee_api/lychee_worker by hand, or your data will be lost when the container is recreated'
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
  ];
  if (a.dbEngine !== 'sqlite') {
    envSets.push({ key: 'DB_DATABASE', value: a.dbDatabase }, { key: 'DB_USERNAME', value: a.dbUsername });
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

  const overrides: KV[] = [
    { key: 'PUID', value: a.puid },
    { key: 'PGID', value: a.pgid },
    { key: 'APP_PORT', value: a.appPort },
  ];
  if (needsDb && !secretsUsed) {
    overrides.push({ key: 'DB_ROOT_PASSWORD', value: dbRootPassword });
  }
  if (!needsDb && a.dbEngine !== 'sqlite') {
    overrides.push(
      { key: 'DB_HOST', value: a.dbHost },
      { key: 'DB_PORT', value: a.dbPort || DB_DEFAULT_PORT[a.dbEngine] }
    );
  }
  if (a.enablePhpMyAdmin && needsDb) {
    overrides.push({ key: 'COMPOSE_PROFILES', value: 'phpmyadmin' });
  }

  const aiVisionEnabled = a.enableAiVision || a.enableNsfw;
  overrides.push({ key: 'AI_VISION_ENABLED', value: boolStr(aiVisionEnabled) });
  if (a.enableAiVision) {
    overrides.push({ key: 'AI_VISION_API_KEY', value: aiVisionApiKey });
  }
  if (a.enableNsfw) {
    overrides.push(
      { key: 'AI_VISION_NSFW_URL', value: 'http://lychee_nsfw_classification:8000' },
      { key: 'AI_VISION_NSFW_API_KEY', value: nsfwApiKey }
    );
  }

  const env = buildEnv(envExample, envSets, overrides);

  return { env, compose, secretFiles, warnings, secretsUsed, appUrl: a.appUrl };
}
