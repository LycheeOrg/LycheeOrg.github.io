// Based on github.com/LycheeOrg/Wizard's internal/wizard.Answers and
// Defaults(), extended with a few web-only options (database engine/location
// choice, NSFW classification) the CLI doesn't offer.
export type DbEngine = 'mariadb' | 'pgsql' | 'sqlite';
export type DbLocation = 'docker' | 'external';

export interface WizardAnswers {
  // General
  appName: string;
  appUrl: string;
  appPort: string;
  appForceHttps: boolean;
  timezone: string;
  // IPs/CIDR ranges of reverse proxies to trust X-Forwarded-* headers from.
  // Blank means "use the automatic default" — see generator.ts's TRUSTED_PROXIES
  // envSet, which falls back to '*' when Traefik is enabled, else 'null'.
  trustedProxies: string;

  // Database
  dbEngine: DbEngine;
  dbLocation: DbLocation;
  dbHost: string;
  dbPort: string;
  dbDatabase: string;
  dbUsername: string;
  generatePasswords: boolean;
  dbPassword: string;
  dbRootPassword: string;

  // Configuration delivery
  useEnvFile: boolean;

  // Secrets handling
  useDockerSecrets: boolean;

  // Optional services
  enablePhpMyAdmin: boolean;
  enableAiVision: boolean;
  customAiVisionKey: boolean;
  aiVisionApiKey: string;
  // Facial recognition detection/matching tuning — see
  // github.com/LycheeOrg/Lychee-Facial-Recognition's VISION_FACE_* env vars.
  aiVisionMaxFacesPerPhoto: string;
  aiVisionMinFaceSizePixels: string;
  aiVisionBlurThreshold: string;
  aiVisionClusterEps: string;
  aiVisionQueueMaxSize: string;
  aiVisionThreadPoolSize: string;
  aiVisionWorkers: string;
  enableNsfw: boolean;
  customNsfwKey: boolean;
  nsfwApiKey: string;
  enableGeoDecoding: boolean;

  // OAuth login providers — ids of providers the user has added a card for
  // (see oauthProviders.ts), and their filled-in field values, keyed
  // `${providerId}:${fieldKey}`.
  activeOAuthProviders: string[];
  oauthFieldValues: Record<string, string>;

  // Queue worker
  useWorker: boolean;
  workerCount: string;

  // Traefik reverse proxy
  enableTraefik: boolean;
  traefikEntrypoint: string;
  traefikCertResolver: string;
  traefikNetwork: string;

  // System
  puid: string;
  pgid: string;

  // Volumes — host-side paths for Lychee's persistent bind mounts.
  // volumeDatabasePath only applies when dbEngine is 'sqlite'.
  volumeUploadsPath: string;
  volumeLogsPath: string;
  volumeTmpPath: string;
  volumeDatabasePath: string;
}

export function defaultAnswers(): WizardAnswers {
  return {
    appName: 'Lychee',
    appUrl: 'http://localhost',
    appPort: '8000',
    appForceHttps: false,
    timezone: 'UTC',
    trustedProxies: '',
    dbEngine: 'mariadb',
    dbLocation: 'docker',
    dbHost: '',
    dbPort: '',
    dbDatabase: 'lychee',
    dbUsername: 'lychee',
    generatePasswords: true,
    dbPassword: '',
    dbRootPassword: '',
    useEnvFile: true,
    useDockerSecrets: true,
    enablePhpMyAdmin: false,
    enableAiVision: false,
    customAiVisionKey: false,
    aiVisionApiKey: '',
    aiVisionMaxFacesPerPhoto: '10',
    aiVisionMinFaceSizePixels: '0',
    aiVisionBlurThreshold: '0.5',
    aiVisionClusterEps: '0.3',
    aiVisionQueueMaxSize: '0',
    aiVisionThreadPoolSize: '1',
    aiVisionWorkers: '1',
    enableNsfw: false,
    customNsfwKey: false,
    nsfwApiKey: '',
    enableGeoDecoding: false,
    activeOAuthProviders: [],
    oauthFieldValues: {},
    useWorker: true,
    workerCount: '1',
    enableTraefik: false,
    traefikEntrypoint: 'websecure',
    traefikCertResolver: 'letsencrypt',
    traefikNetwork: 'traefik',
    puid: '1000',
    pgid: '1000',
    volumeUploadsPath: './lychee/uploads',
    volumeLogsPath: './lychee/logs',
    volumeTmpPath: './lychee/tmp',
    volumeDatabasePath: './lychee/database/database.sqlite',
  };
}

// needsDbService reports whether the answers require Lychee's own
// docker-managed database service (currently: MariaDB only — Lychee's
// official compose file doesn't ship a Postgres container, and SQLite needs
// no server at all).
export function needsDbService(a: Pick<WizardAnswers, 'dbEngine' | 'dbLocation'>): boolean {
  return a.dbEngine === 'mariadb' && a.dbLocation === 'docker';
}
