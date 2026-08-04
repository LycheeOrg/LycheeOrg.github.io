// Patches applied when the wizard answers say not to use a separate .env
// file — everything the wizard would otherwise have written there gets
// baked directly into docker-compose.yaml instead, and the env_file
// references (which would point at a file that no longer exists) are
// stripped.

import { removeIndentedBlock } from './composeEdit';

export interface RemoveEnvFileReferencesResult {
  compose: string;
  removed: boolean;
}

// removeEnvFileReferences strips both `env_file: [{path: ./.env, ...}]`
// blocks — the one in x-base-lychee-setup (inherited by lychee_api and
// lychee_worker) and the one on lychee_db.
export function removeEnvFileReferences(compose: string): RemoveEnvFileReferencesResult {
  let lines = compose.split('\n');
  let removedAny = false;

  // removeIndentedBlock only strips the first match per call; keep calling
  // it until no more env_file: blocks are found (normally two: the one in
  // x-base-lychee-setup and the one on lychee_db, but this stays correct
  // even if that count ever changes — this project fetches the *live*
  // upstream template by default, not just the bundled snapshot).
  while (true) {
    const before = lines.length;
    lines = removeIndentedBlock(lines, /^\s*env_file:\s*$/);
    if (lines.length === before) break;
    removedAny = true;
  }

  return { compose: lines.join('\n'), removed: removedAny };
}

export interface RemovePhpMyAdminProfileGateResult {
  compose: string;
  removed: boolean;
}

// removePhpMyAdminProfileGate strips phpmyadmin's `profiles: [phpmyadmin]`
// gate. Normally that's flipped on via COMPOSE_PROFILES in .env; without a
// .env file there's no clean way to set it, so if the wizard answers asked
// for phpMyAdmin, it needs to just always start instead.
export function removePhpMyAdminProfileGate(compose: string): RemovePhpMyAdminProfileGateResult {
  const lines = compose.split('\n');
  const patched = removeIndentedBlock(lines, /^\s*profiles:\s*$/);
  return { compose: patched.join('\n'), removed: patched.length !== lines.length };
}

const VAR_PATTERN = /\$\{([A-Za-z_][A-Za-z0-9_]*)(:-([^}]*))?\}/g;

// inlineEnvVars replaces every `${KEY}` / `${KEY:-default}` left in compose
// with a literal value: the wizard-computed value if there is one, else the
// template's own fallback default. Substitution is document-wide by design
// — e.g. DB_PASSWORD is interpolated both in lychee_api/lychee_worker's
// environment and in lychee_db's MYSQL_PASSWORD, and both need to end up
// with the *same* literal value for auth between the containers to work.
export function inlineEnvVars(compose: string, values: Record<string, string>): string {
  return compose.replace(VAR_PATTERN, (_match, key: string, _hasDefault, def: string | undefined) => {
    if (Object.prototype.hasOwnProperty.call(values, key)) return values[key];
    return def ?? '';
  });
}
