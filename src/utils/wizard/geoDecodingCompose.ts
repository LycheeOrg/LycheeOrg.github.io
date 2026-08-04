// Toggles Lychee's bundled `lychee_geo_decoding` service, which upstream
// ships profile-gated (`profiles: [geo-decoding]`, off by default). Mirrors
// nsfwCompose.ts / phpMyAdminCompose.ts: when wanted, the `profiles:` gate
// is stripped so it starts unconditionally; when not, the whole service is
// removed outright. Unlike NSFW, it has no companion named volume to clean
// up — the service keeps no persistent data.

import { removeIndentedBlock } from './composeEdit';

const SERVICE_ANCHOR = /^ {2}lychee_geo_decoding:\s*$/;

export interface RemoveGeoDecodingServiceResult {
  compose: string;
  removed: boolean;
}

export function removeGeoDecodingService(compose: string): RemoveGeoDecodingServiceResult {
  const lines = compose.split('\n');
  const patched = removeIndentedBlock(lines, SERVICE_ANCHOR);
  return { compose: patched.join('\n'), removed: patched.length !== lines.length };
}

export interface EnsureGeoDecodingUrlVarResult {
  compose: string;
  ensured: boolean;
}

// ensureGeoDecodingUrlVar declares LOCAL_GEO_DECODING_URL in x-common-env.
// Unlike AI_VISION_FACE_URL/AI_VISION_NSFW_URL, upstream doesn't declare
// this one in docker-compose.yaml at all — it's documented in .env.example
// only, as a "bring your own service" var — so there's no existing
// commented line to activate; this inserts a fresh one, right before the
// top-level `services:` key (i.e. at the end of x-common-env).
export function ensureGeoDecodingUrlVar(compose: string): EnsureGeoDecodingUrlVarResult {
  const lines = compose.split('\n');
  if (lines.some((l) => /^\s*LOCAL_GEO_DECODING_URL:\s/.test(l))) return { compose, ensured: true };

  const servicesIdx = lines.findIndex((l) => /^services:\s*$/.test(l));
  if (servicesIdx === -1) return { compose, ensured: false };

  const insertion = [
    '  ###################################################################',
    '  # Local reverse geo-decoding',
    '  ###################################################################',
    '  LOCAL_GEO_DECODING_URL: "${LOCAL_GEO_DECODING_URL:-}"',
    '',
  ];
  lines.splice(servicesIdx, 0, ...insertion);
  return { compose: lines.join('\n'), ensured: true };
}

export interface RemoveGeoDecodingProfileGateResult {
  compose: string;
  removed: boolean;
}

// removeGeoDecodingProfileGate strips only the `profiles:` block nested
// under lychee_geo_decoding. Searching for `profiles:` is scoped to start
// after the service anchor line — phpmyadmin and lychee_nsfw_classification
// also have their own `profiles:` gates elsewhere in the file, so an
// unscoped search could hit the wrong one.
export function removeGeoDecodingProfileGate(compose: string): RemoveGeoDecodingProfileGateResult {
  const lines = compose.split('\n');
  const serviceIdx = lines.findIndex((l) => SERVICE_ANCHOR.test(l));
  if (serviceIdx === -1) return { compose, removed: false };

  const head = lines.slice(0, serviceIdx + 1);
  const tail = removeIndentedBlock(lines.slice(serviceIdx + 1), /^ {4}profiles:\s*$/);
  const removed = tail.length !== lines.length - serviceIdx - 1;

  return { compose: [...head, ...tail].join('\n'), removed };
}
