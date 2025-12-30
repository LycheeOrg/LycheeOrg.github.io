### Lychee is not working

If Lychee is not working properly, try to open `https://lychee.example.com/Diagnostics`. This script will display all errors it can find.

Another way to see this screen is to use the command: `php artisan lychee:diagnostics`

### When I update my .env with Lychee v7, the changes are not taken into account, what can I do?

Lychee v7 with FrankenPHP requires a container restart to take into account changes made to the `.env` file.

### When I do X, I get an error API not found, what can I do?

Open the dev modules of your browser (usually by pressing `F12`) and open the Network tab.
Redo the action with Network tab open and look at the response of the last query (most likely a red line).
If it is an error 404 or 500, see below, otherwise look at our [issues](https://github.com/LycheeOrg/Lychee/issues) (including the closed ones).
If nothing helps, don't hesitate to open a new one.

### I have an error 404 and I'm using Apache, what can I do?

Verify that the rewrite rules of your server are correctly applied. See [here](upgrade.html#using-apache).

### I have an error 404 and I'm using Nginx, what can I do?

Verify that the rewrite rules of your server are correctly applied. See [here](upgrade.html#using-nginx).

### I have an error 404 and I'm using php -S, what can I do?

Instead of doing `php -S 127.0.0.1:8888` inside `Lychee/public` do `php artisan serve --port=8888` inside Lychee.
This will ensure that the paths and routes are correctly followed.

> {note} Note that the `serve` command should only be used for testing and debuging. It should not be used on a production server.

### I have an error 500, it says 'Class "Mockery" not found', what can I do?

This is because your `APP_ENV` is set to `testing` and you are using production dependencies.
Lychee is trying to mock the requests for test purposes.

To resolve the issue, edit the `.env` file and set `APP_ENV` to something other than `testing`, for example `APP_ENV=production`.

### I have an error 500, what can I do?

Edit the `.env` file and set `APP_DEBUG` to `true`, this will allow the errors to be displayed with the trace.

### I have an errror 419 in the Network tab, what is going on?

Verify that your `SESSION_DRIVER` is not `array`. With `array`, the data is stored a non-persisting PHP array, it is only meant for testing !
More [here](https://laracasts.com/discuss/channels/general-discussion/how-does-cache-driver-array-work).  
Prefer `file` or `database` (but that last one require some [more configuration](https://laravel.com/docs/7.x/session#driver-prerequisites))

> {note} `php -S` web server was designed to aid application development. It may also be useful for testing purposes or for application demonstrations that are run in controlled environments. It is not intended to be a full-featured web server. It should not be used on a public network.

### I can't upload (large) photos.

Issues may occur when trying to upload photos with large **file sizes** or large **resolutions**.

If you experience problems uploading photos with large **file sizes**, you might want to change the PHP parameters in `.htaccess` (if you are using the PHP Apache module) or in `.user.ini` (if you are using PHP with CGI or FastCGI).

> If you modify the `.user.ini` file, you may want to run `git update-index --assume-unchanged .user.ini` afterwards.

If possible, change these settings directly in your `php.ini`. We recommend to increase the values of the following properties:

```ini
max_execution_time = 200
post_max_size = 100M
upload_max_size = 100M
upload_max_filesize = 100M
memory_limit = 256M
```

Also check the settings for your web server (e.g. `client_max_body_size` in nginx) allow for large uploads.

If problems occur when uploading photos with large **resolutions**, the issue may lie with **ImageMagick Security Policy**.
Review and edit the options in `/etc/ImageMagick-6/policy.xml`.
Editing the `width`, `height` and `memory` options can help with enabling upload of images with larger resolutions.

For more information, see [here](https://legacy.imagemagick.org/script/security-policy.php) for ImageMagick 6 and [here](https://imagemagick.org/script/security-policy.php) for ImageMagick 7.

### What does _Upstream sent too big header_ error message mean?

This error may be seen from your browser's console if you're trying to debug something with Lychee. If using `nginx`, try adding the following to Lychee's config and reload nginx's service:
```nginx
fastcgi_buffers 16 16k;
fastcgi_buffer_size 32k;
```

### Why don't my videos have thumbnails?

You will need ffmpeg installed on your server, and to have installed php-ffmpeg using composer as detailed in the [Installation Guide](installation.html).

Once this is taken care of, check that the
[`has_ffmpeg` setting](settings.html) is set to `1`.  Lychee can reset it
to `0` if it can't find the binaries the first time it tries.  The Lychee
log will contain a `Failed to extract snapshot: bad config` notice if that
is the case.

If that doesn't help, check if metadata is extracted correctly from the
video files.  While viewing a video file in Lychee, simply open the info
sidebar (_i_) and check if the resolution, duration, and frame rate are
reported correctly.  If they are not, you may need to let the metadata
extractor know the location of your `ffprobe` binary.  The Lychee log will
contain a `Given path () to the ffprobe binary is invalid` error if this is
the issue.

Edit the file
`Lychee/vendor/lychee-org/php-exif/lib/PHPExif/Adapter/FFprobe.php`,
replacing the line:
```php
protected $toolPath;
```
(here's a
[sample location](https://github.com/LycheeOrg/php-exif/blob/1ea3468d4ea6a5cf0ea6c748a3a2376de38bbbfd/lib/PHPExif/Adapter/FFprobe.php#L36))
with:
```php
protected $toolPath = '/usr/bin/ffprobe';
```
using your correct binary location. If unsure, you can try running
`which ffprobe` on the server.

This will likely need to be repeated for the video frame extraction code;
otherwise, you will see in the Lychee log an `Unable to load FFProbe` error.
To fix that, in Lychee versions prior to 4.2.0, edit the file
`Lychee/app/ModelFunctions/PhotoFunctions.php`, replacing the line:
```php
$ffmpeg = FFMpeg\FFMpeg::create();
```
(here's the
[location for version 4.1.0](https://github.com/LycheeOrg/Lychee/blob/v4.1.0/app/ModelFunctions/PhotoFunctions.php#L566))
with:
```php
$ffmpeg = FFMpeg\FFMpeg::create(array(
        'ffmpeg.binaries'  => '/usr/bin/ffmpeg',
        'ffprobe.binaries' => '/usr/bin/ffprobe',
));
```
again, using your correct binary locations.

Starting with version 4.2.0, the file to edit is instead `Lychee/app/Actions/Photo/Extensions/VideoEditing.php`; replace the line:
```php
$ffmpeg = FFMpeg::create();
```
(here's a
[sample location](https://github.com/LycheeOrg/Lychee/blob/23731e104737175f51a9acef199bf7d8829e5d5c/app/Actions/Photo/Extensions/VideoEditing.php#L48))
with:
```php
$ffmpeg = FFMpeg::create(array(
        'ffmpeg.binaries'  => '/usr/bin/ffmpeg',
        'ffprobe.binaries' => '/usr/bin/ffprobe',
));
```

### Composer can't create a cache directory

* When running Composer, you may notice the following warning:
```
Cannot create cache directory /home/$USER/.composer/cache/files/, or directory is not writable. Proceeding without cache
```
* You can specify Composer's cache directory with the environment variable `COMPOSER_CACHE_DIR=`. For Lychee, the cache is not necessary, and you can both disable it and hide the warning by specifying the location of the cache as `/dev/null` ([information](https://github.com/composer/composer/commit/fd6455218e304e9b484bebb0efcdb67bb52d051d)):
```bash
COMPOSER_CACHE_DIR='/dev/null' composer update --working-dir='/var/www/Lychee'
```

### I can't access the users under settings server error or api not found on Lightspeed

If you receive a server error or "api not found" error under lightspeed web server try going to `cPanel` > `Mod Security` and turning the feature off.

### I know my file permissions for `storage`, `bootstrap/cache`, `public/uploads`, and `public/dist` are correct and accessible by my web server user, but I'm still getting a PHP error when writing to any of these directories.

1. Make sure your PHP user and group is the same user and group as your web server by editing PHP's `www.conf`. For example, on a Fedora 32 Server system, the default user/group for php from Fedora's standard repo defaults to `apache`, even if you do not have Apache installed. 
2. On some operating systems with more restrictive SELinux rules (like Fedora 32 Server at the time of writing), you need to set the SELinux security context of these directories for them to be accessible by your web server user: 
```bash
chcon -R -t httpd_sys_rw_content_t storage
chcon -R -t httpd_sys_rw_content_t bootstrap/cache
chcon -R -t httpd_sys_rw_content_t public/uploads
chcon -R -t httpd_sys_rw_content_t public/dist
```

### I know port 80/443 are open on my machine, but Lychee/my server is still refusing all connections.

On some operating systems with more restrictive SELinux rules (like Fedora 32 Server at the time of writing), you need to allow your web server user to connect over the network with `setsebool -P httpd_can_network_connect on`. You can view the status of your SELinux booleans with `getsebool -a`.

### I know my SQL database is setup correctly, but Lychee is showing `SQLSTATE[HY000] [2002] No such file or directory` and is not able to make changes to the database. 

In `/var/www/html/Lychee/.env`, change `DB_HOST=localhost` to `DB_HOST=127.0.0.1`. Additionally, if `DB_PORT=` is not set, it should be set to `DB_PORT=3306` for mysql/MariaDB's default port, or whatever custom port you selected when configuring your SQL server software after installation. 

### Why are there messages about git files in my logs? (e.g. `.git/HEAD: failed to open stream: No such file or directory`)

Lychee checks for the presence of certain files to detect whether Lychee was installed as a git repository or from a release archive (.zip). It also uses them to determine which git commit is in use where applicable. This is included in the Diagnostics page to assist us in diagnosing issues.

These messages can be safely ignored.

### Import from server via symlink is failing.

If you check the logs and see an output like
```
2021-11-09 19:09:50 -- error -- App\Actions\Import\Exec::do -- 256 -- Could not import file (<path-to-image>/image.jpg): 0 symlink(): Operation not supported
```
this means that the native low-level function `symlink` fails, because the file system does not support symbolic links.
When using this import setting, symbolic links are created below the `/uploads` directory as this is the folder where the media files reside.

As a result, in order to use this function the file system on which `/uploads` resides must support symbolic links (e.g. ext3, ext4, btrfs, zfs, etc.).
_"Windows"_ file systems (e.g. NTFS, FAT, CIFS) won't work.
The directory with the original media files may still be a Windows file system.
This is, because symbolic links (as opposed to hard links) may cross file system boundaries.

### Uploads are not working with Cloudfare / behind a reverse proxy.

Check that the value of `TRUSTED_PROXIES` is correctly set in your `.env` file.

### I get an error SQLSTATE: Numeric value out of range: 1264 Out of range value for column 'legacy_id', what should I do?

Go into your _Settings_ then _More_, find `force_32bit_ids` in the _"config"_ section and set it to `1`.
