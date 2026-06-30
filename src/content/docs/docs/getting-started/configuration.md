---
title: "Configuration"
description: "Configure Lychee using the .env file and environment variables."
sidebar:
  order: 3
---

Lychee's core configuration is managed using a `.env` file. It probably exists already in your directory, but if not it can be created by copying `.env.example`. The options which are already included in the `.env` file should be sufficient to cover the necessary configuration for the vast majority of all use-cases and setups. Using other options than those included in the `.env` file should rarely be necessary. However, this page contains a more complete list of the available options, incl. some highly advanced ones, together with descriptions and default values.
For non-core options (for example UI options), take a look at [Settings](/docs/getting-started/settings/).

:::caution[Docker users]
If you are using the Docker image, changes to environment variables require a container restart, as the server loads and caches the configuration at startup.
:::

### Base options

| Option               | Description                                                                            | Default                     |
|----------------------|------------------------------------------------------------------------------------------|-----------------------------|
| `APP_NAME`           | The gallery name                                                                       | `Lychee`                    |
| `APP_ENV`            | Environment of your gallery. Only the literal value `production` is treated as production; anything else (e.g. `local`, `development`) is non-production, see [below](#environment-values). | `production`                |
| `APP_DEBUG`          | Show detailed error messages with stack traces instead of a generic error page. Also exposes all environment variables on uncaught exceptions, see [Hiding Environment Variables From Debug Pages](#hiding-environment-variables-from-debug-pages). Never enable on a public-facing install. | `false` |
| `APP_URL`            | The hostname of your gallery (which should resolves to the `public/` folder).          | `http://localhost`          |
| `APP_DIR`            | The subfolder path part of the URL, for installs hosted under a sub-path instead of a domain root. We do not recommend its use, see [below](#app_url-and-app_dir). | _empty_                     |
| `APP_KEY`            | Your app key which is used for encryption (set during installation)                    | `null`                      |
| `ASSET_URL`          | Overrides the base URL used to load built JS/CSS assets. Rarely needed.                | `null`                      |
| `TIMEZONE`           | The timezone of your photos., requires a named timezone identifier like `Europe/Paris` | system timezone of server   |
| `LYCHEE_UPLOADS`     | Path to uploads directory                                                              | `uploads/` inside `public/` |
| `LYCHEE_UPLOADS_DIR` | Subfolder name used to build `LYCHEE_UPLOADS` and its URL when `LYCHEE_UPLOADS` is unset | `uploads/`                 |
| `LYCHEE_UPLOADS_URL` | URL to uploads directory, better left empty                                            | `/uploads`                  |
| `APP_FORCE_HTTPS`    | Force HTTPS on all URLs                                                                | `false`                     |
| `TRUSTED_PROXIES`    | Trusted proxy IP addresses                                                             | `null`                      |
| `LOG_VIEWER_ENABLED` | Enable log viewer inside Lychee instead of through CLI.                                | `true`                      |
| `WHITE_LABEL_ENABLED` | Hide all Lychee branding from the UI. Requires a valid [SE licence](/docs/se/white-label/).  | `false`                     |
| `KEYGEN_API_KEY`     | API token from [keygen.lycheeorg.dev](https://keygen.lycheeorg.dev). When set, an expired [SE licence](/docs/se/overview/) is automatically rotated on admin login, and the diagnostics page warns if the token itself is about to expire. | `null` |

### `APP_URL` and `APP_DIR`

:::note
`APP_URL` must only contain the hostname up to the Top Level Domain (tld) _e.g._ .com, .org etc.
If you are using Lychee in a sub folder, specify the path after the tld here in the `APP_DIR` constant.
For example for `https://lychee.test/path/to/lychee`:
- set `APP_URL` to `https://lychee.test`
- and set `APP_DIR` to `/path/to/lychee`
:::

:::caution[We do not recommend the use of `APP_DIR`]
`APP_DIR` exists to support hosting Lychee from a sub-path instead of a domain (or sub-domain) root. Every part of Lychee that generates a URL — image/thumbnail URLs, the custom CSS asset, WebAuthn, the log viewer — has to consistently account for that prefix. Leaving `APP_DIR` unset while actually deploying under a sub-path (or getting it slightly wrong) is a common cause of broken images/assets and broken WebAuthn login; the diagnostics page has dedicated checks for exactly this failure mode.

Whenever possible, prefer giving Lychee its own (sub)domain root (e.g. `photos.example.com`) over a path-based sub folder (e.g. `example.com/photos`). It sidesteps this whole class of issues.
:::

:::tip
For `TIMEZONE`, do not use an offset (`+01:00`) or an abbreviation (`CEST`)
:::

### Environment values

`APP_ENV` only has special meaning to Lychee and its dependencies when it is exactly `production`:

- **`production`** (default) — the safe default for any public-facing install. Generic error pages are shown instead of stack traces, `APP_DEBUG_LATENCY` is always ignored, and the Content Security Policy is enforced.
- **Anything else** (e.g. `local`, `development`) — treated as non-production. This is what unlocks the [Development options](#development-options) below, and is required by the Log Viewer if you want to use it outside of an admin session (per the official `.env.example`: "it is not possible to enable Log Viewer in production; if you wish to enable it, also switch your `APP_ENV` to `local`").

Never set `APP_ENV` to anything other than `production` on a public-facing install — combined with `APP_DEBUG`, non-production values relax several security defaults.

### Feature flags

These options enable or disable entire features of Lychee. Most of them are advanced and rarely need to be touched.

| Option                                  | Description                                                                                                     | Default |
|------------------------------------------|-------------------------------------------------------------------------------------------------------------------|---------|
| `LOG_404_ERRORS`                        | Log all 404 errors, useful to track broken links or attempted attacks. Set to `false` to avoid overly large logs. | `true`  |
| `LEGACY_V4_REDIRECT`                    | Redirect legacy v4 links of the form `/#albumID/photoID` to the new URL scheme.                                  | `false` |
| `S3_ENABLED`                            | Use an S3-compatible bucket instead of local storage for media. Also requires `AWS_ACCESS_KEY_ID` to be set, see [AWS](#aws). | `false` |
| `REQUIRE_CONTENT_TYPE_ENABLED`          | Require all API requests to set a `content-type` header. Disabling this allows using the API from the API documentation page. | `true`  |
| `DISABLE_BASIC_AUTH`                    | Disable username/password login. Only API tokens, WebAuthn or OAuth can then be used to authenticate. Only enable this after setting up another login method. | `false` |
| `DISABLE_WEBAUTHN`                      | Disable WebAuthn login.                                                                                          | `false` |
| `DISABLE_IMPORT_FROM_SERVER`            | Disable the "import from server" feature, reducing the attack surface if the admin account is ever compromised. | `false` |
| `WEBSHOP_ENABLED`                       | Enable the [webshop](/docs/webshop/) feature.                                                                    | `true`  |
| `WEBHOOK_ENABLED`                       | Enable outgoing webhooks, triggered on photo lifecycle events (`photo.add`, `photo.move`, `photo.delete`).       | `false` |
| `WEBHOOK_TIMEOUT_SECONDS`               | Seconds Lychee waits for a webhook endpoint to respond before treating the request as failed.                    | `10`    |
| `LOCATION_DECODING_REQUESTS_PER_SECOND` | Rate limit for reverse-geocoding requests sent to the Nominatim service. Only raise this if you run your own instance. | `1` |
| `VULNERABILITY_CHECK_ENABLED`           | Periodically compare the running version against published security advisories and surface matches on the diagnostics page and login. | `true` |
| `UPDATE_CHECK_ENABLED`                  | Allow admins to check from the dashboard whether the installation is up to date.                                 | `true`  |
| `USE_FOPEN_FOR_URL_IMPORTS`             | Use PHP's `fopen` instead of curl for URL imports. curl mitigates _Time of Check Time of Use_ (TOCTOU) issues but isn't available everywhere.  | `false` |
| `USE_SYSTEM_TEMP_DIR`                   | Use PHP's system temp directory for chunked uploads. Set to `false` on shared hosting where it isn't readable/writable, to use `storage/tmp/uploads_parts` instead. | `true` |
| `ENABLE_REQUEST_CACHING`                | Expose Redis-backed response caching settings (`cache_enabled`, `cache_ttl`, `cache_event_logging`) in the admin settings panel. | `false` |
| `HIDE_LYCHEE_SE_CONFIG`                 | Hide Lychee SE options from the configuration screens, useful for recording demos.                               | `false` |
| `V8_ENABLED`                            | Enable experimental, in-development v8 features. Not recommended outside of testing the next major version.      | `false` |

### Database options

Lychee supports MySQL/MariaDB, SQLite and PostgreSQL as database backends. Microsoft SQL Server can be used, but is unsupported. The configuration is managed using the `DB_` variables.

#### `DATABASE_URL`

Some hosting providers give you a single URL containing all the information needed to configure your database. Therefore, Lychee has a `DATABASE_URL` option which only needs the database connection type. For example:

```ini
DB_CONNECTION=mysql
DATABASE_URL="mysql://root:password@127.0.0.1/forge?charset=UTF-8"
```

If this applies to your hosting provider, you can skip the other DB configuration steps.

#### MySQL/MariaDB

The configuration is exactly the same for both systems.

| Option              | Value it should have                                                                                    |
|---------------------|-----------------------------------------------------------------------------------------------------------|
| `DB_CONNECTION`     | `mysql`                                                                                                 |
| `DB_HOST`           | Host of the database server (if it's running on the same server use `127.0.0.1`)                        |
| `DB_PORT`           | Port of the database server (default 3306)                                                              |
| `DB_DATABASE`       | The name of the database                                                                                |
| `DB_USERNAME`       | Username of the database user                                                                           |
| `DB_PASSWORD`       | Password of the database user                                                                           |
| `DB_SOCKET`         | UNIX socket to DB server, replaces `DB_HOST` and `DP_PORT`                                              |
| `MYSQL_ATTR_SSL_CA` | Optional and only used when using the `pdo_mysql` extension, file path to the SSL certificate authority |
| `DB_POOL_MIN`       | Minimum number of pooled connections (Octane only)                                                       | 1 |
| `DB_POOL_MAX`       | Maximum number of pooled connections (Octane only)                                                       | 10 |

#### SQLite

| Option          | Value it should have                                           |
|-----------------|------------------------------------------------------------------|
| `DB_CONNECTION` | `sqlite`                                                       |
| `DB_DATABASE`   | Path to the database file (default `database/database.sqlite`) |

#### PostgreSQL

| Option          | Value it should have                                                                            |
|-----------------|---------------------------------------------------------------------------------------------------|
| `DB_CONNECTION` | `pgsql`                                                                                         |
| `DB_HOST`       | Host of the database server (if it's running on the same server use `127.0.0.1`) or socket path |
| `DB_PORT`       | Port of the database server or `null` if using socket (default 5432)                            |
| `DB_DATABASE`   | The name of the database                                                                        |
| `DB_USERNAME`   | Username of the database user                                                                   |
| `DB_PASSWORD`   | Password of the database user                                                                   |

<!-- #### Microsoft SQL Server

:::note
Microsoft SQL Server is not officially supported. It may work, but we can't help you if you have any issues with it that do not affect other DB systems as well.
:::


| Option          | Value it should have                                                             |
|-----------------|--------------------------------------------------------------------------------------|
| `DB_CONNECTION` | `sqlsrv`                                                                         |
| `DB_HOST`       | Host of the database server (if it's running on the same server use `127.0.0.1`) |
| `DB_PORT`       | Port of the database server (default 1433)                                       |
| `DB_DATABASE`   | The name of the database                                                         |
| `DB_USERNAME`   | Username of the database user                                                    |
| `DB_PASSWORD`   | Password of the database user                                                    | -->

#### Migrating from Lychee v3

:::caution
To migrate from Lychee v3 you *must* use the same MySQL/MariaDB server as v3.
:::

| Option                 | Description                                                                | Default  |
|------------------------|-------------------------------------------------------------------------------|----------|
| `DB_OLD_LYCHEE_PREFIX` | Table prefix (e.g. `lychee_`) of the Lychee v3 instance to migrate from.    | _empty_  |

### Mailer options

Supported mailers are `smtp`, `ses`, `mailgun`, `postmark` or `sendmail`, which you can set using `MAIL_DRIVER`.

#### General options

| Option              | Description    |
|---------------------|----------------|
| `MAIL_DRIVER`       | Mailer type    |
| `MAIL_FROM_ADDRESS` | "From" address |
| `MAIL_FROM_NAME`    | "From" name (defaults to `APP_NAME`) |
| `MAIL_EHLO_DOMAIN`  | Local domain announced in the SMTP `EHLO`/`HELO` command. Advanced, rarely needed. |

#### SMTP

| Option            | Description                                |
|-------------------|----------------------------------------------|
| `MAIL_HOST`       | Host of SMTP server                        |
| `MAIL_PORT`       | Port of SMTP server (default 587)          |
| `MAIL_ENCRYPTION` | Encryption for SMTP server (default `tls`) |
| `MAIL_USERNAME`   | Username of SMTP server                    |
| `MAIL_PASSWORD`   | Password of SMTP server                    |

#### SES

SES can be configured using AWS settings. See [AWS configuration](#aws).

#### Mailgun

| Option             | Description                                  |
|--------------------|-------------------------------------------------|
| `MAILGUN_DOMAIN`   | Domain of the Mailgun server                 |
| `MAILGUN_SECRET`   | Secret of the Mailgun server                 |
| `MAILGUN_ENDPOINT` | Mailgun endpoint (default `api.mailgun.net`) |

#### Postmark

| Option           | Description        |
|------------------|-----------------------|
| `POSTMARK_TOKEN` | Token for Postmark |

#### sendmail

| Option              | Description                                  | Default                          |
|---------------------|-------------------------------------------------|-----------------------------------|
| `MAIL_SENDMAIL_PATH` | Path (and arguments) to the local `sendmail` binary | `/usr/sbin/sendmail -bs -i` |

### Cache options

Lychee can use various services as cache driver to store temporary data. The driver is set using `CACHE_DRIVER` and supports: `apc`, `array`, `file`, `memcached`, `redis` or `dynamodb`.

#### General options

| Option         | Description                                   |
|----------------|--------------------------------------------------|
| `CACHE_PREFIX` | Prefix of cache data keys in in-memory stores |
| `CACHE_STORE`  | Alias for `CACHE_DRIVER`. If both are set, `CACHE_STORE` takes precedence. |

#### Memcached

| Option                    | Description                 |
|---------------------------|---------------------------------|
| `MEMCACHED_HOST`          | Host for memcached          |
| `MEMCACHED_PORT`          | Port for memcached          |
| `MEMCACHED_USERNAME`      | Username for memcached      |
| `MEMCACHED_PASSWORD`      | Password for memcached      |
| `MEMCACHED_PERSISTENT_ID` | Persistent ID for memcached |

#### DynamoDB

Base options are configured using [AWS options](#aws). You need to create a table, please refer to the [Laravel docs](https://laravel.com/docs/8.x/cache#dynamodb).

| Option                 | Description       | Default |
|------------------------|----------------------|---------|
| `DYNAMODB_CACHE_TABLE` | Cache table name  | `cache` |
| `DYNAMODB_ENDPOINT`    | DynamoDB endpoint | `null`  |

#### Redis

Also see [Redis](#redis).

| Option           | Description          |
|------------------|--------------------------|
| `REDIS_CACHE_DB` | Redis cache database |

#### Database

There are no config options, however, you need to run `php artisan cache:table` to use this option.

#### Log Viewer cache

| Option                    | Description                                                                                   | Default |
|---------------------------|---------------------------------------------------------------------------------------------------|---------|
| `LOG_VIEWER_CACHE_DRIVER` | Cache driver used by the Log Viewer. If you use Redis as your main cache driver, it is strongly recommended to set this to `file` instead — should Redis crash, you would otherwise lose access to your logs. | `file`  |
| `LOG_STDOUT`              | Also send logs to stdout, useful when running in a container and collecting logs from the container runtime. | `false` |
| `LOG_VIEWER_API_ONLY`     | Only expose the Log Viewer through its API, without the bundled UI.                          | `false` |

### Services

Lychee can interact with various third-party services. You can find config options for them here.

#### Redis

To use Redis, you need the [PhpRedis](https://github.com/phpredis/phpredis) PHP extension.

| Option           | Description                                                  |
|------------------|--------------------------------------------------------------------|
| `REDIS_SCHEME`   | Redis connection scheme (default `tcp`, other option `unix`) |
| `REDIS_PATH`     | Redis Unix socket path                                       |
| `REDIS_HOST`     | Redis host                                                   |
| `REDIS_PASSWORD` | Redis password                                               |
| `REDIS_PORT`     | Redis port                                                   |
| `REDIS_DB`       | Default Redis database index (used outside of caching, e.g. sessions/queue) | `0` |
| `REDIS_CLUSTER`  | Redis cluster                                                |
| `REDIS_PREFIX`   | Redis prefix                                                 |
| `REDIS_URL`      | Redis URL                                                    |

#### AWS

| Option                  | Description                                               |
|--------------------------|----------------------------------------------------------------|
| `AWS_ACCESS_KEY_ID`     | Access key ID for AWS                                     |
| `AWS_SECRET_ACCESS_KEY` | Secret access key for AWS                                 |
| `AWS_DEFAULT_REGION`    | Default AWS region                                        |
| `AWS_URL`               | [S3] Overrides viewing URL, for use with CDNs and similar |
| `AWS_BUCKET`            | [S3] The bucket to use                                    |
| `AWS_ENDPOINT`          | [S3] The endpoint for uploads. `AWS_URL` defaults to this |
| `AWS_IMAGE_VISIBILITY`  | [S3] Visibility of uploaded objects (`public` or `private`) | `public` |
| `AWS_USE_PATH_STYLE_ENDPOINT` | [S3] Use path-style endpoint URLs, required by some S3-compatible providers (e.g. MinIO) | `false` |

:::tip
Setting `AWS_ACCESS_KEY_ID` only configures the AWS credentials; it does not by itself make Lychee store media on S3. Also set `S3_ENABLED=true`, see [Feature flags](#feature-flags).
:::

#### LDAP

Lychee can authenticate users against an LDAP or Active Directory server, alongside or instead of local accounts.

| Option                    | Description                                                                                       | Default                                  |
|----------------------------|--------------------------------------------------------------------------------------------------------|--------------------------------------------|
| `LDAP_ENABLED`            | Enable LDAP authentication.                                                                       | `false`                                  |
| `LDAP_HOST`               | LDAP server hostname.                                                                              | `ldap.example.com`                       |
| `LDAP_PORT`               | LDAP server port. Use `636` for LDAPS.                                                             | `389`                                     |
| `LDAP_BASE_DN`            | Base DN for LDAP searches.                                                                         | `dc=example,dc=com`                      |
| `LDAP_BIND_DN`            | DN of the service account used to bind and search LDAP. This account only needs read-only access. | `cn=bind-user,dc=example,dc=com`         |
| `LDAP_BIND_PASSWORD`      | Password of the bind account.                                                                      | _empty_                                  |
| `LDAP_CONNECTION_TIMEOUT` | Connection timeout, in seconds.                                                                    | `5`                                       |
| `LDAP_USE_TLS`            | Use TLS for the LDAP connection.                                                                   | `true`                                    |
| `LDAP_TLS_VERIFY_PEER`    | Verify the LDAP server's TLS certificate.                                                          | `true`                                    |
| `LDAP_USER_FILTER`        | LDAP search filter used to find a user by username (`%s` is replaced with the submitted username). OpenLDAP: `(&(objectClass=person)(uid=%s))`. Active Directory: `(&(objectClass=user)(sAMAccountName=%s))`. | `(&(objectClass=person)(uid=%s))` |
| `LDAP_ATTR_USERNAME`      | LDAP attribute mapped to the Lychee username.                                                     | `uid`                                     |
| `LDAP_ATTR_EMAIL`         | LDAP attribute mapped to the Lychee email address.                                                | `mail`                                    |
| `LDAP_ATTR_DISPLAY_NAME`  | LDAP attribute mapped to the Lychee display name.                                                 | `displayName`                             |
| `LDAP_ADMIN_GROUP_DN`     | DN of an LDAP group whose members are granted admin rights in Lychee.                             | `null`                                    |
| `LDAP_AUTO_PROVISION`     | Automatically create Lychee accounts on first successful LDAP login. If `false`, users must already exist in Lychee. | `true` |
| `LDAP_LOGGING`            | Log LDAP bind/search operations, useful for debugging. Passwords are never logged.                | `false`                                   |

#### OAuth providers

Lychee can delegate login to a number of external OAuth/OpenID providers. Each provider needs its own client ID and secret, obtained from the provider. Unless stated otherwise, `*_REDIRECT_URI` should be left at its default value.

| Provider     | Required options                                                                 | Notes                                                                                  |
|--------------|--------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| Amazon       | `AMAZON_SIGNIN_CLIENT_ID`, `AMAZON_SIGNIN_SECRET`                                | `AMAZON_SIGNIN_REDIRECT_URI` defaults to `/auth/amazon/redirect`.                       |
| Apple        | `APPLE_CLIENT_ID`, `APPLE_CLIENT_SECRET`                                         | The client secret is a JWT with a maximum lifetime of 6 months and must be regenerated periodically. `APPLE_REDIRECT_URI` defaults to `/auth/apple/redirect`. |
| Authelia     | `AUTHELIA_CLIENT_ID`, `AUTHELIA_CLIENT_SECRET`, `AUTHELIA_BASE_URL`              | For self-hosted Authelia instances. Also set `AUTHELIA_REDIRECT_URI`.                   |
| Authentik    | `AUTHENTIK_CLIENT_ID`, `AUTHENTIK_CLIENT_SECRET`, `AUTHENTIK_BASE_URL`           | For self-hosted Authentik instances. Also set `AUTHENTIK_REDIRECT_URI`.                 |
| Facebook     | `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`                                   | `FACEBOOK_REDIRECT_URI` defaults to `/auth/facebook/redirect`.                          |
| GitHub       | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`                                       | `GITHUB_REDIRECT_URI` defaults to `/auth/github/redirect`.                              |
| Google       | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`                                       | `GOOGLE_REDIRECT_URI` defaults to `/auth/google/redirect`.                              |
| Keycloak     | `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`, `KEYCLOAK_BASE_URL`, `KEYCLOAK_REALM` | For self-hosted Keycloak instances. Also set `KEYCLOAK_REDIRECT_URI`.                   |
| Mastodon     | `MASTODON_DOMAIN`, `MASTODON_ID`, `MASTODON_SECRET`                              | `MASTODON_DOMAIN` is the URL of your Mastodon instance, e.g. `https://mastodon.social`. `MASTODON_REDIRECT_URI` defaults to `/auth/mastodon/redirect`. |
| Microsoft    | `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`                                 | `MICROSOFT_TENANT_ID` defaults to `common`. `MICROSOFT_REDIRECT_URI` defaults to `/auth/microsoft/redirect`. |
| Nextcloud    | `NEXTCLOUD_CLIENT_ID`, `NEXTCLOUD_CLIENT_SECRET`, `NEXTCLOUD_BASE_URI`           | For self-hosted Nextcloud instances. Also set `NEXTCLOUD_REDIRECT_URI`.                 |

### AI Vision (facial recognition & NSFW classification)

These options configure the connection to the external AI Vision microservices used for [facial recognition](/docs/features/facial-recognition/) and [NSFW classification](/docs/se/nsfw-classification/). They are kept out of the database-backed settings so the service URL and shared API key are never exposed through the admin settings UI.

| Option                                       | Description                                                                       | Default |
|------------------------------------------------|----------------------------------------------------------------------------------------|---------|
| `AI_VISION_ENABLED`                           | Enable AI Vision features (facial recognition, person management, photo clustering). | `true`  |
| `AI_VISION_FACE_URL`                          | URL of the external facial-recognition service.                                  | _empty_ |
| `AI_VISION_FACE_API_KEY`                      | API key for the facial-recognition service.                                      | _empty_ |
| `AI_VISION_FACE_RESCAN_IOU_THRESHOLD`         | Intersection-over-union threshold used to decide whether a detected face needs rescanning. | `0.3` |
| `AI_VISION_FACE_STUCK_SCAN_THRESHOLD_MINUTES` | Minutes after which a face-scan job that hasn't progressed is considered stuck.   | `720`   |
| `AI_VISION_NSFW_URL`                          | URL of the external NSFW-classification service.                                 | _empty_ |
| `AI_VISION_NSFW_API_KEY`                      | API key for the NSFW-classification service.                                     | _empty_ |

### Payments

Payment options gate the [webshop](/docs/webshop/) checkout (requires Pro). See [Payments](/docs/webshop/payments/) for the full setup guide for each provider.

| Option                  | Description                                                                  | Default |
|--------------------------|----------------------------------------------------------------------------------|---------|
| `OMNIPAY_TEST_MODE`     | Use sandbox/test mode for payment gateways. Only set to `false` once you're ready to accept real payments. | `true` |
| `MOLLIE_API_KEY`        | Mollie API key.                                                              | _empty_ |
| `MOLLIE_PROFILE_ID`     | Mollie profile ID.                                                           | _empty_ |
| `PAYPAL_CLIENT_ID`      | PayPal client ID.                                                            | _empty_ |
| `PAYPAL_SECRET`         | PayPal secret.                                                               | _empty_ |

### Authentication Guards

Support for token based authentication used by API requests.

| Name                                  | Description                                                                                          | Default |
|-----------------------------------------|------------------------------------------------------------------------------------------------------------|---------|
| `ENABLE_BEARER_TOKEN_AUTH`            | Authentication Guard token support. Falls back to `ENABLE_TOKEN_AUTH` if unset.                     | `true`  |
| `ENABLE_TOKEN_AUTH`                   | Legacy name for `ENABLE_BEARER_TOKEN_AUTH`, kept for backwards compatibility.                       | `true`  |
| `REMEMBER_LIFETIME`                   | Duration, in minutes, of the "Remember me" login cookie.                                            | `40320` (4 weeks) |
| `FAIL_NO_AUTHENTICABLE_BEARER_TOKEN`  | Throw an exception when a bearer token is supplied but no matching user is found. Only applies when `ENABLE_BEARER_TOKEN_AUTH` is `true`. | `true` |
| `LOG_WARN_NO_BEARER_TOKEN`            | Log a warning when an API token is supplied without the `Bearer` scheme prefix.                     | `true`  |


### Session and security options

Sessions are stored in the same locations as [cache](#cache). You change the used driver using `SESSION_DRIVER`.

| Name                          | Description                                                                                        | Default |
|---------------------------------|------------------------------------------------------------------------------------------------------|---------|
| `SESSION_LIFETIME`            | Idle session expiration in minutes; the session will need to be reinitialized once it has expired. | 120     |
| `SESSION_SECURE_COOKIE`       | Cookies only via HTTPS                                                                             | `false` |
| `SECURITY_HEADER_HSTS_ENABLE` | Enable HTTP strict transport security                                                              | `false` |

#### Content Security Policy (CSP)

These options add extra allowed sources to Lychee's default Content Security Policy. Each accepts a comma-separated list of origins.

| Option                                  | CSP directive extended         |
|--------------------------------------------|--------------------------------------|
| `SECURITY_HEADER_CSP_CHILD_SRC`           | `child-src`                        |
| `SECURITY_HEADER_CSP_CONNECT_SRC`         | `connect-src`                      |
| `SECURITY_HEADER_CSP_FONT_SRC`            | `font-src`                         |
| `SECURITY_HEADER_CSP_FORM_ACTION`         | `form-action`                      |
| `SECURITY_HEADER_CSP_FRAME_ANCESTORS`     | `frame-ancestors` (also drives the `X-Frame-Options` header and relaxes the session cookie's `SameSite` attribute from `lax` to `none` when set) |
| `SECURITY_HEADER_CSP_FRAME_SRC`           | `frame-src`                        |
| `SECURITY_HEADER_CSP_IMG_SRC`             | `img-src`                          |
| `SECURITY_HEADER_CSP_MEDIA_SRC`           | `media-src`                        |
| `SECURITY_HEADER_SCRIPT_SRC_ALLOW`        | `script-src` (additional allowed script hosts) |

#### Advanced options

:::note
These config options are advanced config options. Do not change them unless you know what you are doing.
:::


| Option           | Description                                                                             |
|--------------------|---------------------------------------------------------------------------------------------|
| `APP_CIPHER`     | The app's cipher suite                                                                  |
| `HASHING_ALGORITHM` | Hashing algorithm for passwords (default `bcrypt`, other options `argon` or `argon2id`) |
| `ARGON_MEMORY`   | Memory for Argon hashing algorithm                                                      |
| `ARGON_THREADS`  | Threads for Argon hashing algorithm                                                     |
| `ARGON_TIME`     | Time for Argon hashing algorithm                                                        |
| `BCRYPT_ROUNDS`  | Rounds for bcrypt hashing algorithm                                                     |
| `WEBAUTHN_NAME`  | Name shown to users for WebAuthn devices (defaults to `APP_NAME`)                       |
| `WEBAUTHN_ID`    | Relying party ID for WebAuthn devices                                                   |
| `SESSION_COOKIE` | The cookie's name (defaults to a slug of `APP_NAME` followed by `_session`)             |
| `SESSION_STORE`  | Cache store used for cache-backed session drivers (`apc`, `dynamodb`, `memcached`, `redis`) |
| `SESSION_DOMAIN` | Session cookie domain                                                                   |
| `SKIP_DIAGNOSTICS_CHECKS` | Comma-separated list of class names of diagnostics checks that should be skipped. | _empty_ |
| `DB_LIST_FOREIGN_KEYS` | List foreign keys on the diagnostics page. Only takes effect when `APP_DEBUG` is also `true`. | `false` |

### Development options

:::note
Don't use this in productive environments. May affect stability and performance.
:::


Of these, only `APP_DEBUG_LATENCY` is hard-gated by [`APP_ENV`](#environment-values) in code (it is a no-op while `APP_ENV` is `production`). The others aren't technically blocked in production, but doing so is unsupported and may affect stability, performance, or expose debugging information.

| Option               | Description                                            | Default |
|------------------------|-------------------------------------------------------------|---------|
| `APP_DEBUG_LATENCY`  | Add this many milliseconds of artificial latency before processing requests. Always disabled when `APP_ENV` is `production`, regardless of this value. | `0` |
| `DEBUGBAR_ENABLED`   | Enable debugbar. This also disables the Content Security Policy. | `false` |
| `DB_LOG_SQL`         | Log SQL statements, see your Logs within Lychee.       | `false` |
| `DB_LOG_SQL_EXPLAIN` | Explain the SQL statements for MySQL.                  | `false` |
| `DB_LOG_SQL_MIN_TIME` | Only log SQL statements whose execution time exceeds this many milliseconds. | `100` |
| `XHPROF_ENABLED`     | Enable the XHProf profiler.                            | `false` |
| `CLOCKWORK_ENABLE`   | Enable the [Clockwork](https://underground.works/clockwork/) debugging toolbar. | `false` |
| `CLOCKWORK_DRIVER`   | Clockwork data collection driver.                      | `laravel` |
| `CLOCKWORK_STORAGE_FILES_PATH` | Path used to store Clockwork's collected request data. | `storage/clockwork` |
| `VITE_LOCAL_DEV`     | Enable local Vite development without running a separate dev server. | `false` |
| `VITE_HTTP_PROXY_TARGET` | Target URL for the Vite HTTP proxy used for API calls during local frontend development. | _empty_ |

### Advanced configuration

:::note
Only for advanced users familiar with PHP and Laravel. Never do this unless you know what you are doing.
:::


You can look at the files in the `config/` folder. They contain some options you can't configure using environmental variables and you are able to adapt Lychee completely to your needs.

## Environment Configuration

It is often helpful to have different configuration values based on the environment where the application is running. For example, you may wish to use a different cache driver locally than you do on your production server.

To make this a cinch, Lychee utilizes the [DotEnv][1] PHP library by Vance Lucas. In a fresh Lychee installation, the root directory of your application will contain a `.env.example` file. You should make a copy of this file as `.env`.

Your `.env` file should not be committed to your application's source control, since each developer / server using your application could require a different environment configuration. Furthermore, this would be a security risk in the event an intruder gains access to your source control repository, since any sensitive credentials would get exposed.

If you are developing with a team, you may wish to continue including a `.env.example` file with your application. By putting placeholder values in the example configuration file, other developers on your team can clearly see which environment variables are needed to run your application. You may also create a `.env.testing` file. This file will override the `.env` file when running PHPUnit tests or executing Artisan commands with the `--env=testing` option.

:::tip
Any variable in your `.env` file can be overridden by external environment variables such as server-level or system-level environment variables.
:::


### Environment Variable Types

All variables in your `.env` files are parsed as strings, so some reserved values have been created to allow you to return a wider range of types from the `env()` function:

| `.env` Value | `env()` Value |
|--------------|---------------|
| true         | (bool) true   |
| (true)       | (bool) true   |
| false        | (bool) false  |
| (false)      | (bool) false  |
| empty        | (string) ''   |
| (empty)      | (string) ''   |
| null         | (null) null   |
| (null)       | (null) null   |

If you need to define an environment variable with a value that contains spaces, you may do so by enclosing the value in double quotes.

```ini
APP_NAME="My Application"
```

### Retrieving Environment Configuration
All of the variables listed in this file will be loaded into the $_ENV PHP super-global when your application receives a request. However, you may use the env helper to retrieve values from these variables in your configuration files. In fact, if you review the Lychee configuration files, you will notice several of the options already using this helper:

```php
'debug' => env('APP_DEBUG', false),
```
The second value passed to the env function is the "default value". This value will be used if no environment variable exists for the given key.


### Determining The Current Environment
The current application environment is determined via the APP_ENV variable from your .env file. You may access this value via the environment method on the App facade:

```php
$environment = App::environment();
```
You may also pass arguments to the environment method to check if the environment matches a given value. The method will return true if the environment matches any of the given values:

```php
if (App::environment('development')) {
    // The environment is development
}

if (App::environment(['development', 'production'])) {
    // The environment is either development OR production...
}
```


:::tip
The current application environment detection can be overridden by a server-level `APP_ENV` environment variable. This can be useful when you need to share the same application for different environment configurations, so you can set up a given host to match a given environment in your server's configurations.
:::


### Hiding Environment Variables From Debug Pages

When an exception is uncaught and the `APP_DEBUG` environment variable is `true`, the debug page will show all environment variables and their contents. In some cases you may want to obscure certain variables. You may do this by updating the `debug_blacklist` option in your `config/app.php` configuration file.

Some variables are available in both the environment variables and the server / request data. Therefore, you may need to blacklist them for both `$_ENV` and `$_SERVER`:

```php
return [

    // ...

    'debug_blacklist' => [
        '_ENV' => [
            'APP_KEY',
            'DB_PASSWORD',
        ],

        '_SERVER' => [
            'APP_KEY',
            'DB_PASSWORD',
        ],

        '_POST' => [
            'password',
        ],
    ],
];
```

## Accessing Configuration Values

You may easily access your configuration values using the global `config` helper function from anywhere in your application. The configuration values may be accessed using "dot" syntax, which includes the name of the file and option you wish to access. A default value may also be specified and will be returned if the configuration option does not exist:

```php
$value = config('app.timezone');
```
To set configuration values at runtime, pass an array to the config helper:

```php
config(['app.timezone' => 'America/Chicago']);
```

## Configuration Caching

To give your application a speed boost, you should cache all of your configuration files into a single file using the `config:cache` Artisan command. This will combine all of the configuration options for your application into a single file which will be loaded quickly by the framework.

You should typically run the `php artisan config:cache` command as part of your production deployment routine. The command should not be run during local development as configuration options will frequently need to be changed during the course of your application's development.

:::note
If you execute the `config:cache` command during your deployment process, you should be sure that you are only calling the `env` function from within your configuration files. Once the configuration has been cached, the `.env` file will not be loaded and all calls to the `env` function will return `null`.
:::



## Maintenance Mode

When your application is in maintenance mode, a custom view will be displayed for all requests into your application. This makes it easy to "disable" your application while it is updating or when you are performing maintenance. A maintenance mode check is included in the default middleware stack for your application. If the application is in maintenance mode, a `MaintenanceModeException` will be thrown with a status code of 503.

To enable maintenance mode, execute the `down` Artisan command:

```bash
php artisan down
```
You may also provide `message` and `retry` options to the `down` command. The `message` value may be used to display or log a custom message, while the `retry` value will be set as the `Retry-After` HTTP header's value:

```bash
php artisan down --message="Upgrading Database" --retry=60
```
Even while in maintenance mode, specific IP addresses or networks may be allowed to access the application using the command's `allow` option:

```bash
php artisan down --allow=127.0.0.1 --allow=192.168.0.0/16
```

To disable maintenance mode, use the `up` command:

```bash
php artisan up
```
:::tip
You may customize the default maintenance mode template by defining your own template at `resources/views/errors/503.blade.php`.
:::


[1]: https://github.com/vlucas/phpdotenv
