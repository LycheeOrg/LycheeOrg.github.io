// Toggles Lychee's bundled `lychee_nsfw_classification` service, which
// upstream ships profile-gated (`profiles: [nsfw]`, off by default) rather
// than synthesizing it from scratch the way this module used to. Mirrors
// phpMyAdminCompose.ts / removePhpMyAdminProfileGate: when wanted, the
// `profiles:` gate is stripped so it starts unconditionally regardless of
// COMPOSE_PROFILES/.env; when not, the whole service (and its queue volume)
// is removed outright.

import { removeIndentedBlock } from './composeEdit';

const SERVICE_ANCHOR = /^ {2}lychee_nsfw_classification:\s*$/;

export interface RemoveNsfwServiceResult {
  compose: string;
  removed: boolean;
}

export function removeNsfwService(compose: string): RemoveNsfwServiceResult {
  let lines = compose.split('\n');
  const before = lines.length;

  lines = removeIndentedBlock(lines, SERVICE_ANCHOR);
  const removed = lines.length !== before;

  lines = removeIndentedBlock(lines, /^ {2}nsfw_queue:\s*$/);

  return { compose: lines.join('\n'), removed };
}

export interface RemoveNsfwProfileGateResult {
  compose: string;
  removed: boolean;
}

// removeNsfwProfileGate strips only the `profiles:` block nested under
// lychee_nsfw_classification. Searching for `profiles:` is scoped to start
// after the service anchor line — phpmyadmin and lychee_geo_decoding also
// have their own `profiles:` gates elsewhere in the file, so an unscoped
// search could hit the wrong one.
export function removeNsfwProfileGate(compose: string): RemoveNsfwProfileGateResult {
  const lines = compose.split('\n');
  const serviceIdx = lines.findIndex((l) => SERVICE_ANCHOR.test(l));
  if (serviceIdx === -1) return { compose, removed: false };

  const head = lines.slice(0, serviceIdx + 1);
  const tail = removeIndentedBlock(lines.slice(serviceIdx + 1), /^ {4}profiles:\s*$/);
  const removed = tail.length !== lines.length - serviceIdx - 1;

  return { compose: [...head, ...tail].join('\n'), removed };
}
