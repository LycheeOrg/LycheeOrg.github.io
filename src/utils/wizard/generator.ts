// Based on github.com/LycheeOrg/Wizard's internal/generator/generator.go:
// turns the fetched/embedded Lychee templates plus the wizard's answers into
// docker-compose.yaml, .env, and (when requested) Docker secrets file
// contents. Unlike the Go CLI, nothing is written to disk here — callers
// get strings back to display, copy, or download. Extended with database
// engine/location and NSFW classification, which the CLI doesn't offer.
import { enableDockerSecrets } from './dockerSecrets';
import { activateEnvLines } from './composeEdit';
import { removeDbService, addSqliteVolume } from './dbCompose';
import { setVolumePaths } from './volumesCompose';
import { removeNsfwProfileGate, removeNsfwService } from './nsfwCompose';
import { removeGeoDecodingProfileGate, removeGeoDecodingService, ensureGeoDecodingUrlVar } from './geoDecodingCompose';
import { removeWorkerService, ensureWorkerScale } from './workerCompose';
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
    const { compose: patched, added } = addSqliteVolume(compose, a.volumeDatabasePath);
    compose = patched;
    if (!added) {
      warnings.push(
        `could not add a persistent volume for the SQLite database automatically; add \`${a.volumeDatabasePath}:/app/database/database.sqlite\` under lychee_api/lychee_worker by hand, or your data will be lost when the container is recreated`
      );
    }
  }
  {
    const { compose: patched, found } = setVolumePaths(compose, {
      uploads: a.volumeUploadsPath,
      logs: a.volumeLogsPath,
      tmp: a.volumeTmpPath,
    });
    compose = patched;
    if (!found.uploads) {
      warnings.push('could not find the uploads volume mount in docker-compose.yaml to customize; add it by hand');
    }
    if (!found.logs) {
      warnings.push('could not find the logs volume mount in docker-compose.yaml to customize; add it by hand');
    }
    if (!found.tmp) {
      warnings.push('could not find the tmp volume mount in docker-compose.yaml to customize; add it by hand');
    }
  }
  if (a.enableNsfw) {
    const { compose: patched, removed } = removeNsfwProfileGate(compose);
    compose = patched;
    if (!removed) {
      warnings.push('could not enable the NSFW classification service automatically; remove its `profiles:` entry from docker-compose.yaml by hand, or it will stay off');
    }
  } else {
    const { compose: patched, removed } = removeNsfwService(compose);
    compose = patched;
    if (!removed) {
      warnings.push('could not remove the NSFW classification service automatically; please remove `lychee_nsfw_classification` by hand');
    }
  }
  if (a.enableGeoDecoding) {
    const { compose: patched, removed } = removeGeoDecodingProfileGate(compose);
    compose = patched;
    if (!removed) {
      warnings.push('could not enable the local reverse geo-decoding service automatically; remove its `profiles:` entry from docker-compose.yaml by hand, or it will stay off');
    }
    const { compose: withUrlVar, ensured } = ensureGeoDecodingUrlVar(compose);
    compose = withUrlVar;
    if (!ensured) {
      warnings.push('could not add LOCAL_GEO_DECODING_URL to docker-compose.yaml automatically; add it under x-common-env by hand, or the service will run unused');
    }
  } else {
    const { compose: patched, removed } = removeGeoDecodingService(compose);
    compose = patched;
    if (!removed) {
      warnings.push('could not remove the local reverse geo-decoding service automatically; please remove `lychee_geo_decoding` by hand');
    }
  }
  if (!a.useWorker) {
    const { compose: patched, removed } = removeWorkerService(compose);
    compose = patched;
    if (!removed) {
      warnings.push('could not remove the queue worker service automatically; please remove `lychee_worker` by hand');
    }
  } else {
    const { compose: patched, ensured } = ensureWorkerScale(compose);
    compose = patched;
    if (!ensured) {
      warnings.push('could not make the queue worker scalable automatically; the WORKER_REPLICAS setting will have no effect until you replace `lychee_worker`\'s `container_name:` with `scale: ${WORKER_REPLICAS:-1}` by hand');
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

  // loadTemplates() normally fetches the *live* upstream template rather
  // than the bundled fallback snapshot, and upstream ships TRUSTED_PROXIES,
  // every OAuth var, and the NSFW AI-vision vars as inert comments (either
  // "# KEY: value" or a bare "# KEY=default" reminder) rather than active
  // YAML — unlike AI_VISION_FACE_*, which upstream already ships active.
  // Activate exactly what this generation actually needs before anything
  // below (docker secrets, envSets, inlining) assumes it's live.
  const keysToActivate = ['TRUSTED_PROXIES'];
  for (const providerId of a.activeOAuthProviders) {
    const provider = OAUTH_PROVIDERS.find((p) => p.id === providerId);
    if (!provider) continue;
    keysToActivate.push(...provider.fields.map((f) => f.envKey));
  }
  if (a.enableNsfw) {
    keysToActivate.push('AI_VISION_NSFW_URL', 'AI_VISION_NSFW_API_KEY');
  }
  const { compose: activated, missing: missingEnvLines } = activateEnvLines(compose, keysToActivate);
  compose = activated;
  for (const key of missingEnvLines) {
    warnings.push(`could not find "${key}" in docker-compose.yaml to activate; add it under x-common-env by hand`);
  }

  const appKey = secrets.appKey;
  const dbPassword = a.generatePasswords ? secrets.dbPassword : a.dbPassword;
  const dbRootPassword = a.generatePasswords ? secrets.dbRootPassword : a.dbRootPassword;
  const aiVisionApiKey = a.enableAiVision && !a.customAiVisionKey ? secrets.aiVisionApiKey : a.aiVisionApiKey;
  const nsfwApiKey = a.enableNsfw && !a.customNsfwKey ? secrets.nsfwApiKey : a.nsfwApiKey;

  // Every OAuth client secret and AI-vision API key currently in play is a
  // candidate for its own Docker secret, alongside the essential app_key/
  // db_password/db_root_password ones — matching the "<VAR>_FILE" convention
  // docker-compose.yaml documents for every credential, not just those
  // three. Blank values are skipped: nothing sensitive to protect, and it'd
  // otherwise create an empty, pointless secrets file.
  const additionalSecrets: (KV & { composeKey: string })[] = [];
  for (const providerId of a.activeOAuthProviders) {
    const provider = OAUTH_PROVIDERS.find((p) => p.id === providerId);
    if (!provider) continue;
    for (const field of provider.fields) {
      if (!field.secretFile) continue;
      const value = a.oauthFieldValues[`${providerId}:${field.key}`] ?? '';
      if (value.trim() === '') continue;
      additionalSecrets.push({ key: field.secretFile, composeKey: field.envKey, value });
    }
  }
  if (a.enableAiVision && aiVisionApiKey.trim() !== '') {
    additionalSecrets.push({ key: 'ai_vision_face_api_key', composeKey: 'AI_VISION_FACE_API_KEY', value: aiVisionApiKey });
  }
  if (a.enableNsfw && nsfwApiKey.trim() !== '') {
    additionalSecrets.push({ key: 'ai_vision_nsfw_api_key', composeKey: 'AI_VISION_NSFW_API_KEY', value: nsfwApiKey });
  }

  let secretsUsed = false;
  let wired: Set<string> = new Set();
  if (a.useDockerSecrets) {
    const { patched, ok, reason, wired: w, failed } = enableDockerSecrets(
      compose,
      additionalSecrets.map((s) => ({ name: s.key, composeKey: s.composeKey }))
    );
    if (ok) {
      compose = patched;
      secretsUsed = true;
      wired = w;
      for (const name of failed) {
        warnings.push(`could not enable a Docker secret for "${name}" automatically; it was written to .env in plain text instead`);
      }
    } else {
      warnings.push(`could not enable Docker secrets automatically (${reason}); falling back to plain .env values`);
    }
  }

  // Collapse blank-line runs left behind by removeDbService/removeNsfwService.
  compose = compose.replace(/\n{3,}/g, '\n\n');

  const envSets: KV[] = [
    { key: 'APP_NAME', value: a.appName },
    { key: 'APP_URL', value: a.appUrl },
    { key: 'APP_FORCE_HTTPS', value: boolStr(a.appForceHttps) },
    { key: 'TIMEZONE', value: a.timezone },
    { key: 'DB_CONNECTION', value: DB_CONNECTION_VALUE[a.dbEngine] },
    { key: 'QUEUE_CONNECTION', value: a.useWorker ? 'database' : 'sync' },
    // An explicit value on the General step always wins. Left blank, fall
    // back to the same automatic default as before: Traefik sits in front of
    // Lychee on the same Docker network, so its requests need to be trusted
    // for X-Forwarded-* headers to be honored once it's enabled.
    { key: 'TRUSTED_PROXIES', value: a.trustedProxies.trim() || (a.enableTraefik ? '*' : 'null') },
  ];
  if (a.dbEngine !== 'sqlite') {
    envSets.push({ key: 'DB_DATABASE', value: a.dbDatabase }, { key: 'DB_USERNAME', value: a.dbUsername });
  }
  if (a.enableGeoDecoding) {
    envSets.push({ key: 'LOCAL_GEO_DECODING_URL', value: 'http://lychee_geo_decoding:8080' });
  }
  for (const providerId of a.activeOAuthProviders) {
    const provider = OAUTH_PROVIDERS.find((p) => p.id === providerId);
    if (!provider) continue;
    for (const field of provider.fields) {
      if (field.secretFile && wired.has(field.secretFile)) continue;
      envSets.push({ key: field.envKey, value: a.oauthFieldValues[`${providerId}:${field.key}`] ?? '' });
    }
  }

  let secretFiles: KV[] = [];
  if (secretsUsed) {
    secretFiles = [
      { key: 'app_key', value: appKey },
      { key: 'db_password', value: dbPassword },
      { key: 'db_master_password', value: dbRootPassword },
      ...additionalSecrets.filter((s) => wired.has(s.key)).map((s) => ({ key: s.key, value: s.value })),
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
  if (a.enableAiVision && !wired.has('ai_vision_face_api_key')) {
    overrides.push({ key: 'AI_VISION_API_KEY', value: aiVisionApiKey });
  }
  if (a.enableAiVision) {
    // docker-compose.yaml already falls back to these same defaults (e.g.
    // `${VISION_FACE_MAX_FACES_PER_PHOTO:-10}`), so only emit an override
    // when the user actually changed one.
    if (a.aiVisionMaxFacesPerPhoto !== '10') {
      overrides.push({ key: 'VISION_FACE_MAX_FACES_PER_PHOTO', value: a.aiVisionMaxFacesPerPhoto });
    }
    if (a.aiVisionMinFaceSizePixels !== '0') {
      overrides.push({ key: 'VISION_FACE_MIN_FACE_SIZE_PIXELS', value: a.aiVisionMinFaceSizePixels });
    }
    if (a.aiVisionBlurThreshold !== '0.5') {
      overrides.push({ key: 'VISION_FACE_BLUR_THRESHOLD', value: a.aiVisionBlurThreshold });
    }
    if (a.aiVisionClusterEps !== '0.3') {
      overrides.push({ key: 'VISION_FACE_CLUSTER_EPS', value: a.aiVisionClusterEps });
    }
    if (a.aiVisionQueueMaxSize !== '0') {
      overrides.push({ key: 'VISION_FACE_QUEUE_MAX_SIZE', value: a.aiVisionQueueMaxSize });
    }
    if (a.aiVisionThreadPoolSize !== '1') {
      overrides.push({ key: 'VISION_FACE_THREAD_POOL_SIZE', value: a.aiVisionThreadPoolSize });
    }
    if (a.aiVisionWorkers !== '1') {
      overrides.push({ key: 'VISION_FACE_WORKERS', value: a.aiVisionWorkers });
    }
  }
  if (a.enableNsfw) {
    overrides.push({ key: 'AI_VISION_NSFW_URL', value: 'http://lychee_nsfw_classification:8000' });
    if (!wired.has('ai_vision_nsfw_api_key')) {
      overrides.push({ key: 'AI_VISION_NSFW_API_KEY', value: nsfwApiKey });
    }
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
