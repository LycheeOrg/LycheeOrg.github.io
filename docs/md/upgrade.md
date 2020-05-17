

## Checking requirements

Check that the server satisfifes the [requirements][1], in particular pay attention the php extensions.
You can display them by using `phpinfo()`.

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

Modify or create `example.com.conf` in `/etc/apache2/site-available/` to point out the served directory:
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

If you are using Nginx you may use the following as an example of set up:

```
# serve static files directly
location ~* \.(jpg|jpeg|gif|css|png|js|ico|html)$ {
  access_log off;
  expires max;
  log_not_found off;
}

# sets the limit on uploaded file sized
client_max_body_size 50M;

# removes trailing slashes (prevents SEO duplicate content issues)
if (!-d $request_filename)
{
  rewrite ^/(.+)/$ /$1 permanent;
}

# enforce NO www
if ($host ~* ^www\.(.*))
{
  set $host_without_www $1;
  rewrite ^/(.*)$ $scheme://$host_without_www/$1 permanent;
}

# unless the request is for a valid file (image, js, css, etc.), send to bootstrap
if (!-e $request_filename)
{
  rewrite ^/(.*)$ /index.php?/$1 last;
  break;
}

location / {
  try_files $uri $uri/ /index.php?$query_string;
}
```
