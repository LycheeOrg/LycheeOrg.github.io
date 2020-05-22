The way you can update Lychee depends of how you did your installation:

* If you used the release channel (downloading a zip file), go to [Update manually](update-manually)
* If you installed via `git clone` then you can either use a [similar process](update-using-git) or do it directly online via the [Graphical User Interface](update-via-the-gui) of Lychee.

## Update requirements

- Your system must comply with the latest [system requirements](installation.html) of the latest version of Lychee.
- Ensure that you are using the version 4 of Lychee. Updates from older version of Lychee are more complex.

Don't forget to take a look at the [Changelog](releases.html) to see what's new and to check for any actions that may be required.

## Update using Git

Fully updating Lychee with `git` is the easiest way:

```sh
# download the lastest files
git pull
# update the dependencies
composer install --no-dev
# apply the database migration
php artisan migrate
```

If you have the `post-merge` hook set up the following is enough:
```sh
git pull
```

## Update manually

This update will be the one you have to use if you are following the Release channel.

* 1 &mdash; Download the [newest Version](https://github.com/LycheeOrg/Lychee/releases)
* 2 &mdash; Replace all existing files, excluding `uploads/` and `dist/user.css`
* 3 &mdash; Go into the `Diagnostic` page and click on the `Apply migration` button.


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

