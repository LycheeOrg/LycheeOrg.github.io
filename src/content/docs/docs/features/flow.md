---
title: Flow
description: Display albums in a social media-like feed.
sidebar:
  order: 6
---

Flow displays albums in a feed-like manner, similar to social media platforms. Each album becomes a scrollable card — with a cover image, a carousel of the photos inside, and metadata such as its date range — giving you a visually engaging alternative to browsing the album tree.

## How it works

- Flow starts from a base album (the gallery root by default, or a specific album set via `flow_base`) and turns eligible **descendants** of that base into cards — the base album itself is never shown as a card.
- By default (`flow_include_sub_albums` off), only the **direct children** of the base are considered — nested sub-albums further down the tree are not included. Enabling `flow_include_sub_albums` includes every descendant at any depth; if no base album is set either, this effectively means every album in the gallery is a candidate.
- Only albums that directly contain photos become cards. Enabling `flow_include_photos_from_children` also includes albums with no photos of their own by showing photos from their descendants instead — **not recommended**, since it can be slow and memory-intensive on large trees.
- Album descriptions are rendered as Markdown on the card.
- The owner's name is only shown to logged-in viewers; anonymous visitors (when `flow_public` is enabled) never see it.
- Cards are loaded a page at a time as you scroll, rather than all at once.
- Flow is exposed as its own standalone page and respects the same album-level permissions as the rest of the gallery — a user only sees cards for albums they're allowed to access.

### Ordering and the `opt-in` strategy

`flow_strategy` controls both which albums are eligible and how the feed is sorted:

- `auto` (default) — every eligible album is included, newest-created first.
- `opt-in` — only albums that have been explicitly published to the feed are included, sorted by their publish date (newest first).

:::note
`opt-in` relies on each album having a publish timestamp, but at the time of writing there is no interface action exposed to set this per album. Until one ships, switching `flow_strategy` to `opt-in` will result in an empty Flow feed — stick with `auto` (the default) for a usable feed today.
:::

### Sensitive (NSFW) albums in Flow

Albums marked as sensitive are handled the same way as elsewhere in Lychee, via the [Sensitive Albums settings](/docs/getting-started/settings/#sensitive-albums):

- `hide_nsfw_in_flow` (default: on) — excludes sensitive albums from Flow entirely.
- `flow_blur_nsfw_enabled` (default: on) — if sensitive albums aren't hidden, blur their photos on the card until a user clicks through.

## Settings

The feature is controlled by a `Flow` category of [Settings](/docs/getting-started/settings/):

| Setting                                 | Description                                                                                       | Default          |
|------------------------------------------|-----------------------------------------------------------------------------------------------------|-------------------|
| `flow_enabled`                          | Master toggle for the Flow view.                                                                   | on                |
| `flow_public`                           | Allow anonymous (non-logged-in) users to access Flow.                                              | off               |
| `flow_base`                             | Album ID used as the root of the feed. Leave empty to use the gallery root.                        | empty             |
| `flow_max_items`                        | Number of albums loaded per Flow page. Lower means more requests; higher means more memory usage.  | `10`              |
| `flow_strategy` <span class="se-tag">SE</span>              | See [Ordering and the opt-in strategy](#ordering-and-the-opt-in-strategy).                          | `auto` |
| `flow_include_sub_albums` <span class="se-tag">SE</span>    | Include all descendants of the base album, not just its direct children.                           | off               |
| `flow_include_photos_from_children` <span class="se-tag">SE</span> | Show photos from child albums when an album itself has none. **Not recommended** — can cause memory exhaustion and slowdowns on large trees. | off |
| `flow_open_album_on_click` <span class="se-tag">SE</span>  | Navigate to the album when a card is clicked, instead of opening the photo viewer directly.        | off               |
| `flow_display_open_album_button` <span class="se-tag">SE</span> | Show an explicit "Open Album" button on each card.                                             | off               |
| `flow_image_header_enabled` <span class="se-tag">SE</span> | Show an image header at the top of each card, featuring the album cover.                            | on                |
| `flow_image_header_cover` <span class="se-tag">SE</span>   | How the header image fills the card: `cover` crops to fill, `fit` scales to fit.                    | `cover`           |
| `flow_image_header_height` <span class="se-tag">SE</span>  | Height of the image header, in `rem`.                                                               | `24`              |
| `flow_carousel_enabled` <span class="se-tag">SE</span>     | Show a photo carousel below the image header on each card.                                          | on                |
| `flow_carousel_height` <span class="se-tag">SE</span>      | Height of the photo carousel, in `rem`.                                                              | `6`               |
| `flow_highlight_first_picture` <span class="se-tag">SE</span> | Use the album's first photo as the main image instead of its cover photo.                        | on                |
| `flow_min_max_enabled` <span class="se-tag">SE</span>      | Show the min/max date range of the album's photos on each card.                                     | on                |
| `flow_min_max_order`                    | Which date (older or newer) is shown first in the min/max date range.                              | `older_younger`   |
| `flow_display_statistics` <span class="se-tag">SE</span>   | Show view, share, and download counts on each card. Also requires the [`metrics_enabled`](/docs/getting-started/settings/#metrics_enabled) master toggle and read-metrics permission on the album. | on |
| `flow_compact_mode_enabled` <span class="se-tag">SE</span> | Clamp the description to 3 lines and hide extra details (photo/child counts); a "Show more" button expands the card. | on |

`flow_base`, `flow_max_items`, and `flow_min_max_order` are available on the free edition; the rest of the card's layout and the inclusion strategy require the [Supporter Edition](/docs/se/overview/).

### Date format

Two settings accept [PHP date format strings](https://www.php.net/manual/en/datetime.format.php) and require the Supporter Edition:

| Key                            | Default                | Used for                              |
|----------------------------------|------------------------------|----------------------------------------|
| `date_format_flow_published`   | `M j, Y, g:i:s A e`     | Album published/created date shown on cards |
| `date_format_flow_min_max`      | `F Y`                    | Min/max date range shown on cards     |

## Supporter Edition Features

With the [Supporter Edition](/docs/se/overview/) you get finer control over the feed:

- **Opt-in strategy** — switch `flow_strategy` from `auto` (every eligible album) to `opt-in` (only explicitly published albums); see the [caveat above](#ordering-and-the-opt-in-strategy) about its current front-end support.
- **Nested album inclusion** — pull in every descendant of the base album, not just its direct children, via `flow_include_sub_albums`.
- **Compact mode** — clamp cards to a shorter, summarized layout via `flow_compact_mode_enabled`.
- **Extensive card customization** — toggle the image header, carousel, statistics, and min/max date range independently, and tune their sizing.
