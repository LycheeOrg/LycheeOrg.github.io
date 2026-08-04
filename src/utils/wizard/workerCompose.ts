// Removes Lychee's bundled queue worker service (`lychee_worker`) — used
// when the wizard answers say not to run one. QUEUE_CONNECTION falls back
// to `sync` in that case (see generator.ts), so a worker container would
// just sit idle with nothing to consume.

import { removeIndentedBlock } from './composeEdit';

export interface RemoveWorkerServiceResult {
  compose: string;
  removed: boolean;
}

export function removeWorkerService(compose: string): RemoveWorkerServiceResult {
  const lines = compose.split('\n');
  // eatPrecedingComment: docker-compose.yaml's queue-worker banner comment
  // (the "##### Queue Worker Service #####" header) sits directly above
  // lychee_worker: and describes only this service, so it should go with it
  // — otherwise it's left as an orphaned comment in the generated file.
  const patched = removeIndentedBlock(lines, /^ {2}lychee_worker:\s*$/, true);
  return { compose: patched.join('\n'), removed: patched.length !== lines.length };
}

export interface EnsureWorkerScaleResult {
  compose: string;
  ensured: boolean;
}

// ensureWorkerScale lets the wizard's WORKER_REPLICAS setting actually do
// something — Lychee's own compose file runs a single fixed worker
// (`container_name: lychee-worker`), which is incompatible with Compose's
// `scale:` (it requires Compose to name replica containers itself). If
// `scale:` isn't already there, this swaps that line for
// `scale: ${WORKER_REPLICAS:-1}` inside the lychee_worker service
// specifically (never lychee_api, which has its own container_name).
export function ensureWorkerScale(compose: string): EnsureWorkerScaleResult {
  const lines = compose.split('\n');
  const serviceIdx = lines.findIndex((l) => /^ {2}lychee_worker:\s*$/.test(l));
  if (serviceIdx === -1) return { compose, ensured: false };

  for (let i = serviceIdx + 1; i < lines.length; i++) {
    const m = /^( *)\S/.exec(lines[i]);
    if (m && m[1].length <= 2) break; // left the service's own block

    if (/^ {4}scale:\s/.test(lines[i])) return { compose, ensured: true };
    if (/^ {4}container_name:\s/.test(lines[i])) {
      lines[i] = '    scale: ${WORKER_REPLICAS:-1}';
      return { compose: lines.join('\n'), ensured: true };
    }
  }

  return { compose, ensured: false };
}
