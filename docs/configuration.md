## Introduction
All of the configuration files for Lychee are stored in the config directory. Each option is documented, so feel free to look through the files and get familiar with the options available to you.

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
if (App::environment('local')) {
    // The environment is local
}

if (App::environment(['local', 'staging'])) {
    // The environment is either local OR staging...
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

## Configuration options

|Name|Description|Default|
|---|---|---|
|`APP_NAME`|The gallery name|`Lychee`|
|`APP_ENV`|Environment of your gallery, `production` or `development`|`production`|
|`APP_DEBUG`|Enable debug mode|`false`|
|`APP_URL`|The URL of your gallery (under which the `public/` folder is accessible)|http://localhost`|
|`APP_KEY`|Your app key which is used for encryption (set during installation)|`null`|
|`TIMEZONE`|The timezone of your photos|system timezone of server|
|`DEBUGBAR_ENABLED`|Enable debugbar (only for debugging)|`false`|
|`LOG_CHANNEL`|Default log channel, `single`, `daily`, `slack`, `syslog`, `errorlog`, `monolog`, `custom` or `stack`|`stack`|
|`DB_CONNECTION`|Database type, `mysql`, `pgsql`, `sqlite` or `sqlsrv` (`sqlsrv` is not supported officially and may not work)|`mysql`|
|`DB_DATABASE`|Path to SQLite database or name of MySQL/PostgreSQL DB|`database/database.sqlite` or `forge`|
|`DB_HOST`|Host of DB server|`127.0.0.1`|
|`DB_PORT`|Post of DB server|`3306` (MySQL) or `5432` (PostgreSQL)|
|`DB_USERNAME`|Username of database|`forge`|
|`DB_PASSWORD`|Password of database user|empty string|
|`DB_OLD_LYCHEE_PREFIX`|Table prefix of old Lychee database (v3)|empty string|
|`DB_LOG_SQL`|Log SQL statements (only use for debugging)|`false`|
|`CACHE_DRIVER`|The driver used for caching, `apc`, `array`, `database`, `file`, `memcached`, `redis` or `dynamodb`|`file`|
|`REDIS_HOST`|Redis host|`127.0.0.1`|
|`REDIS_PASSWORD`|Redis password|`null`|
|`REDIS_PORT`|Redis port|`6379`|
|`LYCHEE_UPLOADS`|Path to uploads directory|`public/uploads/`|
|`LYCHEE_UPLOADS_URL`|URL to uploads directory|`uploads/`|
|`LYCHEE_DIST`|Path to dist directory|`public/dist/`|
|`LYCHEE_DIST_URL`|URL to dist directory|`dist/`|
|`MAIL_DRIVER`|Mailer type, `smtp`, `ses`, `mailgun`, `postmark`, `sendmail`, `log` or `array`|`smtp`|
|`MAIL_HOST`|Host of SMTP server|`smtp.mailgun.org`|
|`MAIL_PORT`|Port of SMTP server|`587`|
|`MAIL_ENCRYPTION`|Encryption for SMTP server|`tls`|
|`MAIL_USERNAME`|Username of SMTP server|`null`|
|`MAIL_PASSWORD`|Password of SMTP server|`null`|
|`MAIL_FROM_ADDRESS`|"From" address|`hello@example.com`|
|`MAIL_FROM_NAME`|"From" name|`Example`|
|`SESSION_DRIVER`|Driver for sessions, `file`, `cookie`, `database`, `apc`, `memcached`, `redis`, `dynamodb` or `array`|`file`|
|`SESSION_LIFETIME`|Idle session timeout in minutes; the session will need to be reinitialized once it expires|`120`|
|`TRUSTED_PROXIES`|Trusted proxy IP addresses|`null`|
|`SECURITY_HEADER_HSTS_ENABLE`|Enable HTTP strict transport security|`false`|
|`SESSION_SECURE_COOKIE`|Cookies only via HTTPS|`false`|

### Advanced configuration options

> {note} These config options are advanced config options. Do not change them unless you know what you are doing. Some of them may be unused due to internal structures.

|Name|Description|Default|
|---|---|---|
|`LIVEWIRE_ENABLED`|Enable experimental Livewire frontend|`false`|
|`ASSET_URL`|URL for assets|`null`|
|`APP_CIPHER`|The app's cipher suite|`AES-256-CBC`|
|`MEMCACHED_PERSISTENT_ID`|Persistent ID for memcached|`null`|
|`MEMCACHED_USERNAME`|Username for memcached|`null`|
|`MEMCACHED_PASSWORD`|Password for memcached|`null`|
|`MEMCACHED_HOST`|Host for memcached|`127.0.0.1`|
|`MEMCACHED_PORT`|Port for memcached|`11211`|
|`AWS_ACCESS_KEY_ID`|Access key ID for AWS, used for dynamodb|`null`|
|`AWS_SECRET_ACCESS_KEY`|Secret access key for AWS, used for dynamodb|`null`|
|`AWS_DEFAULT_REGION`|Default AWS region, used for dynamodb cache driver|`null`|
|`DYNAMODB_CACHE_TABLE`|Cache table for dynamodb cache driver|`cache`|
|`DYNAMODB_ENDPOINT`|Endpoint for dynamodb cache driver|`null`|
|`DATABASE_URL`|Database URL|`null`|
|`DB_FOREIGN_KEYS`|Enable foreign key constraints|`true`|
|`DB_SOCKET`|UNIX socket of database|empty string|
|`MYSQL_ATTR_SSL_CA`|File path to the SSL certificate authority|`null`|
|`REDIS_CLIENT`|Redis client|`phpredis`|
|`REDIS_CLUSTER`|Redis cluster|`redis`|
|`REDIS_PREFIX`|Redis prefix|the value of `APP_NAME`|
|`REDIS_URL`|Redis URL|`null`|
|`REDIS_DB`|Redis database|`0`|
|`REDIS_CACHE_DB`|Redis cache database|`1`|
|`BCRYPT_ROUNDS`|Rounds for bcrypt hashing algorithm|`10`|
|`WEBAUTHN_NAME`|Name for Webauthn devices|the value of `APP_NAME`|
|`WEBAUTHN_ID`|ID for Webauthn devices|`null`|
|`WEBAUTHN_ICON`|Icon for Webauthn devices|`null`|
|`WEBAUTHN_CACHE`|Cache for Webauthn devices|`null`|
|`LOG_SLACK_WEBHOOK_URL`|Webhook URL for slack logging|`null`|
|`PAPERTRAIL_URL`|URL for papertrail logging|`null`|
|`PAPERTRAIL_PORT`|Port for papertrail logging|`null`|
|`LOG_STDERR_FORMATTER`|Formatter for logging to stderr|`null`|
|`MAIL_LOG_CHANNEL`|Log channel for mails|`null`|
|`REDIS_QUEUE`|Redis queue|`default`|
|`MAILGUN_DOMAIN`|Domain to mailgun|`null`|
|`MAILGUN_SECRET`|Serect for mailgun|`null`|
|`MAILGUN_ENDPOINT`|Endpoint to mailgun|`api.mailgun.net`|
|`POSTMARK_TOKEN`|Token for postmark|`null`|
|`SESSION_CONNECTION`|Session connection for `database` and `redis` drivers|`null`|
|`SESSION_STORE`|Store for sessions, affects `apc`, `dynamodb`, `memcached` and `redis` drivers|`null`|
|`SESSION_COOKIE`|The cookie's name|the value of `APP_NAME` + `_session`|
|`SESSION_DOMAIN`|Session cookie domain|`null`|
|`VIEW_COMPILED_PATH`|Where to store compiled Blade templates|`framework/views`|



[1]: https://github.com/vlucas/phpdotenv
