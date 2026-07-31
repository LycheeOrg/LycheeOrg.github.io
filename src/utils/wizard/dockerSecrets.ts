// Mirrors github.com/LycheeOrg/Wizard's internal/generator/dockersecrets.go:
// patches docker-compose.yaml to activate the file-based Docker secrets
// Lychee's compose file already ships in commented-out form.

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

export interface EnableDockerSecretsResult {
  patched: string;
  ok: boolean;
  reason?: string;
}

// enableDockerSecrets patches compose (docker-compose.yaml content) to
// activate the file-based Docker secrets Lychee's compose file already ships
// in commented-out form. If the upstream file no longer contains one of the
// expected blocks (e.g. it was restructured), ok is false and reason
// explains what wasn't found; compose is returned unmodified in that case.
function applyPatch(lines: string[], patch: SecretPatch): boolean {
  const start = matchBlock(lines, 0, patch.lines);
  if (start === -1) return false;
  const block = lines.slice(start, start + patch.lines.length);
  const replacement = patch.toggle(block);
  for (let j = 0; j < replacement.length; j++) {
    lines[start + j] = replacement[j];
  }
  return true;
}

export function enableDockerSecrets(compose: string): EnableDockerSecretsResult {
  const lines = compose.split('\n');

  for (const patch of essentialPatches) {
    if (!applyPatch(lines, patch)) {
      return {
        patched: compose,
        ok: false,
        reason: `could not locate "${patch.name}" in docker-compose.yaml`,
      };
    }
  }

  for (const patch of optionalPatches) {
    applyPatch(lines, patch);
  }

  return { patched: lines.join('\n'), ok: true };
}
