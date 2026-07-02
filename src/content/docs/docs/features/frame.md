---
title: Frame
description: Use Lychee as a digital photo frame display.
sidebar:
  order: 8
---

Frame turns Lychee into a digital photo frame: opening `/frame` goes fullscreen and cycles through random photos one at a time, each shown centered over a blurred, full-bleed copy of itself.

## How it works

- Each cycle picks a random photo — from a specific album if `random_album_id` is configured, or otherwise from every photo you're allowed to search across the whole gallery.
- Videos are skipped: if a random pick turns out to be a video, Frame retries (up to 5 times) before giving up for that cycle.
- Sensitive (NSFW) photos are excluded automatically when `hide_nsfw_in_frame` — a [Sensitive Albums setting](/docs/getting-started/settings/#sensitive-albums) — is enabled.
- Press `Esc`, or use the on-screen back button, to exit fullscreen and return to wherever you started Frame from.

## Accessing Frame

- Frame is reached at `/frame`, or via its entry in the left menu.
- The menu entry is only shown when `mod_frame_enabled` is on **and** the current user can access the album configured by `random_album_id`. If that album is private and the viewer isn't logged in (or lacks the rights), the menu entry disappears for them — even though the route itself would still work for someone who does have access.
- By default, `random_album_id` points at the built-in [Highlighted smart album](/docs/features/smart-albums/) (your starred photos). Set it to any album ID to restrict Frame to that album, or clear it to draw from every searchable photo in the gallery.

## Settings

| Setting              | Description                                                                 | Default       |
|------------------------|---------------------------------------------------------------------------------|-----------------|
| `mod_frame_enabled`  | Master toggle for Frame mode.                                               | on            |
| `random_album_id`    | Album ID used as the photo source. Leave empty to draw from all searchable photos. | `highlighted` |
| `mod_frame_refresh`  | Seconds between photo changes.                                              | `30`          |

`hide_nsfw_in_frame`, under [Sensitive Albums](/docs/getting-started/settings/#sensitive-albums), additionally controls whether sensitive photos can appear in the rotation.

## Building a custom frame client

Besides the built-in fullscreen view, Lychee also exposes a `Photo::random` endpoint (see the [API reference](/docs/administration/api/)) that returns a full photo resource — not just an image URL — using the same random-selection logic (album source, video skipping, NSFW exclusion) as the built-in Frame. This is meant for driving your own external photo-frame client, for example on a Raspberry Pi or another dedicated display, when you need more than a bare image URL.

## Use Cases

- Digital photo frame displays on dedicated screens
- Waiting room or reception area photo slideshows
- Gallery exhibition displays
