// Mirrors github.com/LycheeOrg/Wizard's internal/generator/dockersecrets.go:
// patches docker-compose.yaml to activate the file-based Docker secrets
// Lychee's compose file already ships in commented-out form. Beyond the
// essential app_key/db_password/db_root_password secrets, this also wires up
// any of the "additional" secrets (OAuth client secrets, AI-vision API keys —
// see generator.ts) that the wizard answers say to use, following the same
// commented "<VAR>_FILE" convention documented at the top of the template.

interface SecretPatch {
  name: string;
  lines: string[];
  // toggle receives the block's original lines (untouched) and must return
  // the replacement lines, same length.
  toggle: (block: string[]) => string[];
}

function splitLeadingWS(line: string): { ws: string; rest: string } {
  const m = /^[ \t]*/.exec(line);
  const ws = m ? m[0] : '';
  return { ws, rest: line.slice(ws.length) };
}

// uncomment strips a leading "#" (and one following space, if present) from
// a line, preserving its original leading whitespace.
function uncomment(line: string): string {
  const { ws, rest } = splitLeadingWS(line);
  let r = rest;
  if (r.startsWith('#')) r = r.slice(1);
  if (r.startsWith(' ')) r = r.slice(1);
  return ws + r;
}

// commentOut prefixes a line with "# " right after its leading whitespace.
function commentOut(line: string): string {
  const { ws, rest } = splitLeadingWS(line);
  if (rest.startsWith('#')) return line;
  return ws + '# ' + rest;
}

function uncommentAll(block: string[]): string[] {
  return block.map(uncomment);
}

// essentialPatches apply regardless of database engine/location (they live
// in x-base-lychee-setup / x-common-env, shared by every container) and
// activate file-based Docker secrets for APP_KEY and DB_PASSWORD. If any of
// these can't be found, enableDockerSecrets reports failure.
const essentialPatches: SecretPatch[] = [
  {
    name: 'top-level secrets block',
    lines: [
      '# secrets:',
      '#   db_password:',
      '#     file: ./secrets/db_password',
      '#   db_master_password:',
      '#     file: ./secrets/db_master_password',
      '#   app_key:',
      '#     file: ./secrets/app_key',
    ],
    toggle: uncommentAll,
  },
  {
    name: 'x-base-lychee-setup secrets list',
    lines: ['# secrets:', '#   - db_password', '#   - app_key'],
    toggle: uncommentAll,
  },
  {
    name: 'APP_KEY / APP_KEY_FILE swap',
    lines: ['APP_KEY: "${APP_KEY:-}"', '# APP_KEY_FILE: "/run/secrets/app_key"'],
    toggle: (block) => [commentOut(block[0]), uncomment(block[1])],
  },
  {
    name: 'DB_PASSWORD / DB_PASSWORD_FILE swap',
    lines: [
      'DB_PASSWORD: "${DB_PASSWORD:-password}"',
      '#',
      '# Or you can uncomment the following line to use DB_PASSWORD_FILE from secrets',
      '# DB_PASSWORD_FILE: "/run/secrets/db_password"',
    ],
    toggle: (block) => [commentOut(block[0]), block[1], block[2], uncomment(block[3])],
  },
];

// optionalPatches only exist inside Lychee's bundled MariaDB service
// (`lychee_db`). They're best-effort: when the wizard answers remove or
// replace that service (SQLite, an external database, or a non-MariaDB
// engine), this text simply won't be there, and that's fine — skip silently
// rather than treating it as a failure.
const optionalPatches: SecretPatch[] = [
  {
    name: 'lychee_db secrets list',
    lines: ['# secrets:', '#     - db_master_password', '#     - db_password'],
    toggle: uncommentAll,
  },
  {
    name: 'MYSQL_ROOT_PASSWORD / MYSQL_ROOT_PASSWORD_FILE swap',
    lines: [
      '- MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD:-rootpassword}',
      '# - MYSQL_ROOT_PASSWORD_FILE=/run/secrets/db_master_password',
    ],
    toggle: (block) => [commentOut(block[0]), uncomment(block[1])],
  },
  {
    name: 'MYSQL_PASSWORD / MYSQL_PASSWORD_FILE swap',
    lines: ['- MYSQL_PASSWORD=${DB_PASSWORD:-password}', '# - MYSQL_PASSWORD_FILE=/run/secrets/db_password'],
    toggle: (block) => [commentOut(block[0]), uncomment(block[1])],
  },
];

// matchBlock finds the first index at or after `from` where the trimmed
// content of consecutive lines equals expected, in order. Returns -1 if not
// found.
function matchBlock(lines: string[], from: number, expected: string[]): number {
  if (expected.length === 0) return from;
  for (let i = from; i + expected.length <= lines.length; i++) {
    let match = true;
    for (let j = 0; j < expected.length; j++) {
      if (lines[i + j].trim() !== expected[j]) {
        match = false;
        break;
      }
    }
    if (match) return i;
  }
  return -1;
}

