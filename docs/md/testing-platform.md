## Introduction

In this page we describe one of the multiple ways to develop on Lychee.

- Requires an Apache server with `proxy` and `proxy_http` enabled.
- Requires a Virtual Machine (using e.g. VirtualBox)

## Set Up & Port Forwarding

Set up your VM as if you would install any server.

Set up the following port forwarding:

- `host:10180` &Rarr; `guest:80`
- `host:10122` &Rarr; `guest:22`

The first one will allow us to access the server from Local host, the second will allow us to connect to it via SSH.

## Apache and Proxy in the Host

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

## Apache in the Guest

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

## Visual Studio Code

If you use [Visual Studio Code][3], you can use the [remote ssh extension][4]. It will allow you to directly edit your files in your VM without having to upload and download the files.

[1]: http://lychee.test
[2]: http://lycheeorg.test
[3]: https://code.visualstudio.com/
[4]: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh