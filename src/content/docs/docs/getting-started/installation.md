---
title: "Installation"
description: "Get Lychee up and running in minutes with Docker."
sidebar:
  order: 1
---

The fastest way to get Lychee running is with **Docker Compose**. A single command gets you a fully working gallery with a database, ready to use.

## Quick Start

Download the minimal compose file and start Lychee:

```bash
curl -O https://raw.githubusercontent.com/LycheeOrg/Lychee/master/docker-compose.minimal.yaml
docker compose -f docker-compose.minimal.yaml up -d
```

Lychee is now running at [http://localhost:8000](http://localhost:8000).

On first visit, you will be prompted to create an admin account.

:::tip
For a more complete setup with custom volumes, environment variables, and worker services, see the [Docker documentation](/docs/getting-started/docker/).
:::

## What's Included

The minimal compose file sets up:

- **Lychee** with FrankenPHP (the modern, high-performance runtime)
- **MariaDB** as the database
- Persistent storage for your photos and database

## Next Steps

Once Lychee is running:

1. **Create your admin account** on first visit
2. **Upload your first photos** via the web interface
3. **Configure your instance** — see [Configuration](/docs/getting-started/configuration/) and [Settings](/docs/getting-started/settings/)

For production deployments, you should:

- Set a proper `APP_URL` and `APP_KEY` — see [Configuration](/docs/getting-started/configuration/)
- Put Lychee behind a reverse proxy with TLS (nginx, Traefik, or Caddy)
- Use the [full Docker Compose template](https://github.com/LycheeOrg/Lychee/blob/master/docker-compose.yaml) with workers for better performance

## Alternative: Manual Installation

If you cannot use Docker, Lychee can be installed manually on a server with PHP, a web server, and a database. See the [Manual Installation](/docs/getting-started/manual-installation/) guide.
