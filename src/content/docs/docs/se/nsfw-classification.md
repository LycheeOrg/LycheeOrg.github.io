---
title: NSFW Classification
description: Automatically detect and moderate sensitive content in uploaded photos.
sidebar:
  order: 10
  badge:
    text: v8
    variant: note
---

:::note
NSFW Classification is part of Lychee v8 and is **disabled by default** while it matures. Like [Facial Recognition](/docs/features/facial-recognition/), it requires a separate microservice — it does not run inside the main Lychee application.
:::

Lychee can automatically scan uploaded photos for explicit content and react based on how much you trust the uploader: silently hard-delete it, hold it for admin review, mark the containing album as sensitive, or just log the finding and let it through. Detection runs in a dedicated [Lychee-NSFW-Classification](https://github.com/LycheeOrg/Lychee-NSFW-Classification) microservice using [NudeNet](https://github.com/notAI-tech/NudeNet), kept separate from the main PHP application.

## License: AGPL-3.0, not MIT

:::caution
Unlike every other LycheeOrg repository (MIT licensed), the **Lychee-NSFW-Classification service is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0)**. This is because it depends on NudeNet, which is itself AGPL-3.0, and that copyleft license requires anything linking to or distributing it to adopt the same terms. This only affects the standalone classification microservice — the main Lychee application remains MIT licensed.
:::

## How it works

1. When a photo is uploaded (or rescanned), Lychee sends the photo to the NSFW classification service.
2. NudeNet inference runs in the background and the service classifies any findings into three independent tiers:
   - **Block** — hide or delete the photo.
   - **Review** — send the photo for human moderation.
   - **Sensitive** — keep the photo visible, but mark its album(s) as sensitive.
3. A photo can match more than one tier at once (e.g. both block and sensitive), and what actually happens depends on the uploader's trust level — see below.

## Trust level × finding matrix

