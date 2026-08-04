// Shared docker-compose.yaml editing primitives used across the wizard's
// compose patches: removing a whole service block by indentation shape
// rather than literal text match (see dbCompose.ts's module comment for why
// that's preferable), and activating an x-common-env line regardless of
// which shape upstream currently ships it in.

// activateEnvLine ensures `key` is a live x-common-env entry (mutates
// `lines` in place), tolerating whichever of the shapes Lychee's own
// docker-compose.yaml has shipped `key` in:
//   - already active YAML: `KEY: "value"` — left untouched.
//   - commented YAML: `# KEY: "value"` — uncommented as-is.
//   - a bare, non-YAML ".env-style" comment reminding the reader the var
//     exists: `# KEY=default` — rewritten into real YAML,
//     `KEY: "${KEY:-default}"`, preserving whatever default followed `=`.
// This matters because loadTemplates() normally fetches the *live* template
// from GitHub rather than the bundled fallback snapshot, and upstream ships
// most of these as the inert third form — a wizard answer that depends on
// one of them can't assume any particular shape going in. Returns whether
// `key` ended up active (found in one of the three shapes, or already was).
export function activateEnvLine(lines: string[], key: string): boolean {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  if (lines.some((l) => new RegExp(`^\\s*${escaped}:\\s`).test(l))) return true;

  const yamlRe = new RegExp(`^(\\s*)#\\s*${escaped}:\\s(.*)$`);
  const yamlIdx = lines.findIndex((l) => yamlRe.test(l));
  if (yamlIdx !== -1) {
    const m = yamlRe.exec(lines[yamlIdx])!;
    lines[yamlIdx] = `${m[1]}${key}: ${m[2]}`;
    return true;
  }

  const bareRe = new RegExp(`^(\\s*)#\\s*${escaped}=(.*)$`);
  const bareIdx = lines.findIndex((l) => bareRe.test(l));
  if (bareIdx !== -1) {
    const m = bareRe.exec(lines[bareIdx])!;
    lines[bareIdx] = `${m[1]}${key}: "\${${key}:-${m[2]}}"`;
    return true;
  }

  return false;
}

// activateEnvLines is activateEnvLine for a whole compose string at once —
// the form generator.ts actually wants. Returns the patched compose plus
// whichever of `keys` couldn't be found in any recognized shape.
export function activateEnvLines(compose: string, keys: string[]): { compose: string; missing: string[] } {
  const lines = compose.split('\n');
  const missing: string[] = [];
  for (const key of keys) {
    if (!activateEnvLine(lines, key)) missing.push(key);
  }
  return { compose: lines.join('\n'), missing };
}

// removeIndentedBlock removes the line matching startLineRegex and every
// following line that's indented deeper than it, i.e. its whole nested
// block. A single blank line immediately before the block is swallowed too,
// so removal doesn't leave a double blank line behind.
//
// eatPrecedingComment additionally swallows a contiguous run of same-indent
// `#` comment lines directly above the block (e.g. a banner header
// describing it) — off by default, since not every such comment is actually
// specific to the block being removed. envFileCompose.ts's env_file:
// removal, for instance, sits right under a general "how to configure
// Lychee" comment that should stay even once env_file: is gone.
export function removeIndentedBlock(lines: string[], startLineRegex: RegExp, eatPrecedingComment = false): string[] {
  const start = lines.findIndex((l) => startLineRegex.test(l));
  if (start === -1) return lines;

  const indent = (/^ */.exec(lines[start]) ?? [''])[0].length;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const m = /^( *)\S/.exec(lines[i]);
    if (m && m[1].length <= indent) {
      end = i;
      break;
    }
  }

  let removeStart = start;
  if (eatPrecedingComment) {
    const commentRe = new RegExp(`^ {${indent}}#`);
    while (removeStart > 0 && commentRe.test(lines[removeStart - 1])) {
      removeStart -= 1;
    }
  }
  if (removeStart > 0 && lines[removeStart - 1].trim() === '') removeStart -= 1;
  return [...lines.slice(0, removeStart), ...lines.slice(end)];
}
