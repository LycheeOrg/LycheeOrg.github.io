## Installation

### Server Requirements

The Lychee gallery requires:

- A web server capable of serving PHP applications, such as Apache or Nginx.
- PHP >= 7.3
- The following PHP extensions (typically installed with your distribution's package manager e.g. `apt` on Ubuntu):
  - BCMath PHP Extension
  - Ctype PHP Extension
  - Exif PHP Extension
  - Fileinfo PHP Extension
  - GD PHP Extension
  - JSON PHP Extension
  - Mbstring PHP Extension
  - OpenSSL PHP Extension
  - PDO PHP Extension
  - Tokenizer PHP Extension
  - XML PHP Extension
  - ZIP PHP Extension

Lychee also supports, but does not require:

- Lychee can use either MySQL/MariaDB, PostgreSQL, or, SQL Server database backends. However, if no database is available,
  Lychee can be configured to use SQLite3.
- FFMPEG PHP Extension (used to generate video thumbnails)
- Imagick PHP Extension (used to generate better thumbnails)

Recommended, but not required:

- While Lychee works on 32bit systems, we do recommend the use of a 64bit OS.

### Installing Lychee

We provide three methods to install Lychee; using Docker, from the latest release &mdash;simple unzip&mdash;, or from source.

#### With Docker

Read [here](docker.html).

#### From Release 

Download the release zip-file from the Releases page and extract it (usually in `/var/www/html`).
It contains a trimmed down version of the Lychee files.

#### From the Master branch

Lychee utilizes [Composer](https://getcomposer.org/) to manage its dependencies. Make sure you have Composer installed on your machine.

```
git clone https://www.github.com/LycheeOrg/Lychee /var/www/html/Lychee
```
Get into the directory:
```
cd /var/www/html/Lychee
```
Install the required dependencies.
```
composer install --no-dev
```
If you want to help develop Lychee, you can enable development features by removing the `--no-dev`.


### Configuration

#### Public Directory
After installing Lychee, configure your web server's document / web root to be the `public` directory. The `index.php` in this directory serves as the front controller for all HTTP requests entering your application.

#### Configuration Files
All of the configuration files for Lychee are stored in the `config` directory. Each option is documented, so feel free to look through the files and get familiar with the options available to you.

#### Directory Permissions
After installing Lychee, you need to configure some permissions. Directories within the `storage` and the `bootstrap/cache` directories should be writable by your web server or Lychee will not run. Additionaly `public/dist`, `public/uploads` and `public/sym` needs to be writable for you to be able to change the CSS, upload photos, generate symbolic links to protect the originals.

#### Application Key
The next thing you should do after installing Lychee is set your application key to a random string. This is easily done by using the `php artisan key:generate` command.

Typically, this string should be 32 characters long. The key can be set in the `.env` environment file. If you have not copied the `.env.example` file to a new file named `.env`, you should do that now.

**If the application key is not set, your user sessions and other encrypted data will not be secure!**

#### Additional Configuration
Lychee needs almost no other configuration out of the box. You are free to get started developing! However, you may wish to review the `config/app.php` file and its documentation. It contains several options such as `timezone` <!-- and locale--> that you may wish to change according to your installation.

You may also want to configure a few additional components of Lychee, such as:
- Cache
- Database
- Session

## Web Server Configuration

#### Apache

Lychee includes a `public/.htaccess` file that is used to provide URLs without the `index.php` front controller in the path. Before serving Lychee with Apache, be sure to enable the `mod_rewrite` module so the `.htaccess` file will be honored by the server.

If the `.htaccess` file that ships with Lychee does not work with your Apache installation, try this alternative:

```
Options +FollowSymLinks -Indexes
RewriteEngine On

RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [L]
```

#### Nginx
Use the following configuration (typically placed under `sites-available`) for Nginx.

```
# Example Lychee 4 configuration server block for Nginx. To use, search for (1), (2), and (3) and alter these sections
# to match your configuration. With the exception of the optional settings at the bottom of this file, nothing else
# needs to be modified.

server {
    #Required: Nginx listen and server_name configuration. If TLS support is required, use LetsEncrypt certbot, which
    #(1)       will acquire certificates and make the required configuration changes to support TLS automatically.
    
    listen 80;
    server_name <mydomain>.<tld>;
    
    #Required: root path of Lychee public/ directory. This is the directory that contains index.php and a only few
    #(2)       subdirectories, not the git root directory that contains readme.md (etc).
    
    root /var/www/lychee/public/;
    
    #Optional, but highly recommended: ensure directory listings are disabled. This is the Nginx default, but better
    #                                  safe than sorry if the default has been changed.
    autoindex off;
    
    #Required: the front-end expects to find icons and other graphical resources in /Lychee-front/images/ but the
    #          git repo path structure places these resources in /img/. Rewrite requests to the correct path.
    #          !!! Do not modify unless you know what you're doing. !!!

    location  /Lychee-front/images/ { rewrite ^/Lychee-front/images/(.*)$ /img/$1 last; }

    #Required: the front end sends some requests to the the back-end via POST requests sent to /php/index.php,
    #          but this file is actually /index.php. Rewrite requests to the correct path.
    #          !!! Do not modify unless you know what you're doing. !!!
    
    location = /php/index.php { rewrite ^/(.*)$ /index.php?/$1 last; }

    #Required: the front end sends most requests to the back end via POST requests sent to endpoints in /api.
    #          Rewrite these requests so they reach /index.php
    #          !!! Do not modify unless you know what you're doing. !!!
    
    location ^~ /api/ { rewrite ^(.*)$ /index.php?/$1 last; }

    #Required: Serve requests for / to index.php (via index directive), otherwise serve files with the specified
    #          extensions directly. Return 404 for all other file extensions to prevent any erroneously placed
    #          files from leaking.
    #          !!! Do not modify unless you know what you're doing. !!!
    
    location ~* ^\/$|\.(jpg|jpeg|gif|css|png|js|ico|html|txt|svg)$ { index index.php; }
    location / { return 404; }

    #Required: serve /index.php through php. Restricting this location block to Lychee's only php endpoint provides
    #(3)       defense-in-depth against malicious php scripts being executed by an attacker. This block must be
    #          altered to match your PHP configuration. Security implications if modified inappropriately.

    location = /index.php {
        fastcgi_split_path_info ^(.+?\.php)(/.*)$;

        # Mitigate https://httpoxy.org/ vulnerabilities
        fastcgi_param HTTP_PROXY "";

    # Modify between these lines (down) to match your PHP configuration
        fastcgi_pass unix:/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PHP_VALUE "post_max_size=100M
            max_execution_time=200
            upload_max_filesize=20M
            memory_limit=300MM";
        fastcgi_param PATH /usr/local/bin:/usr/bin:/bin;
        include fastcgi_params;
    # Modify between these lines (up) to match your PHP configuration    
    }

    #Optional, but highly recommended: lychee-specific logs. For security reasons, do not disable logging on any public
    #                                  server.
    
    error_log  /var/log/nginx/lychee.error.log;
    access_log /var/log/nginx/lychee.access.log;
    
    #Optional: Override default favicon

    #location = /favicon.ico { alias <path to favicon>; }

    #Optional: Remove trailing slashes from incoming requests (prevents SEO duplicate content issues)

    rewrite ^/(.+)/$ /$1 permanent;

    #Optional: Remove www prefix from domain name. Note that DNS and server_name directives for www.<mydomain>.<tld>
    #          must exist for this to work.
    
    rewrite ^www\.(.+)$ $1 permanent;
   
    #Optional: Drop http/1.0 connections. On the modern web, the only clients using http 1.0 are usually bots looking
    #          for security vulnerabilities.

    if ($server_protocol ~* "HTTP/1.0") { return 444; }
    
    #Optional: Drop requests that result in errors rather than returning an error message. Marginally reduces server
    #          load and bandwidth use if your server is bombarded by attackers probing for insecure php pages.
    
    #error_page 400 402 403 404 405 406 407 408 409 410 411 412 413 414 415 416 417 418 421 422 423 424 425 426 428 429
    #        431 451 500 501 502 503 504 505 506 507 508 510 511 =444 /444.html;
    #location = /444.html { return 444; }
}

```
### Troubleshooting

See the [FAQ](https://lycheeorg.github.io/docs/faq.html#problems).
