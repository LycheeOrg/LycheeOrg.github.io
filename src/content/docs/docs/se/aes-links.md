---
title: Secure Image Links
description: Encrypt and sign image links to prevent hotlinking, URL tampering, and path traversal.
sidebar:
  order: 5
  badge:
    text: SE
    variant: tip
---

Lychee can protect the URLs it generates for photo files with two independent, combinable mechanisms:

- **Temporary (signed) links** — every image URL gets a time-limited, tamper-evident signature. Free, available to everyone.
- **AES-secured links** — the file's storage path itself is encrypted, so URLs aren't guessable or enumerable. Requires a [Supporter Edition](/docs/se/overview/) licence.

Both live under **Settings → Privacy** and can be turned on separately or together.

## Temporary links

When `temporary_image_link_enabled` is on, image URLs are wrapped in a Laravel signed URL: an `expires` timestamp and a `signature` query parameter (an HMAC over the full URL, keyed by `APP_KEY`) are appended. A request is rejected if the timestamp has passed, or if the signature doesn't match — which happens the moment anyone edits the path or query string, since that invalidates the HMAC.

| Setting                                  | Description                                                          | Default |
|---------------------------------------------|---------------------------------------------------------------------------|---------|
| `temporary_image_link_enabled`           | Serve all images through signed, expiring URLs.                      | off     |
| `temporary_image_link_when_logged_in`    | Also require signing for logged-in users (not just guests).          | off     |
| `temporary_image_link_when_admin`        | Also require signing for admins.                                     | off     |
| `temporary_image_link_life_in_seconds`   | How long a signed link stays valid.                                  | `86400` (24h) |

By default, logged-in users and admins are exempt from signing even when it's enabled for guests — `_when_logged_in` and `_when_admin` opt them back in. This lets you protect public/shared links without adding signature overhead to your own browsing session.

:::tip
If you also use [request caching](/docs/getting-started/configuration/#feature-flags), set `temporary_image_link_life_in_seconds` higher than the cache TTL — otherwise cached pages can outlive the signed links they reference, and images will start failing once the signature expires.
:::

## AES-secured links

When `secure_image_link_enabled` is on, the image's storage path (e.g. `c3/3d/c661c594a5a781cd44db06828783.png`) is encrypted before it's placed in the URL, using the same `APP_KEY`/`APP_CIPHER` (AES-256-CBC by default) as the rest of Lychee — see [Configuration](/docs/getting-started/configuration/#advanced-options). Laravel's encryption is authenticated (encrypt-then-MAC), so a tampered or guessed ciphertext fails to decrypt rather than resolving to some other file. This makes it infeasible to enumerate or guess valid image URLs, even without temporary links enabled.

| Setting                       | Description                                  | Default |
|------------------------------------|---------------------------------------------------|---------|
| `secure_image_link_enabled`   | Encrypt the storage path embedded in image URLs.  | off     |

:::note
`secure_image_link_enabled` is only listed in **Settings → Privacy** for installs with an active Supporter Edition licence. If you want to see the setting before purchasing, an admin can enable `enable_se_preview` (Settings → Lychee SE) to surface SE-tier settings without needing a licence.
:::

## How a request is verified

Both protections are enforced by a single endpoint, `GET /image/{path}`, which is only reachable at all if at least one of the two settings above is enabled — otherwise images are served directly from the storage disk's plain URL and this endpoint isn't used.

For each request:

1. If temporary links apply, the `expires` timestamp and `signature` are checked first; an expired or invalid signature is rejected immediately.
2. If AES links are enabled, the path is decrypted; a payload that fails to decrypt (wrong key, corrupted, or just guessed) is rejected.
3. The decrypted/plain path is checked for path-traversal sequences (`..`, `%2e`, `%2f`, `\`) and, after resolving it, verified to still be located inside the upload storage root — rejected otherwise.
4. Only after all of the above does Lychee check whether the file actually exists, so a traversal attempt and a merely-missing file can't be told apart by an attacker probing the endpoint.
5. The file is streamed back.

Path-traversal attempts are rejected with an unusual `418 I'm a teapot` response rather than a generic error — this is intentional, and lets Lychee's [honeypot](/docs/administration/honeypot/) tooling recognize and rate-limit/ban repeat offenders the same way it does for other attack probes.

## S3 storage

If your `images` disk is backed by S3 (see [AWS configuration](/docs/getting-started/configuration/#aws)), none of the above applies — Lychee instead returns the bucket's public URL directly, or asks S3 for its own native pre-signed temporary URL (valid for `temporary_image_link_life_in_seconds`) if the bucket is private. S3's own access controls take over at that point.
