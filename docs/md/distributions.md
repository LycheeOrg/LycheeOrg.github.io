<div class="issuelinks" markdown="1">

## Introduction

In this page we describe additional ways to install and potentially to develop on Lychee.

## Separating Data from the Code

As described in issue #486 , LudovicRousseau proposes a data-code separation way of installing Lychee.


He splits Lychee itself and the pictures he has 2 directories:
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
```
LYCHEE_DIST="/var/www/Lychee-data/public/dist/"
LYCHEE_UPLOADS="/var/www/Lychee-data/public/uploads/"
```

> {note} Note that the **path needs to be absolute**.


The upgrade script when a new version of Lychee is available is simple:
```
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


## Virutal Box with Visual Studio Code

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

```
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
```
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
```
sudo a2ensite 001-lychee-test.conf
sudo a2ensite 002-lycheeorg-test.conf
sudo systemctl restart apache2
```

### Apache in the Guest

In your guest OS, clone the Lychee repository (requires ssh key to be set up):

```
git clone git@github.com:LycheeOrg/Lychee.git /var/www/html/Lychee
git clone git@github.con:LycheeOrg/LycheeOrg.github.io /var/www/html/LycheeOrg.github.io
```

Similarily in `/etc/apache2/sites-available` create 2 configuration files: `001-lychee.conf` and `002-lycheeorg.conf`

```
<VirtualHost *:80>
	ServerName lychee.test

	DocumentRoot /var/www/html/Lychee/public

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```
and
```
<VirtualHost *:80>
	ServerName lycheeorg.test

	DocumentRoot /var/www/html/LycheeOrg.github.io

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

Enable the sites and reload apache:
```
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


## With Linuxserver.io (Free)

Linuxserver.io is a group of like minded enthusiasts from across the world who build and maintain the largest collection of Docker images on the web,
and at our core are the principles behind Free and Open Source Software.
Their primary goal is to provide easy-to-use and streamlined Docker images with clear and concise documentation.

You can find the corresponding Lychee image [here](https://fleet.linuxserver.io/image?name=linuxserver/lychee).

> {tip} Please note that we, at LycheeOrg, do not endorse LinuxServer.io.
We give the reader a link to their websites as they provide our software.
You are free to use their installation, however we will not be providing you support with their solution.


## With Cloudron (Princing)

Cloudron is a complete solution for running apps on your server and keeping them up-to-date and secure.

[![Install](https://cloudron.io/img/button.svg)](https://cloudron.io/store/com.electerious.lychee.cloudronapp.html)

The source code for the package can be found [here](https://git.cloudron.io/cloudron/lychee-app).

See their pricing [here](https://cloudron.io/pricing.html).

> {tip} Please note that we, at LycheeOrg, do not endorse Couldron.
We give the reader a link to their websites as they provide our software.
You are free to use their installation, however we will not be providing you support with their solution.

</div>