// Structural (indent-based) edits to docker-compose.yaml for database engine
/// location choices that github.com/LycheeOrg/Wizard's CLI doesn't offer
// (it always ships the bundled MariaDB service). Unlike dockerSecrets.ts,
// these don't match literal upstream text — they match by YAML indentation
// shape, so they degrade gracefully (best-effort, no-op if not found) even
// if upstream reformats comments inside the blocks they touch.

import { removeIndentedBlock } from './composeEdit';

// removeDependsOnEntry removes a `<service>:\n  condition: service_healthy`
// pair from under any `depends_on:` mapping, and removes the now-empty
// `depends_on:` line itself if that entry was its only child.
function removeDependsOnEntry(lines: string[], serviceName: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const keyMatch = new RegExp(`^(\\s+)${serviceName}:\\s*$`).exec(line);
    const next = lines[i + 1] ?? '';
    if (keyMatch && /^\s+condition:\s*service_healthy\s*$/.test(next)) {
      const indent = keyMatch[1].length;
      const after = lines[i + 2] ?? '';
      const hasMoreSiblings = new RegExp(`^ {${indent}}\\S`).test(after);
      const prevPushed = out[out.length - 1];
      const dependsOnRe = new RegExp(`^ {${Math.max(indent - 2, 0)}}depends_on:\\s*$`);
      if (!hasMoreSiblings && prevPushed !== undefined && dependsOnRe.test(prevPushed)) {
        out.pop();
      }
      i += 1; // also skip the `condition:` line
      continue;
    }
    out.push(line);
  }
  return out;
}

export interface RemoveDbServiceResult {
  compose: string;
  removed: boolean;
}

// removeDbService strips Lychee's bundled `lychee_db` (MariaDB) service —
// used when the wizard answers call for SQLite or an externally-managed
// database — along with every `depends_on: lychee_db: …` reference to it and
// its now-orphaned `mysql:` named volume, so the resulting compose file
// stays valid on its own.
export function removeDbService(compose: string): RemoveDbServiceResult {
  let lines = compose.split('\n');
  const before = lines.length;

  lines = removeIndentedBlock(lines, /^ {2}lychee_db:\s*$/);
  const removed = lines.length !== before;

  lines = removeDependsOnEntry(lines, 'lychee_db');
  lines = removeIndentedBlock(lines, /^ {2}mysql:\s*$/);

  return { compose: lines.join('\n'), removed };
}

export interface AddSqliteVolumeResult {
  compose: string;
  added: boolean;
}

// addSqliteVolume mounts a host directory onto /app/database, right after
// the existing uploads/logs/tmp mounts in the shared x-base-lychee-setup
// anchor (so both lychee_api and lychee_worker inherit it). Without this,
// SQLite's database.sqlite (Laravel's database_path() default — see
// config/database.php) lives only inside the container's writable layer and
// is lost on `docker compose down` / container recreation.
export function addSqliteVolume(compose: string): AddSqliteVolumeResult {
  const lines = compose.split('\n');
  const anchor = '    - ./lychee/tmp:/app/storage/tmp';
  const idx = lines.findIndex((l) => l === anchor);
  if (idx === -1) return { compose, added: false };

  const insertion = [
    '    # Database: where the SQLite database file is stored, so it persists',
    '    # across container restarts/recreation.',
    '    - ./lychee/database:/app/database',
  ];
  const newLines = [...lines.slice(0, idx + 1), ...insertion, ...lines.slice(idx + 1)];
  return { compose: newLines.join('\n'), added: true };
}