// applyPatch returns the start index of the matched block (so callers can
// anchor further edits off it), or -1 if the patch's text wasn't found.
function applyPatch(lines: string[], patch: SecretPatch): number {
  const start = matchBlock(lines, 0, patch.lines);
  if (start === -1) return -1;
  const block = lines.slice(start, start + patch.lines.length);
  const replacement = patch.toggle(block);
  for (let j = 0; j < replacement.length; j++) {
    lines[start + j] = replacement[j];
  }
  return start;
}

// A single extra credential (an OAuth provider's client secret, an
// AI-vision API key, …) to route through a Docker secret instead of a plain
// env var, wherever the wizard answers call for it.
export interface AdditionalSecret {
  // Secret's file name under ./secrets/, and the name registered in
  // compose's top-level `secrets:` block — matches the "/run/secrets/<name>"
  // path in the template's commented "<composeKey>_FILE" line.
  name: string;
  // The x-common-env key whose value line gets commented out in favor of
  // "<composeKey>_FILE" (e.g. "GOOGLE_CLIENT_SECRET").
  composeKey: string;
}

// swapKeyForFile comments out the (uncommented) `composeKey: value` line and
// uncomments the `composeKey_FILE: ...` line immediately after it — the same
// shape as the essential APP_KEY/DB_PASSWORD patches above, but for a
// dynamic key discovered by name rather than a fixed literal block. The
// `_FILE` companion line itself ships in two different shapes depending on
// which section of docker-compose.yaml it's in: proper YAML for the
// AI-vision keys ("# KEY_FILE: value"), but a bare, non-YAML ".env-style"
// comment for every OAuth provider ("# KEY_FILE=value") — both are handled,
// mirroring activateEnvLine's tolerance in composeEdit.ts.
function swapKeyForFile(lines: string[], composeKey: string): boolean {
  const keyRe = new RegExp(`^(\\s*)${composeKey}:\\s`);
  const idx = lines.findIndex((l) => keyRe.test(l));
  if (idx === -1) return false;

  const nextLine = lines[idx + 1] ?? '';

  const yamlFileRe = new RegExp(`^(\\s*)#\\s*${composeKey}_FILE:\\s(.*)$`);
  const yamlMatch = yamlFileRe.exec(nextLine);
  if (yamlMatch) {
    lines[idx] = commentOut(lines[idx]);
    lines[idx + 1] = `${yamlMatch[1]}${composeKey}_FILE: ${yamlMatch[2]}`;
    return true;
  }

  const bareFileRe = new RegExp(`^(\\s*)#\\s*${composeKey}_FILE=(.*)$`);
  const bareMatch = bareFileRe.exec(nextLine);
  if (bareMatch) {
    lines[idx] = commentOut(lines[idx]);
    lines[idx + 1] = `${bareMatch[1]}${composeKey}_FILE: "${bareMatch[2]}"`;
    return true;
  }

  return false;
}

export interface EnableDockerSecretsResult {
  patched: string;
  ok: boolean;
  reason?: string;
  // Which `additional` secrets (by name) were actually wired up — anything
  // requested but not found here should fall back to a plain env var.
  wired: Set<string>;
  // names present in `additional` that could not be located/wired.
  failed: string[];
}

// enableDockerSecrets patches compose (docker-compose.yaml content) to
// activate the file-based Docker secrets Lychee's compose file already ships
// in commented-out form, for both the essential app_key/db_password/
// db_root_password secrets and any `additional` ones requested. If the
// upstream file no longer contains one of the essential blocks (e.g. it was
// restructured), ok is false and reason explains what wasn't found; compose
// is returned unmodified in that case. Additional secrets are best-effort —
// individually missing ones are reported via `failed` rather than failing
// the whole operation.
export function enableDockerSecrets(compose: string, additional: AdditionalSecret[] = []): EnableDockerSecretsResult {
  const lines = compose.split('\n');

  let topSecretsEnd = -1;
  let baseSecretsEnd = -1;
  for (const patch of essentialPatches) {
    const start = applyPatch(lines, patch);
    if (start === -1) {
      return {
        patched: compose,
        ok: false,
        reason: `could not locate "${patch.name}" in docker-compose.yaml`,
        wired: new Set(),
        failed: additional.map((a) => a.name),
      };
    }
    if (patch.name === 'top-level secrets block') topSecretsEnd = start + patch.lines.length;
    if (patch.name === 'x-base-lychee-setup secrets list') baseSecretsEnd = start + patch.lines.length;
  }

  for (const patch of optionalPatches) {
    applyPatch(lines, patch);
  }

  const wired = new Set<string>();
  const failed: string[] = [];
  const topInserts: string[] = [];
  const baseInserts: string[] = [];
  for (const secret of additional) {
    if (swapKeyForFile(lines, secret.composeKey)) {
      wired.add(secret.name);
      topInserts.push(`  ${secret.name}:`, `    file: ./secrets/${secret.name}`);
      baseInserts.push(`    - ${secret.name}`);
    } else {
      failed.push(secret.name);
    }
  }

  // Insert at the later position first so the earlier one's index stays valid.
  if (baseInserts.length > 0) lines.splice(baseSecretsEnd, 0, ...baseInserts);
  if (topInserts.length > 0) lines.splice(topSecretsEnd, 0, ...topInserts);

  return { patched: lines.join('\n'), ok: true, wired, failed };
}
