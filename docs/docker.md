## Docker Installation

### Overview

The recommended way to install Lychee is via Docker using the official image at `ghcr.io/lycheeorg/lychee`. The Docker image provides a complete, production-ready deployment with all dependencies included.

As of Version 7, the default Docker image uses **FrankenPHP with Laravel Octane** instead of the traditional nginx + PHP-FPM stack. This modern architecture delivers dramatic performance improvements:
- Boot time reduced from 40-60ms to 4-6ms per request
- 3-4x better throughput
- Significantly reduced latency
- Framework components kept in memory and reused across requests

### Available Tags

The following tags are available:

* `latest`: Latest stable Lychee release using FrankenPHP
* `v[NUMBER]`: Specific stable version (e.g., `v7.0.0`) using FrankenPHP
* `edge`: Current development/bleeding edge builds using FrankenPHP
* `legacy`: Latest release using nginx + PHP-FPM (deprecated)
* `v[NUMBER]-legacy`: Specific stable version using nginx + PHP-FPM (deprecated)

**Recommendation:** Use `latest` or specific version tags for production deployments.

## Quick Start

### Basic Setup with SQLite

For the simplest setup using the built-in SQLite support:

```bash
docker run -d \
  --name=lychee \
  -p 8000:8000 \
  -v ./lychee/uploads:/app/public/uploads \
  -v ./lychee/database:/app/database/database.sqlite \
  -v ./lychee/storage/app:/app/storage/app \
  ghcr.io/lycheeorg/lychee:latest
```

Then visit `http://localhost:8000` to complete the installation.

### Docker Compose (Recommended)

The recommended way to deploy Lychee is with Docker Compose. Use the official template as a starting point:

