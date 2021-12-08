## Checking requirements

Check that the server satisfifes the [requirements](installation.html#web-server-configuration). In particular pay attention the PHP extensions.
You can display installed PHP extensions using `phpinfo()`.

## Preparing the files

Assuming the following tree:
```
/var/
  |- www/
         |- html/
              |- Lychee/
              |- <you are here>
```

Rename Lychee into Lychee-v3:
```
mv Lychee Lychee-v3
```

Install Lychee files by either uploading the content of the released zip or cloning the repository:
```
git clone https://github.com/LycheeOrg/Lychee Lychee
```

Move the pictures from the version 3 to the newly created installation:
```
mv Lychee-v3/uploads/big/* Lychee/public/uploads/big/
mv Lychee-v3/uploads/medium/* Lychee/public/uploads/medium/
mv Lychee-v3/uploads/small/* Lychee/public/uploads/small/
mv Lychee-v3/uploads/thumb/* Lychee/public/uploads/thumb/
```

## Preparing the server

> {note} The big difference between Lychee version 3 and Lychee version 4 is the served directory, i.e. where you webserver needs to point to.

- In the version 3, this was the root `.` of Lychee.
- In the version 4, this is the `public` directory inside Lychee.

### Using Apache

**Make sure you have the module rewrite available and enabled: `a2enmod rewrite`**.

Modify your `/etc/apache2/apache2.conf` to allow `.htaccess` to set up the rewrite rules:
```
<Directory /var/www/html/Lychee>
	Options Indexes FollowSymLinks
	AllowOverride All
	Require all granted
</Directory>
```

Modify or create `example.com.conf` in `/etc/apache2/sites-available/` to point out the served directory:
```
<VirtualHost *:80>
	ServerName example.com

	DocumentRoot /var/www/html/Lychee/public

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

Enable the site:
```
a2ensite `example.com.conf`
```

Restart apache2:
```
systemctl restart apache2
```

Process with the 

### Using Nginx

If you are using Nginx, an example configuration can be found [here](installation.html#web-server-configuration).
