---
title: RSS Feed
description: Subscribe to Lychee updates via RSS feed.
sidebar:
  order: 9
---

Lychee can publish a feed of your most recently added photos, so RSS readers can notify subscribers as your library grows.

## How it works

- The feed lists photos added within the last `rss_recent_days` days (default: `7`), newest first, capped at `rss_max_items` entries (default: `100`).
- It reflects whatever's searchable to whoever requests it — the same visibility rules as [Search](/docs/features/search/). Since RSS readers don't carry your Lychee login session, in practice this means the feed only ever shows publicly accessible photos.
- Each entry links to the photo in the gallery, and its enclosure is the **original, full-resolution** file — not a thumbnail — so keep bandwidth in mind if `rss_max_items` is set high.
- Descriptions are rendered as Markdown; the author is the photo owner's display name (or username if none is set); the category is the containing album's title.
- Sensitive (NSFW) photos are excluded when `hide_nsfw_in_rss` — a [Sensitive Albums setting](/docs/getting-started/settings/#sensitive-albums) — is enabled.

## Accessing the feed

Despite the setting being named `rss_enable`, the feed is actually served at **`/feed`**, not `/rss` — subscribe to `https://your-lychee-instance/feed`. Requesting it while `rss_enable` is off returns an error rather than an empty feed.

## Settings

| Setting            | Description                                          | Default |
|----------------------|-----------------------------------------------------------|-----------|
| `rss_enable`       | Master toggle for the feed at `/feed`.               | off     |
| `rss_max_items`    | Maximum number of items in the feed.                 | `100`   |
| `rss_recent_days`  | Only include photos uploaded within the last X days. | `7`     |

`hide_nsfw_in_rss`, under [Sensitive Albums](/docs/getting-started/settings/#sensitive-albums), additionally excludes sensitive photos from the feed.
