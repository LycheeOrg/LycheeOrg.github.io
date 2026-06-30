---
title: "Manual Installation"
description: "Install Lychee manually on a server with PHP, a web server, and a database."
sidebar:
  order: 5
---

This guide covers installing Lychee without Docker. For most users, the [Docker installation](/docs/getting-started/installation/) is simpler and recommended.

## Server Requirements

- A web server such as Apache or nginx
- A database — using one of the following:
  - MySQL _(version > 5.7.8)_ / MariaDB _(version > 10.2)_
  - PostgreSQL _(version > 9.2)_
  - SQLite3
- PHP >= 8.4 with these extensions:
  - bcmath, ctype, dom, exif, fileinfo, filter, gd, json, libxml, ldap (optional), mbstring, openssl, pcre, PDO, Phar, SimpleXML, tokenizer, xml, xmlwriter
  - imagick _(optional — better thumbnails)_
  - [PhpRedis](https://github.com/phpredis/phpredis) _(optional — to use Redis)_
- A database-specific PHP extension:
  - SQLite3 for SQLite databases
  - MySQLi (or PDO_MySQL) for MySQL / MariaDB
  - PgSql (or PDO_PGSQL) for PostgreSQL
- On FreeBSD, you may also need: session, zlib
- Optional CLI tools:
  - Exiftool (better EXIF metadata handling)
  - FFmpeg (video thumbnails)

While Lychee works on 32-bit systems, a **64-bit OS** is strongly recommended.

## Installing Lychee

### From a Release

1. Download the latest release zip from the [Releases](https://github.com/LycheeOrg/Lychee/releases) page.
2. Extract it to your web directory (e.g. `/var/www/html`).

### From Source

Building from source requires [Composer](https://getcomposer.org/) and [npm](https://nodejs.org/).

```bash
git clone https://www.github.com/LycheeOrg/Lychee /var/www/html/Lychee
cd /var/www/html/Lychee
composer install --no-dev
npm install
npm run build
```

## Configuration

### Directory Permissions

Three OS users may be involved:

- **Web user** — the user running the web server daemon (e.g. `www-data`, `apache`, `nginx`)
- **PHP user** — the user running PHP-FPM/CGI (often the same as the web user)
- **CLI user** — your shell user, relevant if importing photos via CLI

Required permissions:

- All Lychee files must be **readable** by the web/PHP user.
- `storage/` and `bootstrap/cache/` must be **writable** by the web/PHP user.
- `public/uploads` and `public/sym` must be **writable** by the web/PHP user (and the CLI user if importing via CLI).
- `public/dist` must be **writable** if you want to customize CSS via the web frontend.

For CLI imports, the recommended approach is to add all users to a shared group, set group ownership, enable group write, and set the `sgid` bit on directories so new files inherit the group.

### Environment File (.env)

The main directory should contain a `.env` file. Composer typically creates this from `.env.example` during installation. If it doesn't exist, copy it manually:

```bash
cp .env.example .env
```

:::caution
The `.env` file contains database credentials and encryption keys. Do not expose it via your web server.
:::

### Application Key

The `APP_KEY` setting must be set. If Composer didn't generate one:

```bash
php artisan key:generate
```

### URL

Set `APP_URL` in `.env` to the external URL by which the `public/` directory is accessible. This must match your web server configuration.

### Additional Configuration

The default `.env` provides usable settings out of the box. You may want to configure cache, database, and session settings — see the [Configuration](/docs/getting-started/configuration/) page.

## Web Server Configuration

Configure your web server to serve the `public/` directory. **Do not expose the top-level Lychee directory** — this would allow public access to the `.env` file and application code.

It is strongly recommended to serve Lychee over TLS. Consider [Let's Encrypt](https://letsencrypt.org/) for certificates and [Mozilla's SSL Configuration Generator](https://ssl-config.mozilla.org/) for server configuration.

### Apache

Enable `mod_rewrite` so the included `public/.htaccess` is honored. Also check the Apache [upgrade instructions](/docs/administration/upgrade/) for required permissions in your site configuration.

If the default `.htaccess` does not work, try this alternative:

```apache
Options +FollowSymLinks -Indexes
RewriteEngine On

RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [L]
```

### nginx

A sample nginx server block (without TLS):

```nginx
server {
    listen 80;
    server_name <mydomain>.<tld>;

    root /var/www/Lychee/public/;
    index index.php;

    # If the request is not for a valid file, send to bootstrap
    if (!-e $request_filename)
    {
        rewrite ^/(.*)$ /index.php?/$1 last;
        break;
    }

    # Serve /index.php through PHP
    location = /index.php {
        fastcgi_split_path_info ^(.+?\.php)(/.*)$;
        fastcgi_param HTTP_PROXY "";
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PHP_VALUE "post_max_size=100M
            max_execution_time=200
            upload_max_filesize=30M
            memory_limit=300M";
        fastcgi_param PATH /usr/local/bin:/usr/bin:/bin;
        include fastcgi_params;
    }

    # Deny access to other .php files
    location ~ [^/]\.php(/|$) {
        return 403;
    }

    error_log  /var/log/nginx/lychee.error.log;
    access_log /var/log/nginx/lychee.access.log;
}
```

For subdirectory hosting, see the [FAQ](/docs/faq/installation/).
