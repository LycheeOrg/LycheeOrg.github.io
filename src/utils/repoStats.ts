// Fetched at build time (site is fully static) to keep the homepage stats
// widget honest instead of hand-editing numbers on every release.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

// process.cwd() (the project root, since Astro always builds from there) rather than
// import.meta.url — the latter resolves into the transient build bundle, not the source
// tree, so a path derived from it wouldn't survive between builds.
const CACHE_FILE = join(process.cwd(), '.cache/repo-stats.json');
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
// A stalled upstream (GitHub/Docker Hub) shouldn't be able to hang the
// static build — one shared deadline covers the whole fetch, including every
// page of fetchGitHubReleaseDownloads' pagination loop, not just each
// individual request.
const FETCH_TIMEOUT_MS = 10_000;

const GITHUB_REPO_URL = 'https://api.github.com/repos/LycheeOrg/Lychee';
const GITHUB_RELEASES_URL = 'https://api.github.com/repos/LycheeOrg/Lychee/releases?per_page=100';
// GHCR (ghcr.io/lycheeorg/lychee, ghcr.io/linuxserver/lychee) does not expose pull/download
// counts through any public or authenticated API, nor on the package page itself — so only
// the two Docker Hub mirrors, which do report a pull_count, are counted here.
const DOCKER_HUB_URLS = [
  'https://hub.docker.com/v2/repositories/lycheeorg/lychee/',
  'https://hub.docker.com/v2/repositories/linuxserver/lychee/',
];

// Last known-good values, used if a fetch fails (e.g. offline build, rate limiting).
const FALLBACK = {
  downloads: 43_000,
  stars: 4_250,
  forks: 374,
  dockerPulls: 4_090_000 + 19_636_000,
};

export interface RepoStats {
  downloads: string;
  stars: string;
  forks: string;
  dockerPulls: string;
}

function formatCount(n: number): string {
  const format = (value: number, suffix: string) => `${parseFloat(value.toFixed(1))}${suffix}`;
  if (n >= 1_000_000) return format(n / 1_000_000, 'M');
  if (n >= 1_000) return format(n / 1_000, 'K');
  return String(n);
}

async function fetchGitHubRepo(signal: AbortSignal): Promise<{ stars: number; forks: number }> {
  const res = await fetch(GITHUB_REPO_URL, { headers: { Accept: 'application/vnd.github+json' }, signal });
  if (!res.ok) throw new Error(`GitHub repo request failed: ${res.status}`);
  const data = await res.json();
  return { stars: data.stargazers_count, forks: data.forks_count };
}

async function fetchGitHubReleaseDownloads(signal: AbortSignal): Promise<number> {
  let total = 0;
  let url: string | null = GITHUB_RELEASES_URL;

  while (url) {
    const res: Response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' }, signal });
    if (!res.ok) throw new Error(`GitHub releases request failed: ${res.status}`);
    const releases: { assets: { download_count: number }[] }[] = await res.json();
    for (const release of releases) {
      for (const asset of release.assets) {
        total += asset.download_count;
      }
    }

    const link = res.headers.get('link');
    const next = link?.split(',').find((part) => part.includes('rel="next"'));
    url = next ? next.split(';')[0].trim().slice(1, -1) : null;
  }

  return total;
}

async function fetchDockerPulls(signal: AbortSignal): Promise<number> {
  const counts = await Promise.all(
    DOCKER_HUB_URLS.map(async (url) => {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`Docker Hub request failed for ${url}: ${res.status}`);
      const data = await res.json();
      return data.pull_count as number;
    }),
  );
  return counts.reduce((sum, count) => sum + count, 0);
}

interface Cache {
  timestamp: number;
  stats: RepoStats;
}

function readCache(): RepoStats | null {
  try {
    const cache: Cache = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
    if (Date.now() - cache.timestamp < CACHE_TTL_MS) return cache.stats;
  } catch {
    // no cache yet, or unreadable — fall through to a fresh fetch
  }
  return null;
}

function writeCache(stats: RepoStats): void {
  try {
    mkdirSync(dirname(CACHE_FILE), { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify({ timestamp: Date.now(), stats } satisfies Cache));
  } catch {
    // best-effort; a failed cache write shouldn't break the build
  }
}

export async function getRepoStats(): Promise<RepoStats> {
  const cached = readCache();
  if (cached) return cached;

  const signal = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  const [repo, downloads, dockerPulls] = await Promise.all([
    fetchGitHubRepo(signal).catch(() => ({ stars: FALLBACK.stars, forks: FALLBACK.forks })),
    fetchGitHubReleaseDownloads(signal).catch(() => FALLBACK.downloads),
    fetchDockerPulls(signal).catch(() => FALLBACK.dockerPulls),
  ]);

  const stats: RepoStats = {
    downloads: formatCount(downloads),
    stars: formatCount(repo.stars),
    forks: formatCount(repo.forks),
    dockerPulls: formatCount(dockerPulls),
  };

  writeCache(stats);
  return stats;
}
