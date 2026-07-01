---
title: Watermarking
description: Apply a custom watermark image to uploaded and existing photos.
sidebar:
  order: 4
  badge:
    text: SE
    variant: tip
---

Lychee can stamp a custom watermark image onto photo variants, to deter people from reusing photos pulled from your gallery. The original file is never touched — Lychee generates a separate watermarked copy of each size variant and serves that one instead, depending on who's viewing.

## Setting it up

The watermark itself is just another photo in your library:

1. Upload the image you want to use as a watermark (a PNG with a transparent background gives the best results).
2. Open it and copy its **photo ID** — the 24-character identifier at the end of its URL.
3. Paste that ID into the `watermark_photo_id` setting and turn on `watermark_enabled`.

Watermarking requires the `imagick` setting to be on and the PHP Imagick extension to actually be installed — the admin diagnostics page will warn you if either is missing, or if `watermark_photo_id` doesn't resolve to a real photo.

:::caution[Doubles your storage usage]
Lychee keeps the original, un-watermarked variants around and additionally generates a watermarked copy of each one. Enabling this roughly **doubles** the file-storage usage for any photo it's applied to.
:::

## When watermarks are applied

- **At upload time** — every new photo is watermarked automatically once `watermark_enabled` is on, for every generated size variant except the placeholder (the original itself is only watermarked if `watermark_original` is also on).
- **Retroactively** — admins/editors can trigger watermarking for an existing album or a selection of existing photos; this dispatches a background job per size variant rather than blocking the request.
- **Per-upload opt-out** — uploaders can skip watermarking for an individual upload, unless an admin has turned on `watermark_optout_disabled` to force it for everyone.

## Who sees the watermark

| Setting                               | Description                                                  | Default |
|--------------------------------------------|-------------------------------------------------------------------|---------|
| `watermark_public`                    | Show the watermark to anonymous (guest) viewers.             | on      |
| `watermark_logged_in_users_enabled`   | Show the watermark to logged-in users too.                   | off     |
| `watermark_original`                  | Also generate a watermarked copy of the original file, not just thumbnails/previews. | off |
| `watermark_optout_disabled`           | Prevent uploaders from opting out of watermarking their own uploads. | off |

If neither `watermark_public` nor `watermark_logged_in_users_enabled` applies to the current viewer, they're served the plain, un-watermarked variant — watermarking is about controlling *distribution*, not about restricting access to the photo itself.

## Positioning, scaling & opacity

This works much like the watermark editor in Lightroom: pick an anchor point on the photo, then freely fine-tune from there — scale, opacity, and a separate fine-grained shift off the anchor — rather than being locked to a single fixed corner.

| Setting                          | Description                                                                | Default  |
|----------------------------------------|----------------------------------------------------------------------------|----------|
| `watermark_size`                 | Watermark width as a percentage of the photo's width (1–100).             | `50`     |
| `watermark_opacity`              | Watermark opacity (1–100). Below ~25 it tends to become barely visible.   | `75`     |
| `watermark_position`             | Anchor point on a 3×3 grid: `top-left`, `top`, `top-right`, `left`, `center`, `right`, `bottom-left`, `bottom`, `bottom-right`. | `center` |
| `watermark_shift_type`           | Whether the fine-tuning shift below is `relative` (% of image size) or `absolute` (pixels). | `relative` |
| `watermark_shift_x` / `_x_direction`   | Horizontal fine-tuning offset from the anchor point, and its direction (`left`/`right`). | `0`, `right` |
| `watermark_shift_y` / `_y_direction`   | Vertical fine-tuning offset from the anchor point, and its direction (`up`/`down`).      | `0`, `up`   |

The shift is applied *after* the anchor positioning and is clamped so the watermark can't be pushed outside the photo's bounds.

## Keeping the original hidden

| Setting                  | Description                                                                                          | Default |
|---------------------------|--------------------------------------------------------------------------------------------------------|---------|
| `watermark_random_path`  | Give the watermarked file a freshly-randomized path instead of one derived from the original's path. | on      |

With the default (`on`), the watermarked file's URL gives no hint about the original, un-watermarked file's path — so knowing one doesn't help guess the other. This pairs well with [Secure Image Links](/docs/se/aes-links/) if you also want the paths themselves to be unguessable.