Lychee already assigns each user an [upload trust level](/docs/usage/users/) (`check`, `monitor`, `trust_but_verify`, `trusted`). NSFW outcomes are decided per trust level, mostly via [Settings](#settings):

| Trust level | Block finding | Review finding | Sensitive finding |
|------------------|----------------------------------------------------------------------------|----------------------------------|----------------------------------------------------------|
| Check            | Configurable, default **block** (the photo is hard-deleted)               | Always held for review           | Held for review (album action deferred to approval)      |
| Monitor          | Configurable, default **moderate** (held for admin review)                | Always held for review           | Configurable (default: mark the album(s) as sensitive)    |
| Trust-but-verify | Configurable, default **moderate**                                        | Auto-approved                    | Configurable (default: mark the album(s) as sensitive)    |
| Trusted          | Configurable, default **approve** (logged only — and only scanned at all if `ai_vision_nsfw_scan_trusted_users` is on) | Auto-approved | Configurable (default: mark the album(s) as sensitive)    |

For Monitor, Trust-but-verify, and Trusted users, if a sensitive finding fires on a photo with no album (unsorted), the fallback is controlled separately by `ai_vision_nsfw_sensitive_no_album_action` (skip with a warning, or hold for review).

## Albums and sensitivity warnings

When a photo's sensitive finding marks its album, the album is flagged internally (`is_nsfw`); a parent album that's already flagged isn't re-flagged. Visiting a sensitive album shows a dismissable content warning overlay before revealing its contents — admins can customize the warning text and whether the backdrop is blurred or solid.

## Settings

The feature is controlled by the same `AI Vision` category of [Settings](/docs/getting-started/settings/) as facial recognition, all conservative by default:

| Setting                                          | Description                                                              | Default        |
|----------------------------------------------------|-------------------------------------------------------------------------------|-----------------|
| `ai_vision_nsfw_enabled`                         | Enable NSFW classification. Requires `ai_vision_enabled`.               | off            |
| `ai_vision_nsfw_preset`                          | Detection preset sent to the classifier, see [Presets](#presets).       | `default`      |
| `ai_vision_nsfw_check_block_action`              | Block-finding action for Check users: `block` or `moderate`.            | `block`        |
| `ai_vision_nsfw_monitor_block_action`            | Block-finding action for Monitor users: `block` or `moderate`.          | `moderate`     |
| `ai_vision_nsfw_trust_but_verify_block_action`   | Block-finding action for Trust-but-verify users: `block` or `moderate`. | `moderate`     |
| `ai_vision_nsfw_trust_block_action`              | Block-finding action for Trusted users: `block`, `moderate`, or `approve`. | `approve`    |
| `ai_vision_nsfw_sensitive_album_action`          | Whether sensitive findings mark the photo's album(s): `mark_album` or `nothing`. | `mark_album` |
| `ai_vision_nsfw_sensitive_no_album_action`       | Fallback for a sensitive finding on an unsorted photo: `skip` or `moderate`. | `skip`     |
| `ai_vision_nsfw_scan_trusted_users`              | Also scan photos uploaded by Trusted users.                             | off            |
| `ai_vision_nsfw_monitor_hide_on_scan`            | Temporarily hide Monitor-tier photos while the scan is in progress.     | off            |
| `ai_vision_nsfw_trust_but_verify_hide_on_scan`   | Temporarily hide Trust-but-verify photos while the scan is in progress. | off            |
| `ai_vision_nsfw_trust_hide_on_scan`              | Temporarily hide Trusted photos while the scan is in progress.          | off            |

For the `*_hide_on_scan` settings: if the classification service is unavailable, the photo stays hidden until manually approved.

## Presets

`ai_vision_nsfw_preset` (and the service-side `VISION_NSFW_PRESET`, see below) selects a named bundle of block/review/sensitive labels:

| Preset         | Block                                          | Review                          | Sensitive                                  |
|------------------|--------------------------------------------------|--------------------------------------|----------------------------------------------|
| Strict         | All exposed nudity, including male chest        | Covered intimate parts          | Belly, armpits, feet                       |
| Moderation     | _(nothing)_                                      | All exposed nudity              | Covered intimate parts                     |
| Nude female    | Male genitalia, anus                             | Female genitalia                | Female breast/buttocks + covered parts     |
| Permissive     | Genitalia + anus only                            | _(nothing)_                     | Female/male breast, buttocks               |
| Social media   | Female breast, all genitalia, anus               | Buttocks, male chest             | Covered intimate parts                     |

The `default` preset (Lychee's own default) uses the service's built-in defaults: block on exposed genitalia/anus, review on exposed buttocks/female breast, and flag covered intimate parts + exposed belly as sensitive.

## Self-hosting the AI Vision service

NSFW classification requires running the [Lychee-NSFW-Classification](https://github.com/LycheeOrg/Lychee-NSFW-Classification) service (FastAPI + NudeNet) alongside Lychee — **remember it is AGPL-3.0 licensed**, see [above](#license-agpl-30-not-mit) — then pointing Lychee at it via the `AI_VISION_NSFW_URL` and `AI_VISION_NSFW_API_KEY` environment variables — see [AI Vision](/docs/getting-started/configuration/#ai-vision-facial-recognition--nsfw-classification) in the configuration reference. The diagnostics page (admins only) reports whether the service is reachable and correctly configured.

The service is configured independently, via its own `.env` file (copy `.env.example` to `.env`). All of its variables are prefixed `VISION_NSFW_`.

### Required

| Variable                       | Description                                                                  |
|------------------------------------|------------------------------------------------------------------------------|
| `VISION_NSFW_API_KEY`          | Shared secret, validated via the `X-API-Key` header on inbound requests and sent on outbound callbacks. Must match `AI_VISION_NSFW_API_KEY` in Lychee's own `.env`. Do not leave empty in production. |
| `VISION_NSFW_LYCHEE_API_URL`   | Lychee base URL for callbacks, no trailing slash (e.g. `https://lychee.example.com`). |

### Connectivity & storage

| Variable                          | Default          | Description                                                          |
|--------------------------------------|----------------------|---------------------------------------------------------------------------|
| `VISION_NSFW_VERIFY_SSL`          | `true`           | Verify SSL certificates on outbound callbacks. Don't disable in production. |
| `VISION_NSFW_SKIP_LYCHEE_CHECK`   | `false`          | Skip the Lychee connectivity check at startup.                            |
| `VISION_NSFW_PHOTOS_PATH`         | `/data/photos`   | Shared volume mount the service reads photo files from. Mount Lychee's `LYCHEE_UPLOADS` directory here, read-only. Requested `photo_path` values are validated to stay within this root. |

### Classification

| Variable                                | Default     | Description                                                                |
|----------------------------------------------|------------------|-----------------------------------------------------------------------------|
| `VISION_NSFW_PRESET`                    | _none_      | Load a named preset (`strict`, `moderation`, `nude_female`, `permissive`, `social_media`) as the service default. Explicit tier settings below override it; a per-request `preset` field overrides this entirely. |
| `VISION_NSFW_CONFIDENCE_THRESHOLD`      | `0.1`       | Global fallback minimum confidence (0.0–1.0) for any tier.                  |
| `VISION_NSFW_AREA_RATIO_THRESHOLD`      | `0.0`       | Global fallback minimum fraction of image area a detection must cover. `0.0` disables the filter. |
| `VISION_NSFW_BLOCK` / `_REVIEW` / `_SENSITIVE` | _service defaults_ | JSON object configuring that tier's labels/thresholds, e.g. `VISION_NSFW_BLOCK='{"labels": [...], "confidence": 0.7}'`. Individual fields can also be set with `__` sub-keys, e.g. `VISION_NSFW_BLOCK__CONFIDENCE=0.7`. |
| `VISION_NSFW_<PRESET>__<TIER>__<FIELD>` | _none_      | Tune a specific preset in isolation (e.g. `VISION_NSFW_STRICT__BLOCK__CONFIDENCE=0.9`), so every preset is ready for per-request selection regardless of the service-level default. |

This service supports much finer-grained tuning (per-label thresholds, area-ratio filters, replacing a preset's label list) than is exposed here — see the service's own [configuration reference](https://github.com/LycheeOrg/Lychee-NSFW-Classification/blob/master/docs/3-reference/configuration.md) for the full set of options.

### Job queue

| Variable                       | Default     | Description                                                      |
|------------------------------------|------------------|---------------------------------------------------------------------|
| `VISION_NSFW_QUEUE_BACKEND`    | `database`  | `database` (SQLite) or `redis`.                                  |
| `VISION_NSFW_QUEUE_MAX_SIZE`   | `0`         | Maximum pending jobs. `0` = unlimited; beyond it, requests get `429 Too Many Requests`. |
| `VISION_NSFW_STORAGE_PATH`     | `/data/queue` | Directory for the SQLite queue database (`database` backend only). |
| `VISION_NSFW_REDIS_HOST`       | `localhost` | Redis host (`redis` backend only).                                |
| `VISION_NSFW_REDIS_PORT`       | `6379`      | Redis port.                                                        |
| `VISION_NSFW_REDIS_PASSWORD`   | _empty_     | Redis password.                                                    |
| `VISION_NSFW_REDIS_DB`         | `0`         | Redis logical database index.                                     |

### Concurrency & logging

| Variable                          | Default | Description                                                          |
|--------------------------------------|---------|---------------------------------------------------------------------------|
| `VISION_NSFW_THREAD_POOL_SIZE`    | `1`     | Threads for CPU-bound NudeNet inference. Only raise if your NudeNet build is confirmed thread-safe. |
| `VISION_NSFW_WORKERS`             | `1`     | Uvicorn worker processes. Prefer multiple container replicas over raising this for throughput. |
| `VISION_NSFW_LOG_LEVEL`           | `info`  | `debug`, `info`, `warning`, `error`, or `critical`.                       |

### Docker example

```bash
docker run --rm \
  --env-file .env \
  -v /path/to/lychee/public/uploads:/data/photos:ro \
  -p 8000:8000 \
  lychee-nsfw-classification
```

The container exposes interactive API docs at `/docs` and a health check at `/api/nsfw/health` once running.
