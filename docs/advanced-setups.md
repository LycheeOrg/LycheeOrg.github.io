<div class="issuelinks" markdown="1">

## Introduction

In this page we describe additional ways to install and potentially to develop on Lychee.

## Separating Data from the Code

As described in issue #486, LudovicRousseau proposes a solution to separate your photos from the Lychee code.

He splits Lychee itself and the pictures into 2 directories:
- `Lychee` with the code of Lychee
- `Lychee-data` containing:
```
Lychee-data/
└── public
    ├── dist
    │   ├── fonts
    │   └── resources
    └── uploads
        ├── big
        ├── import
        ├── medium
        ├── raw
        ├── small
        └── thumb
```
- his `Lychee/.env` contains:
```ini
LYCHEE_DIST="/var/www/Lychee-data/public/dist/"
LYCHEE_UPLOADS="/var/www/Lychee-data/public/uploads/"
```

> {note} Note that the **path needs to be absolute**.


The upgrade script when a new version of Lychee is available is simple:
```bash
mv Lychee Lychee.old
unzip Lychee.zip
cp Lychee.old/.env Lychee
chmod g+w -R Lychee/storage
sudo chgrp www-data -R Lychee/storage
cd Lychee
php artisan key:generate
php artisan migrate
```
It worked fine with the migration from 4.0.4 to 4.0.5 of Lychee.

The hierarchy `Lychee-data/public/` is writeable by the group `www-data` so that apache process can modify the files.
The files in `Lychee` are read only for apache. No write access needed.


## VirtualBox with Visual Studio Code

- Requires an Apache server with `proxy` and `proxy_http` enabled.
- Requires a Virtual Machine (using e.g. VirtualBox)

### Set Up & Port Forwarding

Set up your VM as if you would install any server.

Set up the following port forwarding:

- `host:10180` &Rarr; `guest:80`
- `host:10122` &Rarr; `guest:22`

The first one will allow us to access the server from Local host, the second will allow us to connect to it via SSH.

### Apache and Proxy in the Host

Edit your `/etc/hosts` to contain:
```
127.0.0.1	lychee.test
127.0.0.1	lycheeorg.test
```

Create configuration files in `/etc/apache2/sites-available`: `001-lychee-test.conf` and `002-lycheeorg-test.conf`

```apacheconf
<VirtualHost *:80>
	ServerName lychee.test

	ProxyPass / http://localhost:10180/
	ProxyPassReverse / http://lychee.test/
	ProxyPreserveHost On
	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```
and
```apacheconf
<VirtualHost *:80>
	ServerName lycheeorg.test

	ProxyPass / http://localhost:10180/
	ProxyPassReverse / http://lycheeorg.test/
	ProxyPreserveHost On
	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

Enable the sites and reload apache:
```bash
sudo a2ensite 001-lychee-test.conf
sudo a2ensite 002-lycheeorg-test.conf
sudo systemctl restart apache2
```

### Apache in the Guest

In your guest OS, clone the Lychee repository (requires ssh key to be set up):

```bash
git clone git@github.com:LycheeOrg/Lychee.git /var/www/html/Lychee
git clone git@github.con:LycheeOrg/LycheeOrg.github.io /var/www/html/LycheeOrg.github.io
```

Similarily in `/etc/apache2/sites-available` create 2 configuration files: `001-lychee.conf` and `002-lycheeorg.conf`

```apacheconf
<VirtualHost *:80>
	ServerName lychee.test

	DocumentRoot /var/www/html/Lychee/public

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```
and
```apacheconf
<VirtualHost *:80>
	ServerName lycheeorg.test

	DocumentRoot /var/www/html/LycheeOrg.github.io

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

Enable the sites and reload apache:
```bash
sudo a2ensite 001-lychee-test.conf
sudo a2ensite 002-lycheeorg-test.conf
sudo systemctl restart apache2
```

