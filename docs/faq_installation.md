### How can I install Lychee without SSH access?

1. Download the latest release
2. Extract and upload the folder via FTP
3. access the website

If you are at the wrong address you will be told to go to the `public` folder.
Once open, you will be redirected to the install procedure. Completed you will be able to create an admin account and enjoy Lychee.

### How do I upgrade from Lychee v3 to Lychee v4?

The process is described [here](upgrade.html).

### How can I back up my installation?

To back up your Lychee installation you need to perform the following steps:

1. Create a copy of at least the following parts of the Lychee directory tree (e.g., `/var/www/html/Lychee`):
```
.env
public/dist/user.css
public/uploads/
```
2. Dump the Lychee database to a file. E.g., if you are using MySQL, run:
```bash
mysqldump -u user -ppassword --databases lychee_database > lychee_backup.sql
```
Replace `user`, `password`, and `lychee_database` by the values of `DB_USERNAME`, `DB_PASSWORD`, and `DB_DATABASE` from the `.env` file in the Lychee folder.

### How can I migrate my installation to a new host?

1. Back up your installation as described above
2. Download the latest release of Lychee.
3. Overwrite the files with your back up
4. Restore the database on the new host, e.g., for MySQL: `mysql -u user -ppassword < lychee_backup.sql`

### Can I host Lychee with a subpath with Nginx? Like `https://example.dev/lychee/`

Yes, here is a configuration to help you:

```nginx
location ^~ /lychee {
    alias /var/www/lychee/public;
    index index.php;
    try_files $uri $uri/ @lychee;
    location ~ \.php$ {
        if (!-e $request_filename) {
            rewrite ^/lychee/?(.*)$ /lychee/index.php?/$1 last;
            break;
        }
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $request_filename;
    }
}
location @lychee {
    rewrite /lychee/(.*)$ /lychee/index.php?/$1 last;
}
```

### Can I host Lychee with a subpath with Apache? Like `https://example.dev/lychee/`

Yes, just create a Symbolic Link and allow your apache configuration to follow them.
At website.com root `ln -s Lychee/public pics` and you will get exactly what you want: `website.com/pics`

### Do we really need writable `app/`?

From [#311](https://github.com/LycheeOrg/Lychee/issues/311)

Short answer: Lychee will work without a writable `app/` folder.

However, if you want to be able to update your Lychee installation with a click of a button in the web browser (though it's disabled by default), your whole Lychee installation tree (and not just `app/`) must be http-writable.

As far as I know, the minimum set of directories that need to be http-writable is as follows:
```
storage/
storage/
storage/
public/uploads/small
public/uploads/big
public/uploads/thumb
public/uploads/medium
public/uploads/import
public/dist
```

### Is it possible to do the update directly from the GUI? How?

You go to `Diagnostics` &Rarr; `Check for Updates`  
Once done you need to update the `Diagnostic` page (click on it again in the left menu) 
You will see a `Apply Update` button on the top. Click on it and done.
If it breaks (error 500) you can still go back to command line and do your `git pull`, migrate etc...

There are some securities that you need to disable via the advanced settings menu:

- you need to allow update if your `.env` specify `production`:  
  `force_migration_in_production = 1`
- you need to allow composer :  
  `apply_composer_update = 1` (optional)

The second one is really optional if updates don't need the composer (like 90% of the time) then it can just stay at `0`.

### Can I migrate from a 64-bit system to a 32-bit system?

Yes, but it's not trivial or recommended. After copying the database:
1. Download [this](https://github.com/LycheeOrg/Lychee/raw/54d00878949906c2efd4f6ddd9e79669637c58fb/database/migrations/2019_04_07_193345_fix_32bit.php) file to your `database/migrations/` folder.
2. Run  the SQL command `delete from migrations where migration='2019_04_07_193345_fix_32bit';` to make sure it will run.
3. Run `php artisan migrate`. This should run a one-off migration that was originally added to allow 32-bit systems to migrate from Lychee v3.

This will only work on top-level albums. Subalbums will require [manual intervention](https://github.com/LycheeOrg/Lychee/issues/406#issuecomment-571378073).

### Why can't I see the *check for update* button in the GUI?

- Make sure you are using a `git` installation and not a downloaded release
- Make sure you are on the `master` branch
- Make sure your web user has read and write access to `.git`
- Check that `exec` is available.
- Check that `allow_online_git_pull` setting is set to `1`

### How can I stop `artisan migrate` and `composer` from running after every `git pull`?

We've set composer to install git `pre-commit` and `post-merge` hooks by default.
- The pre-commit is to help developers by checking and fixing and code style problems before they hit our testing. If you aren't committing and changes, this will not be run.
- The post-merge ensures that your dependencies and database version are kept current. This can be disabled by creating a file `.NO_AUTO_COMPOSER_MIGRATE` in your Lychee root and deleting (if necessary) `.git/hooks/post-merge`. If you disable this script, you will need to run `composer` and `artisan migrate` manually. Alternatively, the Update UI can be set to handle this if you run your updates there.
