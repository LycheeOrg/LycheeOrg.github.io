## Installation

### Server Requirements

The Lychee gallery has a few system requirements. You will need to make sure your server has the following:

- A web server such as Apache or nginx
- A database &mdash; using one of the following:
	- MySQL _(version > 5.7.8)_ / MariaDB _(version > 10.2)_
	- PostgreSQL _(version > 9.2)_
	- Lychee's inbuilt SQLite3 support
- PHP >= 8.0 with these PHP extensions:
	- BCMath
	- Ctype
	- Exif
	- Fileinfo
	- GD
	- Imagick (optional &mdash; to generate better thumbnails)
	- JSON
   	- Mbstring
   	- OpenSSL
   	- PDO
   	- Tokenizer
   	- XML
   	- ZIP
- These PHP extensions are necessary if you are running a FreeBSD system:
	- Simplexml
	- Dom
	- Session
	- Zlib
- You will also need one of these PHP extensions:
	- SQLite3 for SQLite3 databases
	- MySQLi (or PDO_MySQL) for MySQL or MariaDB databases
	- PgSql (or PDO_PGSQL) for PostgreSQL databases
- Optionally, you can also install the following command line tools:
	- Exiftool (for better handling of EXIF metadata)
	- FFmpeg (to generate video thumbnails)
- To install from git you will also need Composer. See [below](#from-the-master-branch) for details.

While Lychee works on 32bit systems, we **strongly** recommend the use of a 64bit OS.

### Installing Lychee

We provide three methods to install Lychee: using a Docker image, the latest release .zip or from source, using Composer.

#### With Docker

Read [here](docker.html).

#### From Release 

Download the release zip-file from the [Releases](https://github.com/LycheeOrg/Lychee/releases) page and extract it (usually in `/var/www/html`).
It contains a trimmed down version of the Lychee files.

#### From the Master branch

Lychee utilizes [Composer][1] to manage its dependencies. Make sure you have Composer installed on your machine.

```bash
git clone https://www.github.com/LycheeOrg/Lychee /var/www/html/Lychee
```
Get into the directory:
```bash
cd /var/www/html/Lychee
```
Install the required dependencies.
```bash
composer install --no-dev
```
If you want to help develop Lychee, install the development dependencies by removing the `--no-dev` or replacing it with `--dev`.


### Configuration

#### Directory Permissions

Directories within the `storage` and the `bootstrap/cache` directories must be writable by your web server or Lychee will not run. Additionally, `public/uploads`, `public/dist` and `public/sym` need to be writable to upload files, customise the CSS and utilise [symbolic links](https://lycheeorg.github.io/docs/settings.html#symbolic-link) respectively.

#### Application Settings

The main directory should contain a `.env` file.
Normally, Composer will have copied this file for you while installing the dependencies.
If the `.env` file does not exist, then you should copy `.env.example` to a new file named `.env` now.
Note that the `.env` file should **not** be exposed online as it contains the encryption key used for cookies as well as database credentials.

##### Application Key

The `.env` file contains the setting `APP_KEY` which holds your application key.
Normally, Composer sets this key for you while installing the dependencies.
If the key is not set, Lychee will not work. Then, you can use the `php artisan key:generate` command to set the application key to a random value.

##### Additional Configuration

The default `.env` file provides usable settings out of the box.

You may want to configure a few additional components of Lychee, such as:

- Cache
- Database
- Session

They are documented in the `.env.example` file, which may have been copied into your `.env`. They are also listed on the [configuration](configuration.html) page.

##### Advanced Configuration (Dangerous)

Some advanced options cannot be configured through the `.env` file. If you really need to change them, look in the `config/` directory.

**If you don't know what they're doing, do not change them.**

## Web Server Configuration

### General

Configure your web server to make the `public` directory accessible via a URL. This could be the root of your web server (short and convenient) or, if you prefer, a subpath such as `photos`. The `index.php` in this directory serves as the interface for all HTTP requests to Lychee's API.

> {note} Do not expose the top level directory of Lychee with your web server! This would allow public access to internal files like the application code and the `.env` file which contains sensitive information like the database credentials!

It is also strongly recommended to serve Lychee over TLS. You may wish to consider [Let's Encrypt](https://letsencrypt.org/) for certificates and [Mozilla's SSL Configuration Generator](https://ssl-config.mozilla.org/) for server configuration examples.

### Apache

Lychee includes a `public/.htaccess` file that is used to provide URLs without the `index.php` front controller in the path. Before serving Lychee with Apache, be sure to enable the `mod_rewrite` module so the `.htaccess` file will be honored by the server.

Also check the Apache [upgrade instructions](https://lycheeorg.github.io/docs/upgrade.html#using-apache) for required permissions in your /etc/apache2/sites-available/example.com.conf file.

If the `.htaccess` file that ships with Lychee does not work with your Apache installation, try this alternative:

```apacheconf
Options +FollowSymLinks -Indexes
RewriteEngine On

RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [L]
```

### nginx

This is a sample nginx server block. It does not include TLS, but covers the Lychee-specific requirements.
If you would like to serve from a subdirectory, take a look at [the FAQ](https://lycheeorg.github.io/docs/faq.html#can-i-host-lychee-with-a-subpath-with-nginx-like-httpsexampledevlychee).

```nginx
server {
    listen 80;
    server_name <mydomain>.<tld>;

    ##### Path to the Lychee public/ directory.
    root /var/www/Lychee/public/;
    index index.php;

    # If the request is not for a valid file (image, js, css, etc.), send to bootstrap
    if (!-e $request_filename)
    {
        rewrite ^/(.*)$ /index.php?/$1 last;
        break;
    }

    # Serve /index.php through PHP
    location = /index.php {
        fastcgi_split_path_info ^(.+?\.php)(/.*)$;

        # Mitigate https://httpoxy.org/ vulnerabilities
        fastcgi_param HTTP_PROXY "";

        ######### Make sure this is the correct socket for your system
        fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        ######## You may need to replace $document_root with the absolute path to your public folder.
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PHP_VALUE "post_max_size=100M
            max_execution_time=200
            upload_max_filesize=30M
            memory_limit=300M";
        fastcgi_param PATH /usr/local/bin:/usr/bin:/bin;
        include fastcgi_params;
    }
    # Deny access to other .php files, rather than exposing their contents
    location ~ [^/]\.php(/|$) {
        return 403;
    }

    # [Optional] Lychee-specific logs
    error_log  /var/log/nginx/lychee.error.log;
    access_log /var/log/nginx/lychee.access.log;

    # [Optional] Remove trailing slashes from requests (prevents SEO duplicate content issues)
    rewrite ^/(.+)/$ /$1 permanent;
}
```


[1]: https://getcomposer.org/
