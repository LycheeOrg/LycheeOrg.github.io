## Image Content

This image features Lychee, nginx and PHP-FPM. The provided configuration (PHP, nginx...) follows Lychee's official recommendations.

The following tags are available :

* `latest`: Latest Lychee release
* `v[NUMBER]`: Stable version tag for a Lychee release
* `dev`: Current master branch tag (Lychee operates on a stable master, so this should usually be safe)
* `testing`: Tag for testing new branches and pull requests. Designed for internal use by LycheeOrg.

Note that only the `:dev` tag is available for armv6 and armv7 systems. This is due to an issue with the build environment and is hopefully temporary.

## Setup

### Prerequisites

You must have a database docker running **OR** create one in your `docker-compose.yml`.

* 1 &mdash; Create the db, username, password.
* 2 &mdash; Edit the environment variables (db credentials, language...) by :
    *  Supplying the environment variables via `docker run` / `docker-compose`, **or**
    *  Creating a `.env` file with the appropriate info and mount it to `/conf/.env`.

### Run with Docker

**Make sure that you link to the container running your database !!**  

The example below shows `--net` and `--link` for these purposes. `--net` connects to the name of the network your database is on and  `--link` connects to the database container.

```bash
docker run -d \
--name=lychee \
-v /host_path/lychee/conf:/conf \
-v /host_path/lychee/uploads:/uploads \
-v /host_path/lychee/sym:/sym \
-e PUID=1000 \
-e PGID=1000 \
-e PHP_TZ=America/New_York \
-e DB_CONNECTION=mysql \
-e DB_HOST=mariadb \
-e DB_PORT=3306 \
-e DB_DATABASE=lychee \
-e DB_USERNAME=user \
-e DB_PASSWORD=password \
-p 90:80 \
--net network_name \
--link db_name \
lycheeorg/lychee
```

**Warning** : if you use a MySQL database, make sure to use the `mysql_native_password` authentication plugin, either by using the `--default-authentication-plugin` option when starting mysql, or by running a query to enable the authentication plugin for the `lychee` user, e.g. :

```
alter user 'lychee' identified with mysql_native_password by '<your password>';
```

### Run with Docker Compose

Change the environment variables in the [provided example](https://github.com/LycheeOrg/Lychee-Docker/blob/master/docker-compose.yml) to reflect your database credentials.

Note that in order to avoid writing credentials directly into the file, you can create a `db_secrets.env` and use the `env_file` directive (see the [docs](https://docs.docker.com/compose/environment-variables/#the-env_file-configuration-option)).

## Available environment variables and defaults

If you do not provide environment variables or `.env` file, the [example .env file](https://github.com/LycheeOrg/Lychee/blob/master/.env.example) will be used with some values already set by default.

Some variables are specific to Docker, and the default values are :

* `PUID=1000`
* `PGID=1000`
* `USER=lychee`
* `PHP_TZ=UTC`
* `STARTUP_DELAY=0`

## Advanced configuration

Note that nginx will accept by default images up to 100MB (`client_max_body_size 100M`) and that PHP parameters are overridden according to the [recommendations of the Lychee FAQ](https://lycheeorg.github.io/docs/faq.html#i-cant-upload-photos).

You may still want to further customize PHP configuration. The first method is to mount a custom `php.ini` to `/etc/php/7.3/fpm/php.ini` when starting the container. However, this method is kind of brutal as it will override all parameters.

Instead, we recommend to use the `PHP_VALUE` directive of PHP-FPM to override specific parameters. To do so, you will need to mount a custom `nginx.conf` in your container :

* 1 &mdash; Take the [default.conf](https://github.com/LycheeOrg/Lychee-Docker/blob/master/default.conf) file as a base
* 2 &mdash; Find the line starting by `fastcgi_param PHP_VALUE [...]`
* 3 &mdash; Add a new line and set your new parameter
* 4 &mdash; Add or change any other parameters (e.g. `client_max_body_size`)
* 5 &mdash; Mount your new file to `/etc/nginx/nginx.conf`
