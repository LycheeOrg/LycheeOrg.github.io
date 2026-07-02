---
title: Statistics
description: View detailed statistics about your Lychee installation and photo library.
sidebar:
  order: 2
  badge:
    text: SE
    variant: tip
---

Lychee SE bundles two distinct subsystems here: **usage statistics** about your library's storage and growth, and **engagement metrics** tracking how photos and albums are viewed, downloaded, and shared.

## Usage Statistics

Accessible from the dedicated Statistics page:

- **Storage breakdown** — total space used, broken down per size-variant type (thumbnail, small, medium, original, etc.) and per user.
- **Activity over time** — a calendar-style chart of photo counts, by upload date or by the photo's original taken-at date.
- **Per-album breakdown** — a table of storage usage and photo counts per album, both for the album's own photos and including all descendants, collapsible into per-user totals.
- Regular users only see statistics for their own photos and albums; admins see the whole instance.

## Engagement Metrics

Enable `metrics_enabled` to start recording view, download, and share counts on photos and albums:

- Counts appear as small badges on albums and photos, and on [Flow](/docs/features/flow/) cards.
- Anonymous visitors are always counted when enabled; logged-in users are only counted if `metrics_logged_in_users_enabed` is also on. **Admin activity is never counted**, so browsing as an admin won't inflate your own stats.
- Who can see these counts is controlled separately by `metrics_access` (admin, owner, logged-in users, or public).

### Live Metrics

`live_metrics_enabled` additionally turns on a real-time activity feed — a running log of visits, favourites, downloads, and shares as they happen. Photo-level page visits are deliberately excluded from this feed to keep it readable; only album-level visits and the other actions are listed. As with the counts above, non-admins only ever see activity for their own albums and photos. Entries older than `live_metrics_max_time` days are purged automatically the next time the feed is loaded — there's no separate scheduled cleanup job. Access to the feed itself is controlled by `live_metrics_access` (admin or logged-in users).

## Settings

The [`Pro`](/docs/getting-started/settings/#pro) settings category controls engagement metrics:

| Setting                             | Description                                                          | Default |
|----------------------------------------|-----------------------------------------------------------------------------|-----------|
| `metrics_enabled`                   | Master toggle for view/download/share counts on photos and albums.  | off     |
| `metrics_logged_in_users_enabed`    | Also count logged-in users (admins are always excluded).            | off     |
| `metrics_access`                    | Who can see the counts: `admin`, `owner`, `logged-in users`, or `public`. | `admin` |
| `live_metrics_enabled`              | Turn on the live activity feed.                                     | off     |
| `live_metrics_access`               | Who can view the live feed: `admin` or `logged-in users`.            | `admin` |
| `live_metrics_max_time`             | How many days of live activity to retain.                           | `30`    |
