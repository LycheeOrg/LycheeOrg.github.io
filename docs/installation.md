## Installation

### Server Requirements

The Lychee gallery has a few system requirements. You will need to make sure your server has the following:

- A web server such as Apache or nginx
- A database &mdash; using one of the following:
	- MySQL _(version > 5.7.8)_ / MariaDB _(version > 10.2)_
	- PostgreSQL _(version > 9.2)_
	- Lychee's inbuilt SQLite3 support
- PHP >= 8.0 with these PHP extensions:
	- bcmath
	- ctype
	- dom
	- exif
	- fileinfo
	- filter
	- gd
	- imagick (optional &mdash; to generate better thumbnails)
	- json
	- libxml
	- mbstring
	- openssl
	- pcre
	- PDO
	- Phar
	- SimpleXML
	- tokenizer
	- xml
	- xmlwriter
- These PHP extensions may be necessary if you are running a FreeBSD system:
	- session
	- zlib
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

Permissions of certain directories must be set correctly for Lychee to run.
Note that there are up to three OS users which need to be taken into consideration:

 - The user who is running the Web server daemon; called the **Web user** in the following.
   Depending on your distribution and web server typically this user is called `apache`, `nginx`, `www` or `www-data`.
 - (Optional) The user who is running the PHP FPM (or PHP CGI) pool; called the **PHP user** in the following.
   Not every setup uses PHP FPM or PHP CGI.
   For example, Apache executes the PHP interpreter as part of its own process if the extension `mod_php` is used.
   In case PHP FPM is used, for most distributions PHP FPM or CGI ships with a sensible default configuration which ensures that the PHP user is the same as the Web user.
   In both cases the PHP user is not of concern.
   However, we are at least aware of one exception to this rule for Nginx on Fedora, see [FAQ](https://lycheeorg.github.io/docs/faq.html#i-know-my-file-permissions-for-storage-bootstrapcache-publicuploads-and-publicdist-are-correct-and-accessible-by-my-web-server-user-but-im-still-getting-a-php-error-when-writing-to-any-of-these-directories)
 - The user which you use for shell logins and to run scripts; called the **CLI user** in the following.
   This user may be of particular concern, if you are planning to upload photos via the web interface _and_ import photos via the shell scripts.

The following permissions must be granted at least:

 - All directories and files of the Lychee installation must at least be readable by the Web and PHP user.
 - Directories and files within the `storage/` and the `bootstrap/cache/` directories must be writable by the Web and PHP user.
 - If you wish to customise the CSS via the web frontend, directories and files within the `public/dist` directory must be writable by the Web and PHP user.
 - Directories and files within the `public/uploads` and `public/sym` must at least be writeable by the Web and PHP user.
   If you only intend to upload files via the web frontend, this is sufficient.
   If you also plan to use the CLI to import files, the directories and files must additionally be writeable by the CLI user.
   It is not sufficient, if only already existing directories are writeable by the Web, PHP and CLI user, all directories and files yet to be created must be so, too.
   The recommended way is to ensure that all three users are at least member of one joined group, e.g. you may add your CLI user to the group used by the Web and PHP user.
   The directory and files then needs to owned by this group and be group writeable.
   On top, the special `sgid` bit needs to be set for all directories.
   This ensures that newly created directories and files become owned by the joined group and not by the primary group of the creator.

#### Application Settings

The main directory should contain a `.env` file.
Normally, Composer will have copied this file for you while installing the dependencies.
If the `.env` file does not exist, then you should copy `.env.example` to a new file named `.env` now.
Note that the `.env` file should **not** be exposed online as it contains the encryption key used for cookies as well as database credentials.

##### Application Key

The `.env` file contains the setting `APP_KEY` which holds your application key.
Normally, Composer sets this key for you while installing the dependencies.
If the key is not set, Lychee will not work. Then, you can use the `php artisan key:generate` command to set the application key to a random value.

##### URL

The variable `APP_URL` inside `.env` must be set to the external URL by which the `public/` folder is accessible.
This setting must match the configuration of your web server (see below).

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
The configuration option `APP_URL` of Lychee must be set accordingly (see above).

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
