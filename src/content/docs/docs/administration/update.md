---
title: "Updating Lychee"
description: "How to update Lychee to the latest version."
sidebar:
  order: 1
---

The way you can update Lychee depends on how you did your installation:

* If you used Docker, go to [Using Docker compose](#using-docker-compose)
* If you used the release channel (downloading a zip file), go to [Update manually](#update-manually)
* If you installed via `git clone`, go to [Update using Git](#update-using-git)

- Your system must comply with the latest [system requirements](/docs/getting-started/installation/) of the latest version of Lychee.
- Ensure that you are using the version 4 of Lychee. Updates from older version of Lychee are more complex.

Don't forget to take a look at the [Changelog](/docs/getting-started/releases/) to see what's new and to check for any actions that may be required.

## Using Docker compose

There are two cases. Either you are pinned to a release tag, _e.g._ v5.1.2 or you are using a rolling update tag.

:::tip
When using docker, a version rollback is difficult to apply: it requires to bash into the container to run the required migrate commands on the new version before dropping the tag to the previous value.
:::


#### With Rolling update tag

This procedure is for those following one of those tags:

- `latest` &mdash; the last official release
- `edge` or `master` &mdash; the last build from the `master` branch

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
3. Go into the `Diagnostic` page (this will mostly happen automatically) and click on the `Apply migration` button.

Note: if using `rsync` to upload stuff to the web server, something like this might be used: 

```bash
rsync -vrtz --delete --chmod=Du=rwx,Dg=rx,Do=rx,Fu=rw,Fg=r,Fo=r --exclude=public/uploads/ --exclude=public/dist/user.css --exclude=.env --exclude=database/database.sqlite Lychee/ user@web.server.web:~/www/your_path_to/lychee/
```

## Update using Git

Fully updating Lychee with `git` is the easiest way:

```bash
# download the lastst files
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
