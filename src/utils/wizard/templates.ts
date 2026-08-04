// Mirrors github.com/LycheeOrg/Wizard's default (non---local) behaviour of
// fetching the latest templates straight from LycheeOrg/Lychee@master, so
// the generated setup matches what upstream actually ships. Falls back to a
// bundled snapshot (mirroring the CLI's --local flag) if the fetch fails,
// e.g. offline or GitHub is unreachable.

const ENV_EXAMPLE_URL = 'https://raw.githubusercontent.com/LycheeOrg/Lychee/master/.env.example';
const COMPOSE_URL = 'https://raw.githubusercontent.com/LycheeOrg/Lychee/master/docker-compose.yaml';
// A slow/hanging GitHub response shouldn't stall the wizard indefinitely —
// bound both requests so the bundled-snapshot fallback kicks in either way.
const FETCH_TIMEOUT_MS = 8_000;

export interface Templates {
  envExample: string;
  compose: string;
  fromLive: boolean;
}

export async function loadTemplates(fallbackEnvExample: string, fallbackCompose: string): Promise<Templates> {
  try {
    const signal = AbortSignal.timeout(FETCH_TIMEOUT_MS);
    const [envRes, composeRes] = await Promise.all([
      fetch(ENV_EXAMPLE_URL, { cache: 'no-store', signal }),
      fetch(COMPOSE_URL, { cache: 'no-store', signal }),
    ]);
    if (!envRes.ok || !composeRes.ok) {
      throw new Error('non-200 response fetching upstream templates');
    }
    const [envExample, compose] = await Promise.all([envRes.text(), composeRes.text()]);
    if (!envExample.trim() || !compose.trim()) {
      throw new Error('empty response fetching upstream templates');
    }
    return { envExample, compose, fromLive: true };
  } catch {
    return { envExample: fallbackEnvExample, compose: fallbackCompose, fromLive: false };
  }
}
