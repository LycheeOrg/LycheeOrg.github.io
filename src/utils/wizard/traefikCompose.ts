// Adds Traefik reverse-proxy integration (routing labels + the external
// network Traefik itself runs on) to the lychee_api service. Unlike
// dockerSecrets.ts, this isn't a patch to pre-existing upstream text — Lychee's
// compose file doesn't ship Traefik wiring, so this synthesizes a block,
// mirroring the approach in nsfwService.ts.

export interface TraefikOptions {
  // Host() rule value — the hostname the router matches on. Derived by the
  // caller from the wizard's Application URL answer.
  hostname: string;
  entrypoint: string;
  // Empty string skips the tls.certresolver label entirely (e.g. Traefik
  // configured with a default resolver, or TLS terminated elsewhere).
  certResolver: string;
}

// Static router/service name: safe to hard-code since the wizard only ever
// configures a single Lychee instance per compose file, and it sidesteps
// having to slugify an arbitrary, user-editable app name into something
// Traefik's label syntax accepts.
const ROUTER = 'lychee';

function buildLabelLines(o: TraefikOptions): string[] {
  const lines = [
    '    labels:',
    '      - "traefik.enable=true"',
    `      - "traefik.http.routers.${ROUTER}.rule=Host(\`${o.hostname}\`)"`,
    `      - "traefik.http.routers.${ROUTER}.entrypoints=${o.entrypoint}"`,
  ];
  if (o.certResolver.trim() !== '') {
    lines.push(`      - "traefik.http.routers.${ROUTER}.tls.certresolver=${o.certResolver}"`);
  }
  lines.push(`      - "traefik.http.services.${ROUTER}.loadbalancer.server.port=8000"`);
  return lines;
}

// lychee_api inherits `networks: [lychee]` from the x-base-lychee-setup
// merge anchor; a service-level `networks:` key here overrides that merge
// rather than extending it, so `lychee` has to be re-listed alongside the
// Traefik network.
const API_NETWORKS_LINES = ['    networks:', '      - lychee', '      - traefik'];

// The reference key (`traefik`) is fixed since compose doesn't interpolate
// mapping keys — the actual underlying Docker network name is configurable
// via TRAEFIK_NETWORK in .env instead.
const TOP_LEVEL_NETWORK_LINES = ['  traefik:', '    name: "${TRAEFIK_NETWORK:-traefik}"', '    external: true'];

export interface AddTraefikResult {
  compose: string;
  added: boolean;
}

export function addTraefikLabels(compose: string, o: TraefikOptions): AddTraefikResult {
  let lines = compose.split('\n');

  const portsAnchor = '      - "${APP_PORT:-8000}:8000"';
  const portsIdx = lines.indexOf(portsAnchor);
  if (portsIdx === -1) return { compose, added: false };

  lines = [
    ...lines.slice(0, portsIdx + 1),
    ...buildLabelLines(o),
    ...API_NETWORKS_LINES,
    ...lines.slice(portsIdx + 1),
  ];

  const networksIdx = lines.findIndex((l) => /^networks:\s*$/.test(l));
  if (networksIdx === -1) return { compose: lines.join('\n'), added: false };
  lines = [...lines.slice(0, networksIdx + 1), ...TOP_LEVEL_NETWORK_LINES, ...lines.slice(networksIdx + 1)];

  return { compose: lines.join('\n'), added: true };
}
