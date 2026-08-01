// Shared structural (indentation-based) YAML editing helper for
// docker-compose.yaml patches that remove a whole service block by shape
// rather than literal text match — see dbCompose.ts's module comment for
// why that's preferable to a literal patch here.

// removeIndentedBlock removes the line matching startLineRegex and every
// following line that's indented deeper than it, i.e. its whole nested
// block. A single blank line immediately before the block is swallowed too,
// so removal doesn't leave a double blank line behind.
export function removeIndentedBlock(lines: string[], startLineRegex: RegExp): string[] {
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
  if (start > 0 && lines[start - 1].trim() === '') removeStart = start - 1;
  return [...lines.slice(0, removeStart), ...lines.slice(end)];
}
