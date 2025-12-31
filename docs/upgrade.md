

## Upgrading Lychee docker installations from v6 to v7

> {note} **Critical Breaking Changes**: Version 7 introduces significant architectural changes to the Docker setup. **You must update your docker-compose configuration** when upgrading from v6 to v7. Simply changing the image tag will not work.

### Major Changes in Version 7

Version 7 marks a fundamental shift in Lychee's Docker architecture:

1. **FrankenPHP replaces nginx + PHP-FPM**: The application now runs on FrankenPHP with Laravel Octane for dramatically improved performance
2. **Simplified volume mounts**: Individual directory mounts have been consolidated into cleaner volume structures
3. **Optional worker service**: Background job processing can now be scaled independently
4. **New environment variables**: Worker mode configuration requires specific settings

Do note that this change also has consequences in the way Lychee reads your `.env`
file. Updating values in the `.env` file will now require a container restart to take effect.

### Volume Mount Changes

#### Version 6 Volume Structure (OLD)
```yaml
volumes:
  - ./lychee/conf:/conf
  - ./lychee/uploads:/uploads
  - ./lychee/sym:/sym
  - ./lychee/logs:/logs
  - ./lychee/tmp:/lychee-tmp
```

#### Version 7 Volume Structure (NEW)
```yaml
volumes:
  - ./lychee/uploads:/app/public/uploads
  - ./lychee/storage/app:/app/storage/app
  - ./lychee/logs:/app/storage/logs
  - ./lychee/tmp:/app/storage/tmp  # so that uploads are not filling up the memory of the container
  - ./lychee/conf/.env:/app/.env:ro
  - ./conf/user.css:/app/public/dist/user.css # optional
  - ./conf/custom.js:/app/public/dist/custom.js # optional
```

> {note} Notice the key changes: uploads are now at `/app/public/uploads`, storage at `/app/storage/app`, tmp at `/app/storage/tmp`, and the `.env` file is mounted read-only.

### Service Architecture Changes

Version 7 introduces a multi-service architecture with an optional worker service for background job processing.

#### Basic Setup (Single Service)

For basic installations without background workers:

```yaml
services:
  lychee_api:
    image: ghcr.io/lycheeorg/lychee:edge
    container_name: lychee
    ports:
      - "${APP_PORT:-8000}:8000"
    volumes:
      - ./lychee/uploads:/app/public/uploads
      - ./lychee/storage/app:/app/storage/app
      - ./lychee/logs:/app/storage/logs
      - ./lychee/tmp:/app/storage/tmp
      - .env:/app/.env:ro
    environment:
      - DB_CONNECTION=mysql
      - DB_HOST=lychee_db
      - DB_PORT=3306
      - DB_DATABASE=lychee
      - DB_USERNAME=lychee
      - DB_PASSWORD=your_password
      # ... other environment variables
    depends_on:
      - lychee_db
    networks:
      - lychee
```

#### Advanced Setup (With Workers)

For better performance with background job processing:

```yaml
services:
  lychee_api:
    image: ghcr.io/lycheeorg/lychee:edge
    container_name: lychee
    ports:
      - "${APP_PORT:-8000}:8000"
    volumes:
      - ./lychee/uploads:/app/public/uploads
      - ./lychee/storage/app:/app/storage/app
      - ./lychee/logs:/app/storage/logs
      - ./lychee/tmp:/app/storage/tmp
      - .env:/app/.env:ro
    environment:
      - DB_CONNECTION=mysql
      - DB_HOST=lychee_db
      - QUEUE_CONNECTION=database  # CRITICAL for worker mode
      # ... other environment variables
    depends_on:
      - lychee_db
    networks:
      - lychee

  lychee_worker:
    image: ghcr.io/lycheeorg/lychee:edge
    container_name: lychee_worker
    volumes:
      - ./lychee/uploads:/app/public/uploads
      - ./lychee/storage/app:/app/storage/app
      - ./lychee/logs:/app/storage/logs
      - ./lychee/tmp:/app/storage/tmp
      - .env:/app/.env:ro
    environment:
      - LYCHEE_MODE=worker  # CRITICAL: Tells container to run in worker mode
      - DB_CONNECTION=mysql
      - DB_HOST=lychee_db
      - DB_PORT=3306
      - DB_DATABASE=lychee
      - DB_USERNAME=lychee
      - DB_PASSWORD=your_password
      - QUEUE_CONNECTION=database  # CRITICAL: Must match API service
      # ... other environment variables
    depends_on:
      - lychee_db
      - lychee_api
    networks:
      - lychee
```

> {note} **Critical**: When using worker services, you **must** set `QUEUE_CONNECTION=database` (or `redis` if using Redis) in **both** the API and worker services. Without this, jobs will not be processed properly.

### Worker Service Benefits

The worker service provides several advantages:

- **Parallel Processing**: Scale workers independently by running multiple instances
- **Better Performance**: Offload heavy tasks (photo processing, imports) from the main API
- **Resource Management**: Allocate different resources to API and workers

#### Scaling Workers

You can run multiple worker instances for parallel processing:

```yaml
lychee_worker:
  image: ghcr.io/lycheeorg/lychee:edge
  deploy:
    replicas: 3  # Run 3 worker instances
  # ... rest of configuration
```

