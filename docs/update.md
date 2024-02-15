The way you can update Lychee depends of how you did your installation:

* If you used the release channel (downloading a zip file), go to [Update manually](#update-manually)
* If you installed via `git clone` then you can either use a [similar process](#update-using-git) or do it directly online via the [Graphical User Interface](#update-via-the-gui) of Lychee.

## Update requirements

- Your system must comply with the latest [system requirements](installation.html) of the latest version of Lychee.
- Ensure that you are using the version 4 of Lychee. Updates from older version of Lychee are more complex.

Don't forget to take a look at the [Changelog](releases.html) to see what's new and to check for any actions that may be required.

## Update using Git

Fully updating Lychee with `git` is the easiest way:

```bash
# download the lastest files
git pull
# update composer dependencies
composer install --no-dev
# apply the database migration
php artisan migrate
# update Node.js dependencies
npm install
# generate frontend assets
npm run build
```

If you have the `post-merge` hook set up the following is enough:
```bash
git pull
```

## Using Docker compose

There are two cases. Either you are pinned to a release tag, _e.g._ v5.1.2 or you are using a rolling update tag.

> {tip} When using docker, a version rollback is difficult to apply: it requires to bash into the container to run the required migrate commands on the new version before dropping the tag to the previous value.

#### With Rolling update tag

This procedure is for those following one of those tags:

- `latest` &mdash; the last official release
- `nightly` or `dev` &mdash; the last build from the `master` branch (peer reviewed)
- `alpha` &mdash; the last build from the `alpha` branch (no peer review)

Simply run the following.
```bash
docker compose down
docker compose pull
docker compose up -d
```

The database migrations will be applied automatically.

#### With version tag.

First edit your `docker-compose.yml` to point to the version you would like to migrate to.

```diff
-    image: lycheeorg/lychee:v5.1.0
+    image: lycheeorg/lychee:v5.1.2
```

Save and run the following.
```bash
docker compose down
docker compose pull
docker compose up -d
```

The migration will be applied automatically and you should be running the requested tagged version.

## Update manually

This update will be the one you have to use if you are following the Release channel.

1. Download the [newest Version](https://github.com/LycheeOrg/Lychee/releases)
2. Replace all existing files, excluding `public/uploads/`, `public/dist/user.css` and `.env` (and `database/database.sqlite` if using **SQLite** as your database)
3. Go into the `Diagnostic` page and click on the `Apply migration` button.


## Update via the GUI

This requires:

-  `git` to be installed
- write access for your web user (`www-data` for apache2) to all the folders, files **and `.git/`**.
- `exec` to be available as a php function.
- `allow_online_git_pull` has to be set to `1`

#### 1. Go to your Diagnostic page and check for updates

Notice that *Lychee version (git)* tells you:

- the commit number &mdash; *"dfad796"*,
- which branch you are on &mdash; *"master"*,
- you do not have information if you are up to date or not &mdash; *"Data not in Cache"*.

However you should see a "check for Updates" button:

![](img/update/update_1.png)

If you click on it, it will ask your server to check how far behind you are from the bleeding edge version of Lychee:

![](img/update/update_2.png)

#### 2. Refresh your Diagnostic page

Notice that *Lychee version (git)* now tells you:

- that you are behind &mdash; "*1 commits behind master (dc5f03a)*"
- that the last check for update was done some times ago &mdash; "*(9 seconds ago)*"

![](img/update/update_3.png)

#### 3. Apply the update

By clicking on *"Update available"* this will trigger server side a `git pull` and `artisan migrate`.

![](img/update/update_4.png)

You can see the log result of the command line printed above the diagnostic information.
By default composer calls are disabled.

![](img/update/update_5.png)

#### 4. Check for updates

We can once again check for updates:

![](img/update/update_6.png)

![](img/update/update_7.png)

And we are done.

