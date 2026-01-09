

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

### Port change

Version 7 uses FrankenPHP which listens on port `8000` instead of the previous `80` used by nginx. Make sure to update your port mappings accordingly in your `docker-compose.yml`.

### Volume Mount Changes

In order to avoid you running into issues while booting version 7, we are blocking the startup of the container if the old volume structure is detected.

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
  - ./lychee/logs:/app/storage/logs
  - ./lychee/tmp:/app/storage/tmp  # so that uploads are not filling up the memory of the container
  - ./lychee/conf/.env:/app/.env # OPTIONAL, you can manage your .env directly as variables in docker-compose.yml 
  - ./lychee/storage/app:/app/storage/app # OPTIONAL: for persistent storage of app data
  - ./conf/user.css:/app/public/dist/user.css # OPTIONAL
  - ./conf/custom.js:/app/public/dist/custom.js # OPTIONAL
```

> {note} Notice the key changes: uploads are now at `/app/public/uploads`, logs at `/app/storage/logs`, tmp at `/app/storage/tmp`, and the `.env` file.

The `/sym` volume has been removed as Lychee no longer uses symbolic links for storage. This was a security feature that originated from version 4, but is no longer necessary as the functionality has been removed.

**Important:** With multiple volumes under `/app/storage`, you may think you could simplify the configuration by specifying one single volume for `/app/storage` instead. This is incorrect. Doing so will make the app exit with the error "The `/app/bootstrap/cache` directory must be present and writable."

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

#### 7. **Verify Installation**

Check that all services are running:
```bash
docker-compose ps
```

Check logs for errors:
```bash
docker-compose logs -f lychee
```

#### 8. **Fix the thumbnails**

You will notice that after the upgrade, thumbnails are missing. You can regenerate them by running:
```bash
docker exec -it lychee php artisan lychee:recompute-album-sizes
docker exec -it lychee php artisan lychee:recompute-album-stats
```

or by logging into the web interface and going to Settings &rArr; Maintenance &rArr; Album Precomputed Fields.


### Troubleshooting

**Container keeps restarting**

- Verify that you have APP_KEY properly set in your `.env` or `docker-compose.yml` if that is not the case you can run `echo "APP_KEY=base64:$(openssl rand -base64 32)"` to create a new one.

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


## Migrating from Traditional Installation to Docker Compose

This guide helps you migrate an existing Lychee installation from a traditional setup (e.g., `/var/www/html/Lychee`) to a Docker Compose deployment.

### Prerequisites

Before starting the migration, make sure you have docker compose installed. You can follow the instructions [here](https://docs.docker.com/compose/install/).

### Migration Steps

#### 1. **Backup Your Current Installation**

> {note} **Critical**: Always create backups before migrating. This ensures you can restore your installation if anything goes wrong.

```bash
# Backup the database
mysqldump -u your_db_user -p your_db_name > ~/lychee_db_backup.sql

# Backup the entire Lychee directory
cp -r /var/www/html/Lychee ~/lychee_backup

# Backup your .env file specifically
cp /var/www/html/Lychee/.env ~/lychee_env_backup
```

#### 2. **Create Docker Compose Directory Structure**

Create a directory for your Docker Compose setup:

```bash
mkdir -p ~/lychee-docker
cd ~/lychee-docker

