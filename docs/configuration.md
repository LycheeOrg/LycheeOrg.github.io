## Introduction

Lychee's core configuration is managed using a `.env` file. It probably exists already in your directory, but if not it can be created by copying `.env.example`. The options which are already included in the `.env` file should be sufficient to cover the necessary configuration for the vast majority of all use-cases and setups. Using other options than those included in the `.env` file should rarely be necessary. However, this page contains a more complete list of the available options, incl. some highly advanced ones, together with descriptions and default values.
For non-core options (for example UI options), take a look at [Settings](https://lycheeorg.github.io/docs/settings.html).

### Base options

|Option|Description|Default|
|---|---|---|
|`APP_NAME`|The gallery name|`Lychee`|
|`APP_ENV`|Environment of your gallery, `production` or `development`|`production`|
|`APP_URL`|The URL of your gallery (which resolves to the `public/` folder)|`http://localhost`|
|`APP_KEY`|Your app key which is used for encryption (set during installation)|`null`|
|`TIMEZONE`|The timezone of your photos, requires a named timezone identifier like `Europe/Paris`, don't use an offset (`+01:00`) or an abbreviation (`CEST`)|system timezone of server|
|`LYCHEE_UPLOADS`|Path to uploads directory|`uploads/` inside `public/`|
|`LYCHEE_UPLOADS_URL`|URL to uploads directory|`uploads/`|
|`TRUSTED_PROXIES`|Trusted proxy IP addresses|`null`|

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

|Option|Value it should have|
|---|---|
|`DB_CONNECTION`|`mysql`|
|`DB_HOST`|Host of the database server (if it's running on the same server use `127.0.0.1`)|
|`DB_PORT`|Port of the database server (default 3306)|
|`DB_DATABASE`|The name of the database|
|`DB_USERNAME`|Username of the database user|
|`DB_PASSWORD`|Password of the database user|
|`DB_SOCKET`|UNIX socket to DB server, replaces `DB_HOST` and `DP_PORT`|
|`MYSQL_ATTR_SSL_CA`|Optional and only used when using the `pdo_mysql` extension, file path to the SSL certificate authority|

#### SQLite

|Option|Value it should have|
|---|---|
|`DB_CONNECTION`|`sqlite`|
|`DB_DATABASE`|Path to the database file (default `database/database.sqlite`)|

#### PostgreSQL

|Option|Value it should have|
|---|---|
|`DB_CONNECTION`|`pgsql`|
|`DB_HOST`|Host of the database server (if it's running on the same server use `127.0.0.1`) or socket path|
|`DB_PORT`|Port of the database server or `null` if using socket (default 5432)|
|`DB_DATABASE`|The name of the database|
|`DB_USERNAME`|Username of the database user|
|`DB_PASSWORD`|Password of the database user|

#### Microsoft SQL Server

> {note} Microsoft SQL Server is not officially supported. It may work, but we can't help you if you have any issues with it that do not affect other DB systems as well.

|Option|Value it should have|
|---|---|
|`DB_CONNECTION`|`sqlsrv`|
|`DB_HOST`|Host of the database server (if it's running on the same server use `127.0.0.1`)|
|`DB_PORT`|Port of the database server (default 1433)|
|`DB_DATABASE`|The name of the database|
|`DB_USERNAME`|Username of the database user|
|`DB_PASSWORD`|Password of the database user|

### Mailer options

Supported mailers are `smtp`, `ses`, `mailgun`, `postmark` or `sendmail`, which you can set using `MAIL_DRIVER`.

#### General options

|Option|Description|
|---|---|
|`MAIL_DRIVER`|Mailer type|
|`MAIL_FROM_ADDRESS`|"From" address|
|`MAIL_FROM_NAME`|"From" name|

#### SMTP

|Option|Description|
|---|---|
|`MAIL_HOST`|Host of SMTP server|
|`MAIL_PORT`|Port of SMTP server (default 587)|
|`MAIL_ENCRYPTION`|Encryption for SMTP server (default `tls`)|
|`MAIL_USERNAME`|Username of SMTP server|
|`MAIL_PASSWORD`|Password of SMTP server|

#### SES

SES can be configured using AWS settings. See [AWS configuration](#aws).

#### Mailgun

|Option|Description|
|---|---|
|`MAILGUN_DOMAIN`|Domain of the Mailgun server|
|`MAILGUN_SECRET`|Secret of the Mailgun server|
|`MAILGUN_ENDPOINT`|Mailgun endpoint (default `api.mailgun.net`)|

#### Postmark

|Option|Description|
|---|---|
|`POSTMARK_TOKEN`|Token for Postmark|

#### sendmail

No additional options.

### Cache options

Lychee can use various services as cache driver to store temporary data. The driver is set using `CACHE_DRIVER` and supports: `apc`, `array`, `file`, `memcached`, `redis` or `dynamodb`.

#### General options

|Option|Description|
|---|---|
|`CACHE_PREFIX`|Prefix of cache data keys in in-memory stores|

#### Memcached

|Option|Description|
|---|---|
|`MEMCACHED_HOST`|Host for memcached|
|`MEMCACHED_PORT`|Port for memcached|
|`MEMCACHED_USERNAME`|Username for memcached|
|`MEMCACHED_PASSWORD`|Password for memcached|
|`MEMCACHED_PERSISTENT_ID`|Persistent ID for memcached|

#### DynamoDB

Base options are configured using [AWS options](#aws). You need to create a table, please refer to the [Laravel docs](https://laravel.com/docs/8.x/cache#dynamodb).

|Option|Description|
|---|---|
|`DYNAMODB_CACHE_TABLE`|Cache table name|`cache`|
|`DYNAMODB_ENDPOINT`|DynamoDB endpoint|`null`|

#### Redis

Also see [Redis](#redis).

|Option|Description|
|---|---|
|`REDIS_CACHE_DB`|Redis cache database|

#### Database

There are no config options, however, you need to run `php artisan cache:table` to use this option.

### Services

Lychee can interact with various third-party services. You can find config options for them here.

#### Redis

To use Redis, you need the [PhpRedis](https://github.com/phpredis/phpredis) PHP extension.

|Option|Description|
|---|---|
|`REDIS_SCHEME`|Redis connection scheme (default `tcp`, other option `unix`)|
|`REDIS_PATH`|Redis Unix socket path|
|`REDIS_HOST`|Redis host|
|`REDIS_PASSWORD`|Redis password|
|`REDIS_PORT`|Redis port|
|`REDIS_CLUSTER`|Redis cluster|
|`REDIS_PREFIX`|Redis prefix|
|`REDIS_URL`|Redis URL|

#### AWS

|Option|Description|
|---|---|
|`AWS_ACCESS_KEY_ID`|Access key ID for AWS|
|`AWS_SECRET_ACCESS_KEY`|Secret access key for AWS|
|`AWS_DEFAULT_REGION`|Default AWS region|

### Authentication Guards

Support for token based authentication used by API requests.

|Name|Description|
|---|---|
|`ENABLE_TOKEN_AUTH`|Authentication Guard token support|


### Session and security options

Sessions are stored in the same locations as [cache](#cache). You change the used driver using `SESSION_DRIVER`.

|Name|Description|
|---|---|
|`SESSION_LIFETIME`|Idle session expiration in minutes; the session will need to be reinitialized once it has expired (default 120)|
|`SESSION_SECURE_COOKIE`|Cookies only via HTTPS|`false`|
|`SECURITY_HEADER_HSTS_ENABLE`|Enable HTTP strict transport security|`false`|

#### Advanced options

> {note} These config options are advanced config options. Do not change them unless you know what you are doing.

|Option|Description|
|---|---|
|`APP_CIPHER`|The app's cipher suite|
|`HASHING_DRIVER`|Hashing algorithm for passwords (default `bcrypt`, other options `argon` or `argon2id`)|
|`ARGON_MEMORY`|Memory for Argon hashing algorithm|
|`ARGON_THREADS`|Threads for Argon hashing algorithm|
|`ARGON_TIME`|Time for Argon hashing algorithm|
|`BCRYPT_ROUNDS`|Rounds for bcrypt hashing algorithm|
|`WEBAUTHN_NAME`|Name for Webauthn devices|
|`WEBAUTHN_ID`|ID for Webauthn devices|
|`WEBAUTHN_ICON`|Icon for Webauthn devices|
|`WEBAUTHN_CACHE`|Cache for Webauthn devices|
|`SESSION_COOKIE`|The cookie's name|
|`SESSION_DOMAIN`|Session cookie domain|

### Development options

> {note} Don't use this in productive environments. May affect stability and performance.

|Option|Description|
|---|---|
|`APP_ENV`|Set to `development` to enable development environment|
|`APP_DEBUG`|Enable debug mode|
|`DEBUGBAR_ENABLED`|Enable debugbar|
|`DB_LOG_SQL`|Log SQL statements, find the log file under `storage/logs/laravel.log`|
|`LIVEWIRE_ENABLED`|Enable experimental Livewire frontend|

### Advanced configuration

> {note} Only for advanced users familiar with PHP and Laravel. Never do this unless you know what you are doing.

You can look at the files in the `config/` folder. They contain some options you can't configure using environmental variables and you are able to adapt Lychee completely to your needs.

<!--

### Hidden options

These options are unused right now, but may be used in the future.

|Option|Description|
|---|---|
|`REDIS_DB`|Redis database, used for broadcasting and queue|
|`REDIS_QUEUE`|Redis queue|
|`BROADCAST_DRIVER`|Broadcast driver|
|`QUEUE_DRIVER`|Queue driver|
|`PUSHER_APP_ID|Pusher app ID|
|`PUSHER_APP_KEY|Pusher app secret|
|`PUSHER_APP_SECRET|Pusher app secret|
|`PUSHER_APP_CLUSTER|Pusher app cluster|
|`FILESYSTEM_CLOUD`|Cloud Filesystem|

-->

## Environment Configuration

It is often helpful to have different configuration values based on the environment where the application is running. For example, you may wish to use a different cache driver locally than you do on your production server.

To make this a cinch, Lychee utilizes the [DotEnv][1] PHP library by Vance Lucas. In a fresh Lychee installation, the root directory of your application will contain a `.env.example` file. You should make a copy of this file as `.env`.

Your `.env` file should not be committed to your application's source control, since each developer / server using your application could require a different environment configuration. Furthermore, this would be a security risk in the event an intruder gains access to your source control repository, since any sensitive credentials would get exposed.

If you are developing with a team, you may wish to continue including a `.env.example` file with your application. By putting placeholder values in the example configuration file, other developers on your team can clearly see which environment variables are needed to run your application. You may also create a `.env.testing` file. This file will override the `.env` file when running PHPUnit tests or executing Artisan commands with the `--env=testing` option.

> {tip} Any variable in your `.env` file can be overridden by external environment variables such as server-level or system-level environment variables.

### Environment Variable Types

All variables in your `.env` files are parsed as strings, so some reserved values have been created to allow you to return a wider range of types from the `env()` function:

<table>
<thead>
<tr>
<th><code>.env</code> Value</th>
<th><code>env()</code> Value</th>
</tr>
</thead>
<tbody>
<tr>
<td>true</td>
<td>(bool) true</td>
</tr>
<tr>
<td>(true)</td>
<td>(bool) true</td>
</tr>
<tr>
<td>false</td>
<td>(bool) false</td>
</tr>
<tr>
<td>(false)</td>
<td>(bool) false</td>
</tr>
<tr>
<td>empty</td>
<td>(string) ''</td>
</tr>
<tr>
<td>(empty)</td>
<td>(string) ''</td>
</tr>
<tr>
<td>null</td>
<td>(null) null</td>
</tr>
<tr>
<td>(null)</td>
<td>(null) null</td>
</tr>
</tbody>
</table>

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


> {tip} The current application environment detection can be overridden by a server-level `APP_ENV` environment variable. This can be useful when you need to share the same application for different environment configurations, so you can set up a given host to match a given environment in your server's configurations.

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

> {note} If you execute the `config:cache` command during your deployment process, you should be sure that you are only calling the `env` function from within your configuration files. Once the configuration has been cached, the `.env` file will not be loaded and all calls to the `env` function will return `null`.


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
> {tip} You may customize the default maintenance mode template by defining your own template at `resources/views/errors/503.blade.php`.

[1]: https://github.com/vlucas/phpdotenv