Open a browser on your host and navigate to [http://lychee.test][1] and [http://lycheeorg.test][2] enjoy.

### Visual Studio Code

If you use [Visual Studio Code][3], you can use the [remote ssh extension][4]. It will allow you to directly edit your files in your VM without having to upload and download the files.

[1]: http://lychee.test
[2]: http://lycheeorg.test
[3]: https://code.visualstudio.com/
[4]: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh


## Other means of distributions

In this section we present few out-of-the-box solutions providing Lychee.

> {note} Please note that we, at LycheeOrg, do not endorse any of the following solutions.
We give the reader a link to their websites as they provide our software.
**You are free to use their installation, however we will not be providing you support with their solution**.

### With Linuxserver.io (Free)

Linuxserver.io is a group of like minded enthusiasts from across the world who build and maintain the largest collection of Docker images on the web,
and at our core are the principles behind Free and Open Source Software.
Their primary goal is to provide easy-to-use and streamlined Docker images with clear and concise documentation.

You can find the corresponding Lychee image [here](https://fleet.linuxserver.io/image?name=linuxserver/lychee).

### With Yunohost (Free)

[Yunohost](https://yunohost.org/) is a simple operating system for self-hosting your applications.
[Lychee is available from their app store](https://yunohost.org/de/app_lychee) and can be installed by clicking [this installation link](https://install-app.yunohost.org/?app=lychee).
You can find the source code of the app under <https://github.com/YunoHost-Apps/lychee_ynh>.

### With Cloudron (Paid)

Cloudron is a complete solution for running apps on your server and keeping them up-to-date and secure.

[![Install](https://cloudron.io/img/button.svg)](https://cloudron.io/store/com.electerious.lychee.cloudronapp.html)

The source code for the package can be found [here](https://git.cloudron.io/cloudron/lychee-app).

See their pricing [here](https://cloudron.io/pricing.html).

### With alwaysdata (Paid)

alwaysdata.com is a modern hosting platform allowing you to host all your services in one place: files, emails, sites, media, databases, workers, etc.

You can use their Marketplace to [install Lychee](https://www.alwaysdata.com/en/marketplace/lychee/) and have your own instance available (with HTTPS) within a minute!

See their pricing [here](https://www.alwaysdata.com/en/).

## Implementing Object Storage 

An S3-compatible object storage solution is designed to store, manage, and access unstructured data in the cloud. 

Under Object Storage, files (also called objects) are stored in flat data structures (referred to as buckets) alongside their own rich metadata.

Due to the nature of Object Storage, it does not require the use of a Compute Instance. Instead, Object Storage gives each object a unique URL with which you can access the data.

### Limitations
- Upload file size limit: 5 GB
- All recursive tasks including (search, find, ls, etc.) have poor performance due to network latency

### S3 Object Storage Setup

The instructions in this guide are based on CentOS/Fedora/RHEL family, but it is easy to replicate the commands into any other distro.


**Install s3fs FUSE-base file system**

s3fs allows Linux and other OS's to mount an S3 bucket via FUSE (Filesystem in Userspace).

s3fs makes you operate files and directories in S3 bucket like a local file system.

[s3fs-fuse - Instructions from developer](https://github.com/s3fs-fuse/s3fs-fuse)

```
sudo dnf install s3fs-fuse
sudo echo ACCESS_KEY_ID:SECRET_ACCESS_KEY > /etc/passwd-s3fs
sudo chmod 600 /etc/passwd-s3fs
```

**Configure SELinux to allow access to the new filesystem**

```
setsebool -P httpd_use_fusefs 1
```

**Setup a permanent mounting point**

Create S3 Object mount point:

```
sudo mkdir /mnt/bucket
```

Edit fstab to create a new mount on boot:

```
Add the following line to: /etc/fstab

<bucket> /mnt/bucket fuse.s3fs _netdev, allow_other, enable_noobj_cache, url=<s3_endpoint>, use_cache="", passwd_file=/etc/passwd-s3fs, mp_umask=0002 0 0
```

    Example:
        <bucket>                        mybucket (name used in your cloud provider)
        <s3_endpoint>                   https://eu-central-1.linodeobjects.com

    Parameters are explained below:
        allow_other                     Allow other users to access the bucket
        mp_umask                        Mask permissions for mount point
        enable_noobj_cache              Performance improvement - Enable when bucket is exclusively used by s3fs
        use_cache=""                    Disabled
        use_cache=/var/cache/s3fs       Enabled (to be used with care, because the cache can grow out of control. Also, I haven't noticed much difference using it)
	

Reboot your server to confirm S3 Object Storage is mounted correctly.

Create Lychee's mount point:

```
sudo mkdir /mnt/bucket/uploads
```

### Create and run Lychee container
From now on, Lychee will see the Object Storage mount transparently like any other mount. The container's volume `/uploads` needs to point to the new created mount:

```
sudo podman run --rm -d --name myphotos --label "io.containers.autoupdate=registry" -p 8080:80 -v /mnt/bucket/uploads:/uploads -v lychee-sym:/sym -v lychee-conf:/conf -v lychee-logs:/logs -e PUID=33 -e PGID=1000 -e PHP_TZ=.. docker.io/lycheeorg/lychee:latest
```

### Configure .ENV
To avoid latency when clicking Diagnostics, my suggestion is to disable BasicPermissionCheck. Otherwise, depending on the number of photos in your gallery, this task can take hours.

```/var/lib/containers/storage/volumes/lychee-conf/_data/.env
	SKIP_DIAGNOSTICS_CHECKS=BasicPermissionCheck
```

### Limitations to be considered
As explained before, recursive tasks are penalised in Object Storage, so if you have an existing bucket and the container runs for the first time, it will take long time to review and set the permissions in your mount. Depending on the number of photos, it can take several hours.

</div>