# Create directories for volume mounts
mkdir -p lychee/uploads
mkdir -p lychee/storage/app
mkdir -p lychee/logs
mkdir -p lychee/tmp
mkdir -p lychee/conf
```

#### 3. **Copy Your Data**

Move your existing uploads and configuration:

```bash
# Copy uploads (this may take time depending on your photo library size)
sudo cp -r /var/www/html/Lychee/public/uploads/* ~/lychee-docker/lychee/uploads/

# Copy your .env configuration
sudo cp /var/www/html/Lychee/.env ~/lychee-docker/lychee/conf/.env

# If you have custom CSS or JavaScript
sudo cp /var/www/html/Lychee/public/dist/user.css ~/lychee-docker/conf/user.css 2>/dev/null || true
sudo cp /var/www/html/Lychee/public/dist/custom.js ~/lychee-docker/conf/custom.js 2>/dev/null || true

# Set appropriate permissions
sudo chown -R $USER:$USER ~/lychee-docker/lychee
chmod -R 755 ~/lychee-docker/lychee
```

#### 4. **Create docker-compose.yml**

Create a `docker-compose.yml` file in `~/lychee-docker`:

```yaml
services:
  lychee_db:
    image: mariadb:11
    container_name: lychee_db
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=lychee
      - MYSQL_USER=lychee
      - MYSQL_PASSWORD=lychee_password
    volumes:
      - ./lychee/lychee_db:/var/lib/mysql
    networks:
      - lychee
    restart: unless-stopped

  lychee_api:
    image: ghcr.io/lycheeorg/lychee:latest
    container_name: lychee
    ports:
      - "8000:8000"  # Change the first part XXXX:8000 this to your preferred port
    env_file:
      - ./lychee/conf/.env
    volumes:
      - ./lychee/uploads:/app/public/uploads
      - ./lychee/storage/app:/app/storage/app
      - ./lychee/logs:/app/storage/logs
      - ./lychee/tmp:/app/storage/tmp
      - ./lychee/conf/.env:/app/.env
      # Optional: Uncomment if you have custom CSS/JS
      # - ./conf/user.css:/app/public/dist/user.css
      # - ./conf/custom.js:/app/public/dist/custom.js
    environment:
      - DB_CONNECTION=mysql
      - DB_HOST=lychee_db
      - DB_PORT=3306
      - DB_DATABASE=lychee
      - DB_USERNAME=lychee
      - DB_PASSWORD=lychee_password
    depends_on:
      - lychee_db
    networks:
      - lychee
    restart: unless-stopped

networks:
  lychee:
```

#### 6. **Update Your .env File**

Edit `~/lychee-docker/lychee/conf/.env` to update database connection settings:

```bash
# Update these values to match your docker-compose.yml
DB_CONNECTION=mysql
DB_HOST=lychee_db
DB_PORT=3306
DB_DATABASE=lychee
DB_USERNAME=lychee
DB_PASSWORD=lychee_password

# Set the application URL
APP_URL=http://your-domain.com:8000  # Update with your domain/IP
```

#### 7. **Import Your Database**

Start the database container and import your data:

```bash
cd ~/lychee-docker

# Start only the database service
docker-compose up -d lychee_db

# Wait for the database to be ready (about 10-20 seconds)
sleep 20

# Import your database backup
docker exec -i lychee_db mysql -u lychee -plychee_password lychee < ~/lychee_db_backup.sql
```

#### 8. **Start Lychee**

```bash
# Start all services
docker-compose up -d

# Check logs to ensure everything started correctly
docker-compose logs -f lychee
```

Press `Ctrl+C` to exit log viewing.

#### 9. **Configure Reverse Proxy (Optional)**

If you're using a reverse proxy (recommended for production), configure it to forward to the Docker container.

**Nginx Example:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # For large photo uploads
        client_max_body_size 100M;
    }
}
```

**Apache Example:**

```apacheconf
<VirtualHost *:80>
    ServerName your-domain.com

    ProxyPreserveHost On
    ProxyPass / http://localhost:8000/
    ProxyPassReverse / http://localhost:8000/

    # For large photo uploads
    LimitRequestBody 104857600
</VirtualHost>
```

Enable required modules and restart:
```bash
# For Apache
sudo a2enmod proxy proxy_http
sudo systemctl restart apache2

# For Nginx
sudo systemctl restart nginx
```

#### 10. **Verify Migration**

1. Access Lychee at `http://your-domain.com` (or `http://your-domain.com:8000` if not using reverse proxy)
2. Log in with your existing credentials
3. Verify your photos and albums are displayed correctly
4. Check Settings &rArr; Diagnostics to ensure everything is working

#### 11. **Optional: Add Worker Service**

For better performance with large photo libraries, consider adding a worker service:

```yaml
  lychee_worker:
    image: ghcr.io/lycheeorg/lychee:latest
    container_name: lychee_worker
    volumes:
      - ./lychee/uploads:/app/public/uploads
      - ./lychee/storage/app:/app/storage/app
      - ./lychee/logs:/app/storage/logs
      - ./lychee/tmp:/app/storage/tmp
      - ./lychee/conf/.env:/app/.env:ro
    environment:
      - LYCHEE_MODE=worker
      - DB_CONNECTION=mysql
      - DB_HOST=lychee_db
      - DB_PORT=3306
      - DB_DATABASE=lychee
      - DB_USERNAME=lychee
      - DB_PASSWORD=lychee_password
      - QUEUE_CONNECTION=database
    depends_on:
      - lychee_db
      - lychee_api
    networks:
      - lychee
    restart: unless-stopped
```

Also add `QUEUE_CONNECTION=database` to the `lychee_api` service environment variables, then restart:

```bash
docker-compose up -d
```

### Post-Migration Cleanup

After confirming everything works correctly:

```bash
# Disable the old web server from starting on boot
sudo systemctl disable apache2  # or nginx

# You can remove the old installation (keep the backup!)
# sudo rm -rf /var/www/html/Lychee  # Only after thorough testing!
```

### Troubleshooting

**Cannot access Lychee**
- Check if containers are running: `docker ps`
- Check logs: `docker logs lychee`
- Verify port 8000 is not blocked by firewall
- If using reverse proxy, check proxy configuration

**Photos not showing**
- Verify uploads were copied correctly: `ls -la ~/lychee-docker/lychee/uploads/`
- Check volume mount permissions
- Verify file paths in database match new structure

**Database connection errors**
- Confirm database container is running: `docker ps lychee_db`
- Verify credentials in `.env` match `docker-compose.yml`
- Check database logs: `docker logs lychee_db`

**Permission errors**
- Fix ownership: `sudo chown -R 33:33 ~/lychee-docker/lychee/` (33 is www-data UID/GID but can also be 82 for alpine)
- Or make directories writable: `chmod -R 777 ~/lychee-docker/lychee/` (less secure)

For additional help, visit our [GitHub Discussions](https://github.com/LycheeOrg/Lychee/discussions) or [Discord server](https://discord.gg/y4aUbnF).


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
