<p>
    <a name="installation"></a>
</p>

## Installation

### Server Requirements

The Lychee gallery has a few system requirements. You will need to make sure your server meets the following:

- A web server such as Apache or nginx
- A Database access such as MySQL/MariaDB, PostgreSQL.  
Lychee also comes with SQLite3 support.
- PHP >= 7.3
- BCMath PHP Extension
- Ctype PHP Extension
- Exif PHP Extension
- Ffmpeg PHP Extension (optional &mdash; to generate video thumbnails)
- Fileinfo PHP Extension
- GD PHP Extension
- Imagick PHP Extension (optional &mdash; to generate better thumbnails)
- JSON PHP Extension
- Mbstring PHP Extension
- OpenSSL PHP Extension
- PDO PHP Extension
- Tokenizer PHP Extension
- XML PHP Extension
- ZIP PHP Extension

### Installing Lychee

Lychee utilizes Composer to manage its dependencies. So, before using Lychee from source, make sure you have Composer installed on your machine.

#### From Release 

Download the release zipfile from the Releases page and extract it (usually in `/var/www/html`).

#### From the Master branch

```
git clone https://www.github.com/LycheeOrg/Lychee /var/www/Lychee
```

### Configuration

#### Public Directory
After installing Lychee, you should configure your web server's document / web root to be the `public` directory. The `index.php` in this directory serves as the front controller for all HTTP requests entering your application.

#### Configuration Files
All of the configuration files for Lychee are stored in the `config` directory. Each option is documented, so feel free to look through the files and get familiar with the options available to you.

#### Directory Permissions
After installing Lychee, you may need to configure some permissions. Directories within the `storage` and the `bootstrap/cache` directories should be writable by your web server or Lychee will not run.

#### Application Key
The next thing you should do after installing Lychee is set your application key to a random string. If you installed Lychee via Composer or the Laravel installer, this key has already been set for you by the `php artisan key:generate` command.

Typically, this string should be 32 characters long. The key can be set in the `.env` environment file. If you have not copied the `.env.example` file to a new file named `.env`, you should do that now. **If the application key is not set, your user sessions and other encrypted data will not be secure!**

#### Additional Configuration
Lychee needs almost no other configuration out of the box. You are free to get started developing! However, you may wish to review the `config/app.php` file and its documentation. It contains several options such as `timezone` <!-- and locale--> that you may wish to change according to your application.

You may also want to configure a few additional components of Lychee, such as:
- Cache
- Database
- Session

## Web Server Configuration

### Directory Configuration
Lychee should always be served out of the root of the "web directory" configured for your web server. You should not attempt to serve a Laravel application out of a subdirectory of the "web directory". Attempting to do so could expose sensitive files present within your application.


### Pretty URLs

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
If you are using Nginx, the following directive in your site configuration will direct all requests to the `index.php` front controller:

```
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```