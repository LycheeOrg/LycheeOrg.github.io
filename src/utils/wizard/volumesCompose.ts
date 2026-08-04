// Literal-text edits to docker-compose.yaml for customizing the host-side
// paths of Lychee's persistent bind mounts. Same literal-match approach as
// dockerSecrets.ts: replace every occurrence of the default path text. The
// uploads path in particular shows up three times — the main mount in
// x-base-lychee-setup, plus the read-only mounts the AI-vision/NSFW sidecar
// services use for photo access — a single global replace keeps all three in
// sync from one wizard answer.

export const DEFAULT_UPLOADS_PATH = './lychee/uploads';
export const DEFAULT_LOGS_PATH = './lychee/logs';
export const DEFAULT_TMP_PATH = './lychee/tmp';

export interface VolumePaths {
  uploads: string;
  logs: string;
  tmp: string;
}

export interface SetVolumePathsResult {
  compose: string;
  // Which of the three paths were actually found (and replaced, if changed
  // from the default) — false means the anchor text wasn't in the compose
  // file at all, which callers should surface as a warning.
  found: { uploads: boolean; logs: boolean; tmp: boolean };
}

function replaceAll(compose: string, from: string, to: string): { compose: string; found: boolean } {
  const found = compose.includes(from);
  if (!found || from === to) return { compose, found };
  return { compose: compose.split(from).join(to), found };
}

export function setVolumePaths(compose: string, paths: VolumePaths): SetVolumePathsResult {
  const uploads = replaceAll(compose, DEFAULT_UPLOADS_PATH, paths.uploads);
  const logs = replaceAll(uploads.compose, DEFAULT_LOGS_PATH, paths.logs);
  const tmp = replaceAll(logs.compose, DEFAULT_TMP_PATH, paths.tmp);
  return {
    compose: tmp.compose,
    found: { uploads: uploads.found, logs: logs.found, tmp: tmp.found },
  };
}
