// OAuth login providers Lychee supports, sourced from its own .env.example
// ("Oauth token data" section). Each provider's `*_REDIRECT_URI` var is
// deliberately not exposed here — the .env.example itself says to leave it
// at the default "unless you know exactly what you do."
export interface OAuthFieldDef {
  // Unique within the provider; combined with the provider id to form the
  // generated form field's name (oauth_<providerId>_<key>).
  key: string;
  envKey: string;
  label: string;
  placeholder?: string;
  required: boolean;
  // Set only on the one credential-ish field per provider that
  // docker-compose.yaml ships a "<envKey>_FILE" Docker-secrets variant for
  // (the client/app secret — never the client ID or a public base
  // URL/realm/tenant). Value is the secret's file name under ./secrets/,
  // matching the "/run/secrets/<name>" path in that _FILE line. See
  // dockerSecrets.ts's additional-secrets wiring.
  secretFile?: string;
}

export interface OAuthProviderDef {
  id: string;
  label: string;
  description?: string;
  fields: OAuthFieldDef[];
}

export const OAUTH_PROVIDERS: OAuthProviderDef[] = [
  {
    id: 'amazon',
    label: 'Amazon',
    fields: [
      { key: 'clientId', envKey: 'AMAZON_SIGNIN_CLIENT_ID', label: 'Client ID', required: true },
      { key: 'secret', envKey: 'AMAZON_SIGNIN_SECRET', label: 'Secret', required: true, secretFile: 'amazon_signin_secret' },
    ],
  },
  {
    id: 'apple',
    label: 'Apple',
    description:
      "The client secret is a JWT with a maximum 6-month lifetime — you'll need to regenerate and update it periodically.",
    fields: [
      { key: 'clientId', envKey: 'APPLE_CLIENT_ID', label: 'Client ID', required: true },
      { key: 'clientSecret', envKey: 'APPLE_CLIENT_SECRET', label: 'Client secret', required: true, secretFile: 'apple_client_secret' },
    ],
  },
  {
    id: 'facebook',
    label: 'Facebook',
    fields: [
      { key: 'clientId', envKey: 'FACEBOOK_CLIENT_ID', label: 'Client ID', required: true },
      { key: 'clientSecret', envKey: 'FACEBOOK_CLIENT_SECRET', label: 'Client secret', required: true, secretFile: 'facebook_client_secret' },
    ],
  },
  {
    id: 'github',
    label: 'GitHub',
    fields: [
      { key: 'clientId', envKey: 'GITHUB_CLIENT_ID', label: 'Client ID', required: true },
      { key: 'clientSecret', envKey: 'GITHUB_CLIENT_SECRET', label: 'Client secret', required: true, secretFile: 'github_client_secret' },
    ],
  },
  {
    id: 'google',
    label: 'Google',
    fields: [
      { key: 'clientId', envKey: 'GOOGLE_CLIENT_ID', label: 'Client ID', required: true },
      { key: 'clientSecret', envKey: 'GOOGLE_CLIENT_SECRET', label: 'Client secret', required: true, secretFile: 'google_client_secret' },
    ],
  },
  {
    id: 'mastodon',
    label: 'Mastodon',
    fields: [
      {
        key: 'domain',
        envKey: 'MASTODON_DOMAIN',
        label: 'Instance domain',
        placeholder: 'https://mastodon.social',
        required: true,
      },
      { key: 'id', envKey: 'MASTODON_ID', label: 'Client ID', required: true },
      { key: 'secret', envKey: 'MASTODON_SECRET', label: 'Client secret', required: true, secretFile: 'mastodon_secret' },
    ],
  },
  {
    id: 'microsoft',
    label: 'Microsoft',
    fields: [
      { key: 'clientId', envKey: 'MICROSOFT_CLIENT_ID', label: 'Client ID', required: true },
      { key: 'clientSecret', envKey: 'MICROSOFT_CLIENT_SECRET', label: 'Client secret', required: true, secretFile: 'microsoft_client_secret' },
      { key: 'tenantId', envKey: 'MICROSOFT_TENANT_ID', label: 'Tenant ID', required: true },
    ],
  },
  {
    id: 'nextcloud',
    label: 'Nextcloud',
    fields: [
      { key: 'clientId', envKey: 'NEXTCLOUD_CLIENT_ID', label: 'Client ID', required: true },
      { key: 'clientSecret', envKey: 'NEXTCLOUD_CLIENT_SECRET', label: 'Client secret', required: true, secretFile: 'nextcloud_client_secret' },
      {
        key: 'baseUri',
        envKey: 'NEXTCLOUD_BASE_URI',
        label: 'Nextcloud URL',
        placeholder: 'https://cloud.example.com',
        required: true,
      },
    ],
  },
  {
    id: 'keycloak',
    label: 'Keycloak',
    fields: [
      { key: 'clientId', envKey: 'KEYCLOAK_CLIENT_ID', label: 'Client ID', required: true },
      { key: 'clientSecret', envKey: 'KEYCLOAK_CLIENT_SECRET', label: 'Client secret', required: true, secretFile: 'keycloak_client_secret' },
      {
        key: 'baseUrl',
        envKey: 'KEYCLOAK_BASE_URL',
        label: 'Base URL',
        placeholder: 'https://keycloak.example.com',
        required: true,
      },
      { key: 'realm', envKey: 'KEYCLOAK_REALM', label: 'Realm', required: true },
    ],
  },
  {
    id: 'authentik',
    label: 'Authentik',
    fields: [
      {
        key: 'baseUrl',
        envKey: 'AUTHENTIK_BASE_URL',
        label: 'Base URL',
        placeholder: 'https://authentik.example.com',
        required: true,
      },
      { key: 'clientId', envKey: 'AUTHENTIK_CLIENT_ID', label: 'Client ID', required: true },
      { key: 'clientSecret', envKey: 'AUTHENTIK_CLIENT_SECRET', label: 'Client secret', required: true, secretFile: 'authentik_client_secret' },
    ],
  },
  {
    id: 'authelia',
    label: 'Authelia',
    fields: [
      {
        key: 'baseUrl',
        envKey: 'AUTHELIA_BASE_URL',
        label: 'Base URL',
        placeholder: 'https://authelia.example.com',
        required: true,
      },
      { key: 'clientId', envKey: 'AUTHELIA_CLIENT_ID', label: 'Client ID', required: true },
      { key: 'clientSecret', envKey: 'AUTHELIA_CLIENT_SECRET', label: 'Client secret', required: true, secretFile: 'authelia_client_secret' },
    ],
  },
];
