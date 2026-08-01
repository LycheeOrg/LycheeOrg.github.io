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
  enableNsfw: boolean;
  customNsfwKey: boolean;
  nsfwApiKey: string;

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
}

export function defaultAnswers(): WizardAnswers {
  return {
    appName: 'Lychee',
    appUrl: 'http://localhost',
    appPort: '8000',
    appForceHttps: false,
    timezone: 'UTC',
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
    enableAiVision: true,
    customAiVisionKey: false,
    aiVisionApiKey: '',
    enableNsfw: false,
    customNsfwKey: false,
    nsfwApiKey: '',
    useWorker: true,
    workerCount: '1',
    enableTraefik: false,
    traefikEntrypoint: 'websecure',
    traefikCertResolver: 'letsencrypt',
    traefikNetwork: 'traefik',
    puid: '1000',
    pgid: '1000',
  };
}

// needsDbService reports whether the answers require Lychee's own
// docker-managed database service (currently: MariaDB only — Lychee's
// official compose file doesn't ship a Postgres container, and SQLite needs
// no server at all).
export function needsDbService(a: Pick<WizardAnswers, 'dbEngine' | 'dbLocation'>): boolean {
  return a.dbEngine === 'mariadb' && a.dbLocation === 'docker';
}