[https://github.com/LycheeOrg/Lychee/blob/master/docker-compose.yaml](https://github.com/LycheeOrg/Lychee/blob/master/docker-compose.yaml)

Basic example with MySQL database:

```yaml
version: '3'

services:
  lychee_db:
    image: mariadb:11
    container_name: lychee_db
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=lychee
      - MYSQL_USER=lychee
      - MYSQL_PASSWORD=lychee
    volumes:
      - ./lychee/mysql:/var/lib/mysql
    networks:
      - lychee

  lychee:
    image: ghcr.io/lycheeorg/lychee:latest
    container_name: lychee
    ports:
      - "8000:8000"
    volumes:
      - ./lychee/uploads:/app/public/uploads
      - ./lychee/storage/app:/app/storage/app
      - ./lychee/logs:/app/storage/logs
      - ./lychee/tmp:/app/storage/tmp
      - ./lychee/conf/.env:/app/.env:ro
    environment:
      - DB_CONNECTION=mysql
      - DB_HOST=lychee_db
      - DB_PORT=3306
      - DB_DATABASE=lychee
      - DB_USERNAME=lychee
      - DB_PASSWORD=lychee
      - TIMEZONE=America/New_York
    depends_on:
      - lychee_db
    networks:
      - lychee

networks:
  lychee:
```

Start the services:

```bash
docker-compose up -d
```

## Volume Mounts

### Version 7+ (FrankenPHP)

The current volume structure for Version 7 and later:

```yaml
volumes:
  - ./lychee/uploads:/app/public/uploads           # Photo storage
  - ./lychee/storage/app:/app/storage/app          # Application storage
  - ./lychee/logs:/app/storage/logs                # Log files
  - ./lychee/tmp:/app/storage/tmp                  # Temporary files
  - ./lychee/conf/.env:/app/.env:ro                # Environment config (read-only)
  - ./conf/user.css:/app/public/dist/user.css      # Optional: Custom CSS
  - ./conf/custom.js:/app/public/dist/custom.js    # Optional: Custom JavaScript
```

### Legacy (nginx + PHP-FPM)

If using the legacy image:

```yaml
volumes:
  - ./lychee/conf:/conf       # Configuration
  - ./lychee/uploads:/uploads # Photo storage
  - ./lychee/sym:/sym         # Symbolic links
  - ./lychee/logs:/logs       # Log files
  - ./lychee/tmp:/lychee-tmp  # Temporary files
```

**Important:** If you're upgrading from Version 6 to Version 7, you must update your volume mounts. See the [upgrade documentation](upgrade.html) for migration steps.

## Environment Variables

### Database Configuration

Configure your database connection:

```yaml
environment:
  - DB_CONNECTION=mysql           # mysql, pgsql, or sqlite
  - DB_HOST=lychee_db            # Database hostname
  - DB_PORT=3306                 # Database port
  - DB_DATABASE=lychee           # Database name
  - DB_USERNAME=lychee           # Database username
  - DB_PASSWORD=lychee           # Database password
```

### Basic Configuration

Common environment variables:

```yaml
environment:
  - APP_URL=http://localhost:8000  # Your public URL
  - APP_DEBUG=false                # Enable debug mode (development only)
  - TIMEZONE=UTC                   # Server timezone
  - LOG_CHANNEL=stack              # Logging channel
```

### Docker-Specific Variables (Legacy Image)

These variables are specific to the legacy nginx + PHP-FPM image:

```yaml
environment:
  - PUID=1000          # User ID for file permissions
  - PGID=1000          # Group ID for file permissions
  - USER=lychee        # Username
  - PHP_TZ=UTC         # PHP timezone
  - STARTUP_DELAY=0    # Delay before starting services
```

## Advanced Features

### Worker Mode for Horizontal Scaling (Recommended)

Version 7 introduces worker mode for processing background jobs independently. This enables horizontal scaling for improved performance with large photo uploads and processing tasks.

#### Basic Setup (Without Workers)

The basic single-service setup handles both web requests and background jobs.
However, the requests are limited to 30s by default, which may not be sufficient for large uploads or processing.

```yaml
services:
  lychee:
    image: ghcr.io/lycheeorg/lychee:latest
    # ... volumes, environment, etc.
```

#### Advanced Setup (With Workers)

For better performance, run dedicated worker services:

```yaml
services:
  lychee_api:
    image: ghcr.io/lycheeorg/lychee:latest
    container_name: lychee
    ports:
      - "8000:8000"
    volumes:
      - ./lychee/uploads:/app/public/uploads
      - ./lychee/storage/app:/app/storage/app
      - ./lychee/logs:/app/storage/logs
      - ./lychee/tmp:/app/storage/tmp
      - ./lychee/conf/.env:/app/.env:ro
    environment:
      - DB_CONNECTION=mysql
      - DB_HOST=lychee_db
      - QUEUE_CONNECTION=database  # CRITICAL: Enable queue processing
      # ... other environment variables
    depends_on:
      - lychee_db
    networks:
      - lychee

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
      - LYCHEE_MODE=worker         # CRITICAL: Run in worker mode
      - DB_CONNECTION=mysql
      - DB_HOST=lychee_db
      - DB_PORT=3306
      - DB_DATABASE=lychee
      - DB_USERNAME=lychee
      - DB_PASSWORD=lychee
      - QUEUE_CONNECTION=database  # CRITICAL: Must match API service
      # ... other environment variables
    depends_on:
      - lychee_db
      - lychee_api
    networks:
      - lychee
```

**Critical Requirements for Worker Mode:**
1. Set `QUEUE_CONNECTION=database` (or `redis`) in **both** API and worker services
2. Set `LYCHEE_MODE=worker` in worker service only
3. Ensure both services share the same database and volume mounts

#### Scaling Workers

Run multiple worker instances for parallel processing:

**Option 1: Using replicas (Docker Swarm/Compose v3)**

```yaml
lychee_worker:
  image: ghcr.io/lycheeorg/lychee:latest
  deploy:
    replicas: 3  # Run 3 worker instances
  # ... rest of configuration
```

**Option 2: Multiple named services**

```yaml
lychee_worker_1:
  image: ghcr.io/lycheeorg/lychee:latest
  container_name: lychee_worker_1
  environment:
    - LYCHEE_MODE=worker
  # ... rest of configuration

lychee_worker_2:
  image: ghcr.io/lycheeorg/lychee:latest
  container_name: lychee_worker_2
  environment:
    - LYCHEE_MODE=worker
  # ... rest of configuration
```

### Docker Secrets [TODO DOUBLE CHECK]

For sensitive information, use Docker secrets instead of environment variables:

```yaml
services:
  lychee:
    image: ghcr.io/lycheeorg/lychee:latest
    environment:
      - DB_PASSWORD_FILE=/run/secrets/db_password
      - REDIS_PASSWORD_FILE=/run/secrets/redis_password
      - MAIL_PASSWORD_FILE=/run/secrets/mail_password
      - ADMIN_PASSWORD_FILE=/run/secrets/admin_password
    secrets:
      - db_password
      - redis_password
      - mail_password
      - admin_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
  redis_password:
    file: ./secrets/redis_password.txt
  mail_password:
    file: ./secrets/mail_password.txt
  admin_password:
    file: ./secrets/admin_password.txt
```

Supported `_FILE` variables:
- `DB_PASSWORD_FILE`
- `REDIS_PASSWORD_FILE`
- `MAIL_PASSWORD_FILE`
- `ADMIN_PASSWORD_FILE`

## Configuration Management

### Environment File (.env)

**Important:** Due to the FrankenPHP architecture, the `.env` file is read once at container startup and kept in memory. Any changes to the `.env` file require a container restart to take effect:

```bash
docker-compose restart lychee
```

### Configuration Priority

Configuration values are applied in this order (highest to lowest priority):
1. Environment variables passed via `docker-compose.yml` or `docker run`
2. Values in mounted `.env` file
3. Default values from `.env.example`

**Note:** When restarting containers, environment variables from docker-compose will override values in the mounted `.env` file. Modify configuration in your docker-compose file rather than editing files inside the container.

## Upgrading

### From Version 6 to Version 7

Version 7 introduces breaking changes to the Docker setup. **You must update your docker-compose configuration** when upgrading from v6 to v7. Simply changing the image tag will not work.

See the detailed [upgrade documentation](upgrade.html#upgrading-lychee-docker-installations-from-v6-to-v7) for complete migration instructions, including:
- Volume mount changes
- Service architecture updates
- Environment variable changes
- Worker mode configuration

### General Upgrade Process

For routine updates:

1. **Backup your data:**
   ```bash
   # Backup database
   docker exec lychee_db mysqldump -u lychee -p lychee > lychee_backup.sql

   # Backup uploads
   cp -r ./lychee ./lychee_backup
   ```

2. **Pull the latest image:**
   ```bash
   docker-compose pull
   ```

3. **Restart services:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

4. **Run migrations:**
   ```bash
   docker exec lychee php artisan migrate
   ```

## Troubleshooting

### Check Service Status

```bash
docker-compose ps
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f lychee

# Worker logs
docker-compose logs -f lychee_worker
```

### Common Issues

**Workers not processing jobs:**
- Verify `QUEUE_CONNECTION=database` is set in both API and worker services
- Verify `LYCHEE_MODE=worker` is set in worker service
- Check worker logs: `docker-compose logs -f lychee_worker`

**Upload issues:**
- Verify volume mounts point to correct paths
- Check file permissions on host directories
- Ensure uploads directory exists and is writable

**Performance issues:**
- Consider adding worker services for background processing
- Verify FrankenPHP is running (check logs for FrankenPHP, not nginx)
- Ensure `QUEUE_CONNECTION` is set for async job processing

**Database connection errors:**
- Ensure database service name matches `DB_HOST` value
- Verify database credentials are correct
- Check database service is healthy: `docker-compose ps lychee_db`

**Configuration changes not applying:**
- Remember to restart container after `.env` changes: `docker-compose restart lychee`
- Verify environment variables in docker-compose.yml take precedence over `.env` file

### Getting Help

For additional support:
- [GitHub Discussions](https://github.com/LycheeOrg/Lychee/discussions)
- [Discord Server](https://discord.gg/y4aUbnF)
- [FAQ](faq_troubleshooting.html)

## Performance Optimization

### Recommended Setup for Large Galleries

For galleries with thousands of photos:

1. **Use worker services** for background processing
2. **Scale workers** based on your hardware (2-4 workers recommended)
3. **Use Redis** for queue backend instead of database:
   ```yaml
   environment:
     - QUEUE_CONNECTION=redis
     - REDIS_HOST=redis
     - REDIS_PORT=6379
   ```
4. **Allocate sufficient resources** in docker-compose:
   ```yaml
   deploy:
     resources:
       limits:
         memory: 2G
       reservations:
         memory: 1G
   ```

### FrankenPHP Benefits

The FrankenPHP-powered Version 7 image provides significant performance improvements over Version 6:

- **Faster boot times:** 4-6ms vs 40-60ms per request
- **Better throughput:** 3-4x improvement in requests per second
- **Lower latency:** Reduced response times across all operations
- **Memory efficiency:** Framework components kept in memory and reused

These improvements are automatic when using Version 7 - no additional configuration required.

## Security Considerations

1. **Use Docker secrets** for sensitive credentials in production
2. **Mount `.env` as read-only** (`:ro`) to prevent modifications
3. **Use strong passwords** for database and admin accounts
4. **Keep images updated** to receive security patches
5. **Run behind a reverse proxy** (nginx, Traefik, Caddy) with TLS
6. **Restrict network access** using Docker networks
7. **Use specific version tags** instead of `latest` in production for reproducible deployments

## Example: Complete Production Setup

A complete production-ready setup with MySQL, Redis, workers, and TLS:

```yaml
version: '3.8'

services:
  lychee_db:
    image: mariadb:11
    container_name: lychee_db
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD_FILE=/run/secrets/mysql_root_password
      - MYSQL_DATABASE=lychee
      - MYSQL_USER=lychee
      - MYSQL_PASSWORD_FILE=/run/secrets/mysql_password
    volumes:
      - ./lychee/mysql:/var/lib/mysql
    networks:
      - lychee
    secrets:
      - mysql_root_password
      - mysql_password

  redis:
    image: redis:7-alpine
    container_name: lychee_redis
    restart: unless-stopped
    networks:
      - lychee

  lychee_api:
    image: ghcr.io/lycheeorg/lychee:latest
    container_name: lychee
    restart: unless-stopped
    ports:
      - "127.0.0.1:8000:8000"
    volumes:
      - ./lychee/uploads:/app/public/uploads
      - ./lychee/storage/app:/app/storage/app
      - ./lychee/logs:/app/storage/logs
      - ./lychee/tmp:/app/storage/tmp
      - ./lychee/conf/.env:/app/.env:ro
    environment:
      - APP_URL=https://photos.example.com
      - DB_CONNECTION=mysql
      - DB_HOST=lychee_db
      - DB_PORT=3306
      - DB_DATABASE=lychee
      - DB_USERNAME=lychee
      - DB_PASSWORD_FILE=/run/secrets/mysql_password
      - QUEUE_CONNECTION=redis
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - TIMEZONE=America/New_York
    depends_on:
      - lychee_db
      - redis
    networks:
      - lychee
    secrets:
      - mysql_password

  lychee_worker:
    image: ghcr.io/lycheeorg/lychee:latest
    container_name: lychee_worker
    restart: unless-stopped
    deploy:
      replicas: 2
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
      - DB_PASSWORD_FILE=/run/secrets/mysql_password
      - QUEUE_CONNECTION=redis
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - TIMEZONE=America/New_York
    depends_on:
      - lychee_db
      - redis
      - lychee_api
    networks:
      - lychee
    secrets:
      - mysql_password

networks:
  lychee:

secrets:
  mysql_root_password:
    file: ./secrets/mysql_root_password.txt
  mysql_password:
    file: ./secrets/mysql_password.txt
```

Run behind a reverse proxy (nginx, Traefik, or Caddy) to handle TLS termination and expose the service on port 443.
