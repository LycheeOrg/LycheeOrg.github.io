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
  const patched = removeIndentedBlock(lines, /^ {2}lychee_worker:\s*$/);
  return { compose: patched.join('\n'), removed: patched.length !== lines.length };
}
