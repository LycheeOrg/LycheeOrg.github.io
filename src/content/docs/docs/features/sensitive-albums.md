---
title: Sensitive Albums
description: Flag an album as sensitive to blur it, gate it behind a warning, and exclude it from smart albums, search, and more.
sidebar:
  order: 2
---

Any album can be flagged **sensitive**. This is a built-in feature — toggled directly in the album's settings. A sensitive album gets blurred in listings, can be gated behind a click-to-consent warning, and is excluded by default from smart albums, search, RSS, the timeline, the map, and Frame.

## Marking an album as sensitive

- **Manually** — toggle it in the album's protection policy, the same place you set an album to public/private, require a link, or set a password.
- **Automatically** — [NSFW Classification](/docs/se/nsfw-classification/) can mark an album as sensitive on its own when a "sensitive"-tier finding is detected in one of its photos.
- **Recursively** — sub-albums of a sensitive album are treated as sensitive too, without needing the flag set on each of them individually. Marking a sub-album of an already-sensitive album is skipped, since the parent already covers it.

## What viewers see

| Behavior                  | Setting                    | Default | Effect when on                                                                 |
|-------------------------------|---------------------------------|---------|--------------------------------------------------------------------------------------|
| List sensitive sub-albums    | `nsfw_visible`               | on      | Sensitive sub-albums still appear in listings (blurred, see below). When off, they're omitted from listings entirely. |
| Blur the cover thumbnail    | `nsfw_blur`                   | off     | The album's thumbnail/cover is blurred wherever it's listed.                       |
| Warn guests on open          | `nsfw_warning`                | off     | Anonymous visitors get a click-to-consent overlay the first time they open the album. |
| Warn logged-in users on open | `nsfw_warning_admin`          | off     | Same, but for authenticated users — set independently from the guest setting.       |
| Custom warning text          | `nsfw_banner_override`        | _empty_ | Raw HTML shown in the warning overlay instead of the built-in translated text. **Not sanitized** — only put trusted content here. |
| Blur instead of solid backdrop | `nsfw_banner_blur_backdrop` | off     | The warning overlay blurs the album behind it instead of showing a solid dark-red panel. |

The warning overlay (when shown) requires a single click anywhere on it to dismiss; the album's contents are blurred/hidden behind it until then. Consent is only remembered for the current browser session — it isn't persisted, so the warning reappears on the next visit.

Note that `nsfw_warning`/`nsfw_warning_admin` only gate the *click-through prompt*; turning both off does not unmark the album as sensitive — it's still blurred (if `nsfw_blur` is on) and still excluded from smart albums/search/etc. below, just without the interstitial.

## Excluded from smart albums, search, and more

By default, sensitive content is left out of most aggregate views across the gallery — each area has its own independent toggle, all on by default:

| Area          | Setting                        |
|-------------------|-------------------------------------|
| Smart albums    | `hide_nsfw_in_smart_albums`       |
| Search          | `hide_nsfw_in_search`              |
| RSS feed        | `hide_nsfw_in_rss`                 |
| Timeline        | `hide_nsfw_in_timeline`            |
| Map             | `hide_nsfw_in_map`                 |
| Frame           | `hide_nsfw_in_frame`               |

See [Smart Albums](/docs/features/smart-albums/#per-user-behavior) for more on how this interacts with smart-album visibility specifically.
