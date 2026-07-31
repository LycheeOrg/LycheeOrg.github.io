// Adds the lychee_nsfw_classification service to docker-compose.yaml.
// Unlike everything in dockerSecrets.ts, this isn't a patch to upstream
// content — Lychee's own compose file doesn't ship this service (see
// https://github.com/LycheeOrg/Lychee-NSFW-Classification), so this module
// synthesizes a block mirroring the shape of the neighbouring
// lychee_facial_recognition service, using the env vars documented in that
// repo's README/.env.example.

const NSFW_SERVICE_LINES = [
  '  lychee_nsfw_classification:',
  '    expose:',
  '      - "${APP_PORT_AI_NSFW:-8002}"',
  '    ports:',
  '      - "${APP_PORT_AI_NSFW:-8002}:8000"',
  '    image: ghcr.io/lycheeorg/lychee-nsfw-classification:latest',
  '    restart: unless-stopped',
  '    security_opt:',
  '      - no-new-privileges:true',
  '    cap_drop:',
  '      - ALL',
  '    environment:',
  '      # Lychee instance base URL (no trailing slash)',
  '      VISION_NSFW_LYCHEE_API_URL: "http://lychee_api:8000"',
  "      # Shared API key — must match AI_VISION_NSFW_API_KEY in Lychee's .env",
  '      VISION_NSFW_API_KEY: "${AI_VISION_NSFW_API_KEY:-changeme}"',
  '      # Set to false for development environments with self-signed certificates',
  '      VISION_NSFW_VERIFY_SSL: "${AI_VISION_NSFW_VERIFY_SSL:-true}"',
  '      # Skip the Lychee connectivity check at startup (useful for local dev)',
  '      VISION_NSFW_SKIP_LYCHEE_CHECK: "${VISION_NSFW_SKIP_LYCHEE_CHECK:-false}"',
  '',
  '      # Named preset: strict, moderation, nude_female, permissive, social_media',
  '      # https://github.com/LycheeOrg/Lychee-NSFW-Classification#quick-start--choose-a-preset',
  '      VISION_NSFW_PRESET: "${AI_VISION_NSFW_PRESET:-moderation}"',
  '',
  '      VISION_NSFW_LOG_LEVEL: "info"',
  '      VISION_NSFW_QUEUE_BACKEND: "${VISION_NSFW_QUEUE_BACKEND:-database}"',
  '      # Maximum pending jobs; requests beyond this are rejected with 429, 0 = unlimited',
  '      VISION_NSFW_QUEUE_MAX_SIZE: "${VISION_NSFW_QUEUE_MAX_SIZE:-0}"',
  '',
  '      # Shared Docker-volume mount point for photo files',
  '      VISION_NSFW_PHOTOS_PATH: "/data/photos"',
  '      # SQLite queue storage directory (used when queue backend is "database")',
  '      VISION_NSFW_STORAGE_PATH: "/data/queue"',
  '',
  '      # Number of threads for CPU-bound inference',
  '      VISION_NSFW_THREAD_POOL_SIZE: 1',
  '      # Number of Uvicorn worker processes',
  '      VISION_NSFW_WORKERS: "${AI_VISION_NSFW_WORKERS:-1}"',
  '',
  '      # Check the following for more env variables',
  '      # https://github.com/LycheeOrg/Lychee-NSFW-Classification/blob/master/.env.example',
  '    volumes:',
  '      - ./lychee/uploads:/data/photos:ro',
  '      - nsfw_classification_queue:/data/queue',
  '    networks:',
  '      - lychee',
  '    depends_on:',
  '      lychee_api:',
  '        condition: service_healthy',
  '    healthcheck:',
  '      test: [ "CMD", "curl", "-f", "http://localhost:8000/api/nsfw/health" ]',
  '      interval: 30s',
  '      timeout: 10s',
  '      retries: 3',
  '      start_period: 60s',
];

const NSFW_VOLUME_LINES = [
  '  nsfw_classification_queue:',
  '    name: lychee_nsfw_classification_queue',
  '    driver: local',
];

export interface InsertNsfwServiceResult {
  compose: string;
  inserted: boolean;
}

// insertNsfwService adds the NSFW classification service as the last entry
// under `services:` (right before the top-level `networks:` key) and its
// queue-storage volume under `volumes:`. Best-effort: if either anchor line
// isn't found (upstream restructured), it leaves the compose untouched for
// that part.
export function insertNsfwService(compose: string): InsertNsfwServiceResult {
  let lines = compose.split('\n');

  const networksIdx = lines.findIndex((l) => /^networks:\s*$/.test(l));
  if (networksIdx === -1) {
    return { compose, inserted: false };
  }
  lines = [...lines.slice(0, networksIdx), ...NSFW_SERVICE_LINES, '', ...lines.slice(networksIdx)];

  const volumesIdx = lines.findIndex((l) => /^volumes:\s*$/.test(l));
  if (volumesIdx !== -1) {
    lines = [...lines.slice(0, volumesIdx + 1), ...NSFW_VOLUME_LINES, ...lines.slice(volumesIdx + 1)];
  }

  return { compose: lines.join('\n'), inserted: true };
}
