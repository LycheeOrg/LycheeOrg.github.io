---
title: Smart Albums
description: Dynamically generated albums based on photo properties, ratings, tags, and people — no manual sorting required.
sidebar:
  order: 1
---

Smart Albums collect photos automatically based on a condition, instead of requiring you to assign photos to them by hand. Lychee has two kinds:

- **Built-in smart albums** — system-wide, virtual albums (Unsorted, Recent, rating tiers, etc.) that you can only turn on or off, not create or delete.
- **User-created smart albums** — real albums you create yourself, that pick their photos dynamically by matching **tags** or **people** instead of by manual assignment. They behave like regular albums otherwise (your own title, cover photo, sharing/access settings).

Both kinds re-evaluate their contents live, so a photo appears or disappears the moment it stops/starts matching — there's nothing to keep in sync manually.

## Built-in smart albums

| Album              | Shows                                                                                          | Setting (default)            |
|------------------------|------------------------------------------------------------------------------------------------------|----------------------------------|
| Unsorted            | Photos not assigned to any album.                                                                   | `enable_unsorted` (on)         |
| Highlighted          | Photos you've highlighted (the old "starred" flag).                                                | `enable_highlighted` (on)      |
| Recent               | Photos uploaded within the last `recent_age` days.                                                  | `enable_recent` (on), `recent_age` (`1` day) |
| On This Day          | Photos taken on today's month/day in a previous year (falls back to upload date if there's no EXIF date). | `enable_on_this_day` (on) |
| Untagged             | Photos with no tags at all.                                                                          | `enable_untagged` (on)         |

:::caution
Disabling `enable_unsorted` doesn't delete anything, but it does make photos that aren't in any album effectively invisible in the gallery — there's no other built-in way to reach them.
:::

:::tip
`recent_age` defaults to just **1 day**. If "Recent" feels emptier than you'd expect, that's almost certainly why — raise it in Settings.
:::

Highlighting a photo is really just a shortcut for giving it a 5-star rating from yourself — see below.

## Rating-based smart albums

Photos can be rated 1–5 stars, by any user with access, and Lychee averages everyone's rating into `rating_avg` per photo. The "stars" smart albums filter on that average:

| Album        | Range                          | Setting (default)              |
|------------------|------------------------------------|------------------------------------|
| Unrated       | No ratings at all                | `enable_unrated` (off)           |
| 1 Star        | `1.0 ≤ rating_avg < 2.0`          | `enable_1_star` (off)            |
| 2 Stars       | `2.0 ≤ rating_avg < 3.0`          | `enable_2_stars` (off)           |
| 3 Stars       | `rating_avg ≥ 3.0` (3★ and up)    | `enable_3_stars` (off)           |
| 4 Stars       | `rating_avg ≥ 4.0` (4★ and up)    | `enable_4_stars` (**on**)        |
| 5 Stars       | `rating_avg ≥ 5.0`                | `enable_5_stars` (**on**)        |

Note that 1★ and 2★ are exact bins, while 3★ and 4★ are cumulative thresholds (a 5-star photo shows up in all of "3 Stars", "4 Stars", and "5 Stars").

Two more rating-based albums look at ratings rather than photos directly:

| Album                | Shows                                                          | Setting (default)                                    |
|---------------------------|---------------------------------------------------------------------|------------------------------------------------------------|
| My Rated Pictures      | Every photo *you've* personally rated, sorted by your own rating. | `enable_my_rated_pictures` (on) — logged-in users only |
| Best Pictures           | The top `best_pictures_count` photos by `rating_avg` (ties at the cutoff are all included). | `enable_best_pictures` (on), `best_pictures_count` (`100`) — requires [Supporter Edition](/docs/se/overview/) |
| My Best Pictures        | The top `my_best_pictures_count` photos *you've* rated, by your own rating. | `enable_my_best_pictures` (on), `my_best_pictures_count` (`50`) — requires [Supporter Edition](/docs/se/overview/), logged-in users only |

## Per-user behavior

Each logged-in user effectively gets their own view of every smart album — not because there are separate albums per user, but because Lychee's normal visibility rules (what photos you're allowed to see) are applied before the smart-album condition. Two settings adjust this further:

- `enable_smart_album_per_owner` — restricts smart albums to *only* photos you own, instead of every photo you have access to.
- `SA_override_visibility` (expert setting) — the opposite extreme: makes any photo matching the smart-album condition visible through that album, bypassing normal photo visibility entirely. Use with care.

Smart albums that are about organizing your own contributions (Unsorted, Highlighted, Recent, On This Day, Unrated, Untagged) are only shown to users with upload rights; the rating-tier and "Best/My" albums are shown to everyone regardless.

By default, photos in albums marked sensitive by [NSFW Classification](/docs/se/nsfw-classification/) are excluded from every smart album — controlled by `hide_nsfw_in_smart_albums`, on by default. This is one of several independent per-feature toggles (search, RSS, timeline, map, and Frame each have their own equivalent setting).

## User-created smart albums

Unlike the built-in ones above, these are albums you explicitly create, with your own title and (optionally) a chosen cover photo — they just don't have photos manually assigned to them. Instead, you pick a set of tags or people and a match mode:

- **Tag Albums** — automatically include every photo carrying one or more chosen tags, matched with AND/OR logic. See [Tagging](/docs/features/tagging/).
- **Person Albums** — automatically include every photo containing one or more chosen people, matched with AND/OR logic. See [Facial Recognition](/docs/features/facial-recognition/#people-and-person-albums).

Like the built-in albums, both re-evaluate live — tag or re-tag a photo (or re-run face detection) and matching tag/person albums update immediately. An expert setting, `TA_override_visibility`, mirrors `SA_override_visibility` above but for tag albums specifically.
