// Removes Lychee's bundled phpMyAdmin service (`phpmyadmin`) — used when the
// wizard answers say not to run one, or when there's no bundled database for
// it to manage. Upstream normally toggles it on via Compose profiles
// (COMPOSE_PROFILES=phpmyadmin in .env), but that only works with a .env
// file present — removing the service block outright when unwanted makes it
// behave like every other optional service (NSFW, worker, Traefik)
// regardless of that setting.

import { removeIndentedBlock } from './composeEdit';

export interface RemovePhpMyAdminServiceResult {
  compose: string;
  removed: boolean;
}

export function removePhpMyAdminService(compose: string): RemovePhpMyAdminServiceResult {
  const lines = compose.split('\n');
  const patched = removeIndentedBlock(lines, /^ {2}phpmyadmin:\s*$/);
  return { compose: patched.join('\n'), removed: patched.length !== lines.length };
}
