---
title: Facial Recognition
description: Automatically detect, cluster, and organize photos by the people in them.
sidebar:
  order: 10
  badge:
    text: v8
    variant: note
---

:::note
Facial recognition is part of Lychee v8 and is **disabled by default** while it matures. It also requires a separate microservice — it does not run inside the main Lychee application.
:::

Lychee can automatically detect faces in your photos, group similar-looking faces together, and let you label them as **People**. Once people are tagged you can browse "all photos of X" the same way you browse albums or tags, and even build [Person Albums](#people-and-person-albums) — smart albums that match one or more people.

All of the machine-learning work (face detection, embeddings, clustering, selfie matching) runs in a dedicated [Lychee-Facial-Recognition](https://github.com/LycheeOrg/Lychee-Facial-Recognition) microservice, kept separate from the main PHP application so the heavier workload doesn't run on your gallery server.

:::caution[Legal notice]
Facial recognition processes biometric data, which is subject to strict legal restrictions (or outright prohibited) in many jurisdictions — for example treated as "special category data" requiring an explicit legal basis under the EU GDPR. **You are solely responsible for verifying that operating this feature is lawful in your jurisdiction** and for obtaining any required consent before enabling it. By default Lychee shows a dismissable warning about this on the Face Clusters and Face Maintenance pages (controlled by the `ai_vision_face_recognition_warning` setting).
:::

## How it works

- **Auto-scan on upload** — newly uploaded photos are automatically queued for face detection once both AI Vision and facial recognition are enabled.
- **Detection** — the AI Vision service finds faces in each photo and returns bounding boxes plus an embedding (a numeric "fingerprint") for each face.
- **Clustering** — faces that aren't yet linked to a person are grouped into clusters of similar-looking faces, so you can label a whole group at once instead of one face at a time.
- **Overlays** — when viewing a photo, detected faces are shown as overlays. Press `P` to toggle their visibility.

## People and Person Albums

- **Person management** — create, rename, merge, and delete people from the People page.
- **Assign faces** — assign an individual detected face, or a whole face cluster, to a person.
- **Dismiss faces** — mark false-positive detections as dismissed so they stop appearing for review; admins (or photo owners, depending on the [permission mode](#permission-modes)) can also purge dismissed faces in bulk.
- **Person Albums** — smart albums that automatically include every photo containing one or more chosen people (matched with AND/OR logic), the same way [tag-based smart albums](/docs/usage/albums/) work.
- **Searchable people** — people can be excluded from search results individually (the `ai_vision_face_person_is_searchable_default` setting controls the default for newly created people).

## Claiming your own photos

Users can link a Person record to their own account ("claiming"), which is useful for letting people find themselves automatically:

- **Manual claim** — pick yourself from the People list.
- **Claim by selfie** — upload a selfie; Lychee forwards it to the AI Vision service's matching endpoint and automatically claims the best-matching person if the match confidence is above `ai_vision_face_selfie_confidence_threshold` (default `0.8`). The uploaded selfie itself is discarded immediately after matching — it is never stored.
- A person can only be claimed by one user at a time, and (unless you're an admin) you can't claim a second person once you already have one linked.
- Whether non-admin users may claim people at all is controlled by the `ai_vision_face_allow_user_claim` setting; admins can always claim/unclaim/merge regardless.

## Permission modes

Who can see and manage faces is controlled by a single setting, `ai_vision_face_permission_mode`:

| Operation              | `public`             | `private`            | `privacy-preserving`        | `restricted` (default)     |
|-------------------------|-----------------------|------------------------|--------------------------------|--------------------------------|
| View People page       | guest                | logged-in users      | photo/album owner + admin    | admin only                   |
| View face overlays     | album access         | logged-in users      | photo/album owner + admin    | photo/album owner + admin    |
| Create/edit a person    | logged-in users      | logged-in users      | photo/album owner + admin    | admin only                   |
| Assign a face           | logged-in users      | logged-in users      | photo/album owner + admin    | admin only                   |
| Trigger a scan          | logged-in users      | logged-in users      | photo/album owner + admin    | photo/album owner + admin    |
| Claim a person          | logged-in users      | logged-in users      | photo/album owner + admin    | photo/album owner + admin    |
| Merge people            | logged-in users      | logged-in users      | photo/album owner + admin    | admin only                   |
| Dismiss a face          | photo owner + admin  | photo owner + admin  | photo/album owner + admin    | photo owner + admin          |
| Batch face operations   | logged-in users      | logged-in users      | photo/album owner + admin    | admin only                   |
| View people on an album | album access         | logged-in users      | photo/album owner + admin    | photo/album owner + admin    |

## Settings

The feature is controlled by a `AI Vision` category of [Settings](/docs/getting-started/settings/), all disabled/conservative by default:

| Setting                                          | Description                                                              | Default        |
|----------------------------------------------------|-------------------------------------------------------------------------------|-----------------|
| `ai_vision_enabled`                              | Master toggle for the whole AI Vision subsystem (also gates NSFW classification). | off          |
| `ai_vision_face_enabled`                         | Toggle facial recognition specifically. Requires `ai_vision_enabled`.    | off            |
| `ai_vision_face_permission_mode`                 | See [Permission modes](#permission-modes).                              | `restricted`   |
| `ai_vision_face_selfie_confidence_threshold`     | Minimum match confidence (0.0–1.0) to auto-link via [selfie claim](#claiming-your-own-photos). | `0.8` |
| `ai_vision_face_person_is_searchable_default`    | Default searchability for newly created people.                         | on             |
| `ai_vision_face_allow_user_claim`                | Allow non-admin users to claim a person.                                 | on             |
| `ai_vision_face_overlay_enabled`                 | Master toggle for face overlays/bounding boxes in the UI.                | on             |
| `ai_vision_face_overlay_default_visibility`      | Whether overlays are shown or hidden by default when opening a photo (toggle with `P`). | visible |
| `ai_vision_face_recognition_warning`             | Show the dismissable legal warning on the Face Clusters/Maintenance pages. | on           |

## Self-hosting the AI Vision service

Facial recognition requires running the [Lychee-Facial-Recognition](https://github.com/LycheeOrg/Lychee-Facial-Recognition) service (FastAPI + DeepFace) alongside Lychee, then pointing Lychee at it via the `AI_VISION_FACE_URL` and `AI_VISION_FACE_API_KEY` environment variables — see [AI Vision](/docs/getting-started/configuration/#ai-vision-facial-recognition--nsfw-classification) in the configuration reference. The diagnostics page reports whether the service is reachable and correctly configured.

The service is configured independently, via its own `.env` file (copy `.env.example` to `.env`). All of its variables are prefixed `VISION_FACE_`; missing required variables produce a formatted error at startup instead of a raw traceback.

### Required

| Variable                       | Description                                                                  |
|----------------------------------|------------------------------------------------------------------------------|
| `VISION_FACE_LYCHEE_API_URL`   | Lychee base URL used for callbacks (no trailing slash).                     |
| `VISION_FACE_API_KEY`          | Shared API key — validated on inbound requests from Lychee and sent on outbound callbacks. Must match `AI_VISION_FACE_API_KEY` in Lychee's own `.env`. |

### Connection

| Variable                          | Default | Description                                                          |
|--------------------------------------|---------|---------------------------------------------------------------------------|
| `VISION_FACE_VERIFY_SSL`          | `true`  | Verify SSL certificates on Lychee callbacks. Set to `false` for self-signed certs. |
| `VISION_FACE_SKIP_LYCHEE_CHECK`   | `false` | Skip the Lychee connectivity check at startup (useful for local dev).     |

### Model

| Variable                         | Default            | Description                                                              |
|--------------------------------------|------------------------|-------------------------------------------------------------------------|
| `VISION_FACE_MODEL_NAME`         | `ArcFace`           | DeepFace recognition model.                                             |
| `VISION_FACE_DETECTOR_BACKEND`   | `retinaface`        | DeepFace detector backend (`retinaface`, `mtcnn`, `opencv`, `ssd`).      |
| `VISION_FACE_MODEL_ROOT`         | `/root/.deepface`   | Root directory for DeepFace model weights (`DEEPFACE_HOME`).            |

### Detection & matching

| Variable                            | Default | Description                                                            |
|------------------------------------------|---------|--------------------------------------------------------------------------|
| `VISION_FACE_DETECTION_THRESHOLD`   | `0.5`   | Bounding-box confidence filter.                                         |
| `VISION_FACE_MATCH_THRESHOLD`       | `0.5`   | Cosine-similarity cutoff for selfie matching and suggestions.           |
| `VISION_FACE_RESCAN_IOU_THRESHOLD`  | `0.5`   | IoU threshold for bounding-box matching on re-scan.                     |
| `VISION_FACE_MAX_FACES_PER_PHOTO`   | `10`    | Maximum faces included in a callback payload.                           |
| `VISION_FACE_MIN_FACE_SIZE_PIXELS`  | `0`     | Minimum face size in pixels; `0` disables this filter.                  |
| `VISION_FACE_BLUR_THRESHOLD`        | `0.5`   | Laplacian variance threshold; blurry faces below this are discarded.    |
| `VISION_FACE_CLUSTER_EPS`           | `0.6`   | DBSCAN epsilon (max cosine distance) used for face clustering.          |

### Storage

| Variable                      | Default              | Description                                                  |
|------------------------------------|---------------------------|---------------------------------------------------------------|
| `VISION_FACE_STORAGE_BACKEND` | `sqlite`              | `sqlite` or `pgvector`.                                      |
| `VISION_FACE_STORAGE_PATH`    | `/data/embeddings`    | SQLite database directory.                                   |
| `VISION_FACE_PG_HOST`         | `localhost`           | PostgreSQL host (`pgvector` backend only).                   |
| `VISION_FACE_PG_PORT`         | `5432`                | PostgreSQL port.                                              |
| `VISION_FACE_PG_DATABASE`     | `ai_vision`           | PostgreSQL database.                                          |
| `VISION_FACE_PG_USER`         | `ai_vision`           | PostgreSQL user.                                               |
| `VISION_FACE_PG_PASSWORD`     | _empty_               | PostgreSQL password.                                          |
| `VISION_FACE_PHOTOS_PATH`     | `/data/photos`        | Shared volume mount where the service reads photo files from. Mount Lychee's `LYCHEE_UPLOADS` directory here, read-only. |

### Job queue

Detection and clustering jobs are processed asynchronously via a persistent queue shared across all worker processes. Requests that arrive when the queue is full receive `429 Too Many Requests`.

| Variable                      | Default     | Description                                                  |
|------------------------------------|------------------|---------------------------------------------------------------|
| `VISION_FACE_QUEUE_BACKEND`   | `database`  | `database` (uses `VISION_FACE_STORAGE_BACKEND`) or `redis`.  |
| `VISION_FACE_QUEUE_MAX_SIZE`  | `100`       | Maximum number of pending jobs.                               |
| `VISION_FACE_REDIS_HOST`      | `localhost` | Redis host (`redis` backend only).                            |
| `VISION_FACE_REDIS_PORT`      | `6379`      | Redis port.                                                   |
| `VISION_FACE_REDIS_PASSWORD`  | _empty_     | Redis password.                                                |
| `VISION_FACE_REDIS_DB`        | `0`         | Redis logical database index.                                  |

### Concurrency

| Variable                          | Default | Description                                                          |
|--------------------------------------|---------|---------------------------------------------------------------------------|
| `VISION_FACE_THREAD_POOL_SIZE`    | `1`     | Inference threads; also sets the number of queue worker tasks.            |
| `VISION_FACE_WORKERS`             | `1`     | Uvicorn worker processes.                                                  |

### Docker example

```bash
docker run --rm \
  --env-file .env \
  -v /path/to/lychee/public/uploads:/data/photos:ro \
  -v ai-vision-embeddings:/data/embeddings \
  -p 8000:8000 \
  lychee-ai-vision
```

The container exposes interactive API docs at `/docs` and a health check at `/health` once running.

## Command-line tools

| Command                                  | Description                                                                 |
|---------------------------------------------|----------------------------------------------------------------------------------|
| `php artisan lychee:scan-faces`          | Enqueue all unscanned photos for face detection. Use `--album={id}` to limit to the direct photos of one album. |
| `php artisan lychee:rescan-failed-faces` | Re-enqueue photos whose scan previously failed. Add `--stuck-pending` (with `--older-than=<minutes>`, default 60) to also reset scans stuck in "pending" back to unscanned. |