Or manually with different container names:

```yaml
lychee_worker_1:
  image: ghcr.io/lycheeorg/lychee:edge
  container_name: lychee_worker_1
  environment:
    - LYCHEE_MODE=worker
    # ... rest of configuration

lychee_worker_2:
  image: ghcr.io/lycheeorg/lychee:edge
  container_name: lychee_worker_2
  environment:
    - LYCHEE_MODE=worker
    # ... rest of configuration
```

### Migration Steps

Follow these steps to migrate from v6 to v7:

#### 1. **Backup Everything**

```bash
# Backup your database
docker exec lychee_db mysqldump -u lychee -p lychee > lychee_backup.sql

# Backup your uploads and configuration
cp -r ./lychee ./lychee_backup
```

#### 2. **Stop Your Current v6 Services**

```bash
docker-compose down
```

#### 3. **Update Your docker-compose.yml**

Replace your v6 docker-compose.yml with the v7 configuration. You can find the complete example at: [https://github.com/LycheeOrg/Lychee/blob/master/docker-compose.yaml](https://github.com/LycheeOrg/Lychee/blob/master/docker-compose.yaml)

#### 4. **Reorganize Your Volume Data** (if needed)

If your current directory structure doesn't match the new volume mounts, reorganize:
  
```bash
# The uploads directory structure should remain compatible
# Ensure your uploads are in ./lychee/uploads/
```

#### 5. **Update Environment Variables**

Key changes to your environment configuration:
- If using workers: Add `QUEUE_CONNECTION=database` or `QUEUE_CONNECTION=redis`
- If using workers: Add `LYCHEE_MODE=worker` to worker service only
- Review other environment variables for any deprecated options

#### 6. **Start v7 Services**
```bash
docker-compose up -d
```

#### 7. **Run Migrations**
```bash
docker exec lychee php artisan migrate
```

#### 8. **Verify Installation**

Check that all services are running:
```bash
docker-compose ps
```

Check logs for errors:
```bash
docker-compose logs -f lychee
```

### Troubleshooting

**Workers not processing jobs**
- Verify `QUEUE_CONNECTION=database` is set in both API and worker services
- Verify `LYCHEE_MODE=worker` is set in worker service
- Check worker logs: `docker-compose logs -f lychee_worker`

**Upload issues**
- Verify volume mounts point to the correct paths
- Check file permissions on host directories
- Ensure uploads directory: `./lychee/uploads` exists and is writable

**Performance issues**
- Consider adding worker services for background processing
- Check FrankenPHP is running (should see FrankenPHP in logs, not nginx)
- Verify `QUEUE_CONNECTION` is set for async job processing

**Database connection errors**
- Ensure database service name matches `DB_HOST` value
- Verify database credentials are correct
- Check database service is healthy: `docker-compose ps lychee_db`

For more help, visit our [GitHub Discussions](https://github.com/LycheeOrg/Lychee/discussions) or [Discord server](https://discord.gg/y4aUbnF).


## Upgrading from Lychee v3 to v4

### Checking requirements

Check that the server satisfies the [requirements](installation.html#web-server-configuration). In particular pay attention the PHP extensions.
You can display installed PHP extensions using `phpinfo()`.

### Preparing the files

Assuming the following tree:
```
/var/
  |- www/
         |- html/
              |- Lychee/
              |- <you are here>
```

Rename Lychee into Lychee-v3:
```bash
mv Lychee Lychee-v3
```

Install Lychee files by either uploading the content of the released zip or cloning the repository:
```bash
git clone https://github.com/LycheeOrg/Lychee Lychee
```

Move the pictures from the version 3 to the newly created installation:
```bash
mv Lychee-v3/uploads/big/* Lychee/public/uploads/big/
mv Lychee-v3/uploads/medium/* Lychee/public/uploads/medium/
mv Lychee-v3/uploads/small/* Lychee/public/uploads/small/
mv Lychee-v3/uploads/thumb/* Lychee/public/uploads/thumb/
```

### Preparing the server

> {note} The big difference between Lychee version 3 and Lychee version 4 is the served directory, i.e. where you webserver needs to point to.

- In the version 3, this was the root `.` of Lychee.
- In the version 4, this is the `public` directory inside Lychee.

#### Using Apache

**Make sure you have the module rewrite available and enabled: `a2enmod rewrite`**.

Modify your `/etc/apache2/apache2.conf` to allow `.htaccess` to set up the rewrite rules:
```apacheconf
<Directory /var/www/html/Lychee>
	Options Indexes FollowSymLinks
	AllowOverride All
	Require all granted
</Directory>
```

Modify or create `example.com.conf` in `/etc/apache2/sites-available/` to point out the served directory:
```apacheconf
<VirtualHost *:80>
	ServerName example.com

	DocumentRoot /var/www/html/Lychee/public

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

Enable the site:
```bash
a2ensite `example.com.conf`
```

Restart apache2:
```bash
systemctl restart apache2
```

#### Using Nginx

If you are using Nginx, an example configuration can be found [here](installation.html#web-server-configuration).

#### Run the migrations

Make sure you have `DB_OLD_LYCHEE_PREFIX` set in your `.env` to correspond the table prefix of your old database, then run `php artisan migrate`.
