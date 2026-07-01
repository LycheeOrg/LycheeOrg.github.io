---
title: "Settings"
description: "Complete reference for all Lychee database settings and configuration options."
sidebar:
  order: 4
---

All Lychee settings are stored in the database alongside album and photo metadata.  They are accessible to the administrator after logging in by opening the left menu (hamburger icon in the top-left corner), navigating to the _Admin_ page, and clicking the _Settings_ button.

:::tip[Explore!]
Lychee ships with a large number of configuration options — don't be overwhelmed! The defaults work well out of the box, but we encourage you to browse the settings and experiment. You may discover features you didn't know existed.
:::

The settings UI organises options into labelled sections. Throughout this reference, settings are annotated with the following tags:

| Tag | Meaning |
|-----|---------|
| <span class="expert-tag">Expert</span> | Hidden by default. Enable the _Expert mode_ toggle at the top of the Settings page to reveal these options. |
| <span class="se-tag">SE</span> | Requires an active [Lychee Supporter Edition](https://lycheeorg.dev/get-supporter-edition/) license. |
| <span class="pro-tag">Pro</span> | Requires the Lychee Pro tier. |

---

## Basics

General site-wide options.

#### `dark_mode_enabled`
_(boolean; default: `1`)_

Use dark mode for the Lychee UI.

#### `use_admin_dashboard`
_(boolean; default: `1`)_

Show an admin dashboard instead of management links in the left menu.

#### `site_owner`
_(string; default: `John Smith`)_

Name of the gallery owner, used in the copyright notice and landing page.

#### `site_title`
_(string; default: `Lychee v7`)_

Browser title for the gallery.

#### `lang`
_(string; default: `en`)_

Language used by the Lychee interface.

#### `home_page_default`
_(enum: `gallery|flow|timeline`; default: `gallery`)_

Which page is shown after landing on the root URL.

#### `sm_card_album_source`
_(enum: `header|cover`; default: `header`)_

Which album photo (header or cover) is used as the Open Graph image when sharing album links on social media.

#### `sm_card_image_url`
_(string; default: empty)_

Fallback URL or photo ID for Open Graph images when no album-specific image is available. When empty, the landing page background is used.

#### `is_embed_enabled`
_(boolean; default: `1`)_

Enable the embed API endpoints and related UI features for embedding Lychee content in external websites. When disabled, all embed endpoints return 404.

#### `new_photos_notification`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

Send notifications when new photos are uploaded.

---

## Lychee SE

Manage your Supporter Edition license.

#### `disable_se_call_for_actions`
_(boolean; default: `0`)_

Hide Lychee SE call-for-action prompts throughout the UI. Note that when a valid SE license is active, these prompts are already hidden automatically — this setting is only useful if you want to suppress them without a license.

#### `enable_se_preview`
_(boolean; default: `0`)_

Enable a visual preview of Lychee SE features without an active license.

#### `license_key`
_(string; default: empty)_

Your Lychee SE license key. Obtain one at [lycheeorg.dev/get-supporter-edition](https://lycheeorg.dev/get-supporter-edition/).

---

## Gallery

Controls the visual layout and display behaviour of the gallery.

#### `layout`
_(enum: `square|justified|masonry|grid`; default: `justified`)_

Photo layout inside albums:

- **square** — All thumbnails are cropped to a uniform square and arranged in a regular grid. Clean and predictable, but crops out parts of each photo.
- **justified** — Thumbnails preserve their original aspect ratio. Each row is scaled so that photos are flush with both the left and right edges, giving a neat newspaper-like look.
- **masonry** — Thumbnails preserve their original aspect ratio and are arranged in fixed-width columns, each photo slotting below the shortest column. Rows are not aligned, producing a Pinterest-style layout.
- **grid** — Similar to square but columns have a configurable minimum width (`photo_layout_grid_column_width`). Photos are not cropped; they fill the cell at their natural ratio.

#### `default_album_thumb_aspect_ratio`
_(enum: `1/1|2/3|3/2|4/5|5/4|16/9`; default: `1/1`)_

Default aspect ratio for album thumbnail covers.

#### `sorting_albums_col`
_(enum: `created_at|title|description|max_taken_at|min_taken_at|title_strict|description_strict`; default: `max_taken_at`)_

Column used for the default album sort. See the note on `title` vs `title_strict` below.

#### `sorting_albums_order`
_(enum: `ASC|DESC`; default: `ASC`)_

Direction of the default album sort.

#### `sorting_photos_col`
_(enum: `created_at|taken_at|title|description|is_highlighted|type|title_strict|description_strict`; default: `taken_at`)_

Column used for the default photo sort. See the note on `title` vs `title_strict` below.

:::note[`title` vs `title_strict` (and `description` vs `description_strict`)]
These two variants sort by the same column but use different comparison strategies:

- **`title` / `description`** — sorted in PHP after the database query, using **natural, case-insensitive** ordering (`SORT_NATURAL | SORT_FLAG_CASE`). Numbers embedded in strings are compared numerically, so `"Photo 2"` comes before `"Photo 10"`. This is the most human-friendly order but requires loading all records into memory before sorting.
- **`title_strict` / `description_strict`** — sorted directly by the **database engine** using its native collation. Ordering is lexicographic, so `"Photo 10"` comes before `"Photo 2"` (because `"1"` < `"2"` character by character). This is faster on large libraries since no in-memory pass is needed, but the result may surprise users who expect natural numeric ordering.
:::

:::caution[Natural sort does not work correctly with pagination]
Natural sort (`title` / `description`) only works correctly when **all** photos are loaded at once. If pagination is enabled with a small page size, the database returns only the current page's records and PHP sorts only that subset — so each page is sorted independently rather than the full album. This produces unexpected ordering across pages. Use `title_strict` or `description_strict` if you rely on pagination.
:::


#### `sorting_photos_order`
_(enum: `ASC|DESC`; default: `ASC`)_

Direction of the default photo sort.

#### `album_decoration`
_(enum: `none|layers|album|photo|all`; default: `layers`)_

Decorations displayed on album covers (sub-album count, photo count, or both).

#### `album_decoration_orientation`
_(enum: `column|column-reverse|row|row-reverse`; default: `row`)_

Alignment of album decorations: horizontal or vertical.

#### `album_subtitle_type`
_(enum: `disabled|description|takedate|creation|oldstyle|num_photos|num_albums|num_photos_albums`; default: `oldstyle`)_

What is shown as the subtitle beneath each album in the albums view.

#### `image_overlay_type`
_(enum: `exif|desc|date|none`; default: `desc`)_

Default content shown in the image overlay at the bottom of the photo view.

#### `display_thumb_album_overlay`
_(enum: `always|hover|never`; default: `always`)_

When to display the title and metadata on album thumbnails.

#### `display_thumb_photo_overlay`
_(enum: `always|hover|never`; default: `hover`)_

When to display the title and metadata on photo thumbnails.

#### `thumb_min_max_order`
_(enum: `older_younger|younger_older`; default: `younger_older`)_

Which date (older or newer) is displayed first on album thumbnails.

#### `header_min_max_order`
_(enum: `older_younger|younger_older`; default: `older_younger`)_

Which date (older or newer) is displayed first in the album header.

#### `use_album_compact_header`
_(boolean; default: `0`)_

Disable the large header image inside album views.

#### `autoplay_enabled`
_(boolean; default: `1`)_

Set the `autoplay` attribute on video elements.

#### `photos_wraparound`
_(boolean; default: `1`)_

Loop back to the first photo after reaching the last one in an album (and vice versa).

#### `slideshow_timeout`
_(positive integer; default: `5`)_

Seconds between photos in slideshow mode.

#### `default_license`
_(license; default: `none`)_

Default Creative Commons license applied to newly uploaded photos.

#### `default_album_protection`
_(enum: `private|public|inherit|public_hidden`; default: `private`)_

Default visibility for newly created albums. `private` = owner only; `public` = publicly visible; `inherit` = inherit from parent; `public_hidden` = public but not listed.

#### `details_links_enabled`
_(boolean; default: `0`)_

Show a module in the photo details panel for easily copying photo URLs.

#### `details_links_public`
_(boolean; default: `0`)_

Allow anonymous users to use the photo URL copy module.

#### `number_albums_per_row_mobile`
_(enum: `1|2|3`; default: `3`)_ <span class="se-tag">SE</span>

Number of album columns on mobile viewports.

#### `album_layout`
_(enum: `grid|list`; default: `grid`)_

Default album view: grid (thumbnail cards) or list (detailed rows). Users can toggle this client-side, but the preference does not persist across reloads.

#### `albums_per_page`
_(positive integer; default: `30`)_

Number of child albums per page in paginated album views.

#### `albums_pagination_ui_mode`
_(enum: `infinite_scroll|load_more_button|page_navigation`; default: `infinite_scroll`)_

How album pagination is presented: auto-load on scroll, a manual "Load More" button, or page number navigation.

#### `photos_per_page`
_(positive integer; default: `100`)_

Number of photos per page in paginated album views.

#### `photos_pagination_ui_mode`
_(enum: `infinite_scroll|load_more_button|page_navigation`; default: `infinite_scroll`)_

How photo pagination is presented: auto-load on scroll, a manual "Load More" button, or page number navigation.

#### `shared_albums_visibility_default`
_(enum: `show|separate|separate_shared_only|hide`; default: `show`)_ <span class="expert-tag">Expert</span>

How albums shared by other users appear in the gallery: inline with owned albums, in separate tabs, in tabs (direct shares only), or hidden.

#### `display_exif_data`
_(boolean; default: `1`)_ <span class="expert-tag">Expert</span>

Display EXIF data in the photo details panel. When disabled, EXIF data is not shown anywhere in the UI.

#### `enable_photo_details_always_open`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

Keep the photo details drawer open by default when entering the photo view.

#### `photo_layout_gap`
_(positive integer; default: `12`)_ <span class="expert-tag">Expert</span>

Gap between columns (in pixels) in Square, Masonry, and Grid photo layouts.

#### `photo_layout_grid_column_width`
_(positive integer; default: `250`)_ <span class="expert-tag">Expert</span>

Minimum column width (in pixels) in the Grid photo layout.

#### `photo_layout_justified_row_height`
_(positive integer; default: `320`)_ <span class="expert-tag">Expert</span>

Row height (in pixels) in the Justified photo layout.

#### `photo_layout_masonry_column_width`
_(positive integer; default: `300`)_ <span class="expert-tag">Expert</span>

Minimum column width (in pixels) in the Masonry photo layout.

#### `photo_layout_square_column_width`
_(positive integer; default: `200`)_ <span class="expert-tag">Expert</span>

Minimum column width (in pixels) in the Square photo layout.

#### `photo_thumb_info`
_(enum: `title|description`; default: `title`)_ <span class="expert-tag">Expert</span>

Information shown on photo thumbnails. When `description` is selected, the date is also hidden.

#### `photo_thumb_tags_enabled`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Show tags on photo thumbnails in the album view. Has no effect when `photo_thumb_info` is set to `description`.

#### `photo_previous_next_size`
_(enum: `small|large`; default: `small`)_ <span class="expert-tag">Expert</span>

Size of the previous/next navigation buttons in the photo view. These buttons are hidden by default and appear only when the cursor approaches the left or right edge of the screen.

#### `slideshow_enabled`
_(boolean; default: `1`)_ <span class="expert-tag">Expert</span>

Enable the slideshow functionality.

#### `disable_swipe_effect`
_(boolean; default: `0`)_

Disable the swipe animation in the photo viewer.

#### `desktop_dock_full_transparency_enabled`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

Make the top action bar fully transparent on desktop (visible only on hover).

#### `mobile_dock_full_transparency_enabled`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

Make the top action bar fully transparent on mobile (visible only on tap). Note: this affects usability on mobile.

#### `albums_infinite_scroll_threshold`
_(positive integer; default: `10`)_ <span class="expert-tag">Expert</span>

Number of viewport heights from the bottom of the page at which to trigger loading the next page of albums when using infinite scroll.

#### `photos_infinite_scroll_threshold`
_(positive integer; default: `10`)_ <span class="expert-tag">Expert</span>

Number of viewport heights from the bottom of the page at which to trigger loading the next page of photos when using infinite scroll.

#### `low_number_of_shoots_per_day`
_(positive integer; default: `10`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Shots-per-day threshold considered "low" for punch-card statistics colouring.

#### `medium_number_of_shoots_per_day`
_(positive integer; default: `50`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Shots-per-day threshold considered "medium" for punch-card statistics colouring.

#### `high_number_of_shoots_per_day`
_(positive integer; default: `100`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Shots-per-day threshold considered "high" for punch-card statistics colouring.

#### Date format settings <span class="expert-tag">Expert</span>

The following settings accept [PHP date format strings](https://www.php.net/manual/en/datetime.format.php):

| Key | Default | Used for |
|-----|---------|----------|
| `date_format_album_thumb` | `M Y` | Date shown on album thumbnails |
| `date_format_hero_created_at` | `M j, Y, g:i:s A T` | Album creation date in album details |
| `date_format_hero_min_max` | `F Y` | Date range in the album hero area |
| `date_format_photo_overlay` | `M j, Y, g:i:s A e` | Date in the photo overlay |
| `date_format_photo_thumb` | `M j, Y, g:i:s A e` | Date on photo thumbnails |
| `date_format_sidebar_taken_at` | `M j, Y, g:i:s A e` | Capture date in the photo sidebar |
| `date_format_sidebar_uploaded` | `M j, Y, g:i:s A e` | Upload date in the photo sidebar |

---

## Landing Page

Controls the optional landing/welcome page shown before entering the gallery.

#### `landing_page_enable`
_(boolean; default: `0`)_

Enable the landing page. When enabled, visitors see a full-screen welcome page before entering the gallery.

#### `landing_title`
_(string; default: `John Smith`)_

Title displayed on the landing page.

#### `landing_subtitle`
_(string; default: `Cats, Dogs & Humans Photography`)_

Subtitle displayed on the landing page.

#### `landing_background_landscape`
_(string; default: `dist/cat.webp`)_

URL of the background image shown in landscape orientation. Also used as the Open Graph image when sharing the gallery root.

#### `landing_background_landscape_mode`
_(enum: `static|photo_id|random|latest_album_cover|random_from_album`; default: `static`)_

How the landscape background is sourced: a static URL, a specific photo ID, a random public photo, the latest album cover, or a random photo from a specific album.

#### `landing_background_portrait`
_(string; default: `dist/cat.webp`)_

URL of the background image shown in portrait orientation.

#### `landing_background_portrait_mode`
_(enum: `static|photo_id|random|latest_album_cover|random_from_album`; default: `static`)_

How the portrait background is sourced (same options as landscape mode).

#### `gallery_header_enabled`
_(boolean; default: `0`)_

Show a header image on the main gallery view.

#### `gallery_header_logged_in_enabled`
_(boolean; default: `0`)_

Show the gallery header image also when a user is logged in.

#### `gallery_header`
_(string; default: empty)_

URL of the header image for the gallery view.

#### `gallery_header_bar_transparent`
_(boolean; default: `1`)_ <span class="expert-tag">Expert</span>

Make the gallery header bar transparent so the header image shows through it.

#### `gallery_header_bar_gradient`
_(boolean; default: `1`)_ <span class="expert-tag">Expert</span>

Add a gradient behind the header bar text to improve readability.

#### `site_logo`
_(string; default: empty)_

URL of a logo image for the gallery header bar. When set, replaces the site title text.

#### `landing_logo`
_(string; default: empty)_

URL of a logo image for the landing page intro. When set, replaces the landing title and subtitle text.

#### `landing_header_logo`
_(string; default: empty)_

URL of a logo image for the top-left corner of the landing page. When set, replaces the landing title and subtitle in that position.

---

## Footer

Controls the content of the page footer.

#### `footer_show_copyright`
_(boolean; default: `1`)_

Display a copyright message in the footer.

#### `site_copyright_begin`
_(positive integer; default: `2019`)_

Starting year of the copyright range.

#### `site_copyright_end`
_(positive integer; default: `2019`)_

Ending year of the copyright range.

#### `copyright_text`
_(string; default: empty)_

Custom copyright text. When set, replaces the default "© [year range] [owner]" notice.

#### `footer_additional_text`
_(string; default: empty)_ <span class="expert-tag">Expert</span>

Additional HTML text appended below the copyright notice. **This field is not sanitized — use with care.**

#### `footer_show_social_media`
_(boolean; default: `0`)_

Show social media icon links in the footer.

#### Social media URLs

| Key | Documentation |
|-----|---------------|
| `sm_facebook_url` | Facebook profile URL |
| `sm_flickr_url` | Flickr profile URL |
| `sm_instagram_url` | Instagram profile URL |
| `sm_twitter_url` | X (formerly Twitter) profile URL |
| `sm_youtube_url` | YouTube profile URL |

Set any URL to an empty string to hide the corresponding icon.

---

## Smart & Featured Albums

Configure smart albums and featured (pinned) albums.

#### `enable_unsorted`
_(boolean; default: `1`)_

Enable the _Unsorted_ smart album. Disabling this makes photos without an album invisible.

#### `enable_highlighted`
_(boolean; default: `1`)_

Enable the _Starred_ smart album.

#### `enable_recent`
_(boolean; default: `1`)_

Enable the _Recent uploads_ smart album.

#### `enable_on_this_day`
_(boolean; default: `1`)_

Enable the _On This Day_ smart album.

#### `enable_untagged`
_(boolean; default: `1`)_

Enable the _Untagged_ smart album (photos with no tags).

#### `recent_age`
_(positive integer; default: `1`)_

Maximum age (in days) of photos shown in the _Recent_ smart album.

#### `enable_smart_album_per_owner`
_(boolean; default: `0`)_

When enabled, smart albums show only photos owned by the logged-in user.

#### `SA_override_visibility`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

Smart album visibility overrides individual photo visibility, making matching photos publicly accessible regardless of their album settings.

#### `TA_override_visibility`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

Tag album visibility overrides individual photo visibility.

#### `PA_override_visibility`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

Person album visibility overrides individual photo visibility.

#### `SA_random_thumbs`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

Use random thumbnails for smart albums instead of starred/sorting order.

#### `sorting_pinned_albums_col`
_(enum: `created_at|title|description|max_taken_at|min_taken_at|title_strict|description_strict`; default: `created_at`)_

Column used for sorting featured (pinned) albums.

#### `sorting_pinned_albums_order`
_(enum: `ASC|DESC`; default: `DESC`)_

Sort direction for featured albums.

#### `deduplicate_pinned_albums`
_(boolean; default: `0`)_

Show featured albums only once on the main gallery page (deduplicated).

#### `photos_pagination_limit`
_(positive integer; default: `500`)_

Maximum number of photos per page in smart albums.

#### Star rating smart albums

| Key | Default | Description |
|-----|---------|-------------|
| `enable_unrated` | `0` | Smart album for photos with no rating |
| `enable_1_star` | `0` | Smart album for photos rated 1.0–1.9 stars |
| `enable_2_stars` | `0` | Smart album for photos rated 2.0–2.9 stars |
| `enable_3_stars` | `0` | Smart album for photos rated 3.0+ stars |
| `enable_4_stars` | `1` | Smart album for photos rated 4.0+ stars |
| `enable_5_stars` | `1` | Smart album for photos with a perfect 5.0 rating |

#### `enable_best_pictures`
_(boolean; default: `1`)_ <span class="se-tag">SE</span>

Enable the _Best Pictures_ smart album (top-rated photos).

#### `best_pictures_count`
_(positive integer; default: `100`)_ <span class="se-tag">SE</span>

Number of top-rated photos in the _Best Pictures_ album. Photos tied at the cut-off are all included.

#### `enable_my_rated_pictures`
_(boolean; default: `1`)_

Enable the _My Rated Pictures_ smart album (all photos rated by the current user).

#### `enable_my_best_pictures`
_(boolean; default: `1`)_ <span class="se-tag">SE</span>

Enable the _My Best Pictures_ smart album (top-rated photos by the current user).

#### `my_best_pictures_count`
_(positive integer; default: `50`)_ <span class="se-tag">SE</span>

Number of top-rated photos in the _My Best Pictures_ album.

---

## Image Processing

Controls how photos are processed during upload or import.

#### `thumb_2x`
_(boolean; default: `1`)_

Generate HiDPI (2×) square thumbnails.

#### `small_max_height`
_(integer; default: `360`)_

Maximum height (px) of small thumbnails used in the album view.

#### `small_max_width`
_(integer; default: `0`)_

Maximum width (px) of small thumbnails. `0` means unconstrained (height only).

#### `small_2x`
_(boolean; default: `1`)_

Generate HiDPI (2×) small thumbnails.

#### `medium_max_height`
_(integer; default: `1080`)_

Maximum height (px) of medium images used in the photo view.

#### `medium_max_width`
_(integer; default: `1920`)_

Maximum width (px) of medium images.

#### `medium_2x`
_(boolean; default: `1`)_

Generate HiDPI (2×) medium images.

#### `low_quality_image_placeholder`
_(boolean; default: `1`)_

Generate low-quality image placeholders (LQIP) for progressive loading.

#### `keep_original_untouched`
_(boolean; default: `1`)_

Keep the original file unchanged. When auto-rotation is applied, the original is preserved separately.

#### `auto_fix_orientation`
_(boolean; default: `1`)_

Automatically rotate images based on EXIF orientation data. **Note:** enabling this overwrites and recompresses original files (unless `keep_original_untouched` is also enabled).

#### `compression_quality`
_(positive integer; default: `90`)_

JPEG compression quality (1–100) used when generating thumbnails and intermediate images.

#### `editor_enabled`
_(boolean; default: `1`)_

Allow manual rotation of images via the UI editor.

#### `enable_colour_extractions`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Extract the 5 most dominant colours from each uploaded image (used for colour-based search).

#### `colour_extraction_driver`
_(enum: `league|farzai`; default: `farzai`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Algorithm used for colour extraction. `league` uses full sampling with CIEDE2000 colour distance (more accurate, slower). `farzai` uses spot sampling and k-means distance (faster).

#### `upload_chunk_size`
_(integer; default: `0`)_ <span class="expert-tag">Expert</span>

Size of upload chunks in bytes. `0` = auto-detect.

#### `upload_processing_limit`
_(integer; default: `4`)_ <span class="expert-tag">Expert</span>

Maximum number of images processed in parallel during upload.

#### `raw_download_enabled`
_(boolean; default: `0`)_

Allow users with download permissions to download the original RAW/HEIC/PSD file preserved during upload.

#### `download_archive_chunked`
_(boolean; default: `0`)_

Split large album downloads into multiple smaller ZIP files.

#### `download_archive_chunk_size`
_(positive integer; default: `300`)_

Maximum number of photos per ZIP chunk when chunked downloads are enabled.

#### `download_archive_drop_extension_enabled`
_(boolean; default: `1`)_ <span class="expert-tag">Expert</span>

Drop file extensions from titles inside ZIP archives, preventing double extensions like `image.jpg.jpg`.

#### `delete_imported`
_(boolean; default: `0`)_

Delete original files from the server after _Import from Server_.

#### `import_via_symlink`
_(boolean; default: `0`)_

Create symbolic links instead of copying files during _Import from Server_.

#### `skip_duplicates`
_(boolean; default: `0`)_

Skip photos that already exist in the gallery during import (duplicate detection by checksum).

#### `skip_duplicates_early`
_(boolean; default: `1`)_

Skip duplicates early during `sync` imports by checking photo titles in the target album (faster than checksum-based detection).

#### `sync_delete_missing_photos`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

Delete photos from Lychee that are no longer present in the synced directory. Only active when `sync_dry_run` is disabled.

#### `sync_delete_missing_albums`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

Delete albums from Lychee that are no longer present in the synced directory. Only active when `sync_dry_run` is disabled.

#### `sync_dry_run`
_(boolean; default: `1`)_ <span class="expert-tag">Expert</span>

Run the destructive parts of the `sync` command in dry-run mode. **Disable with care** — this allows the sync command to delete albums and photos from your instance.

#### `extract_zip_on_upload`
_(boolean; default: `1`)_ <span class="se-tag">SE</span>

Automatically extract ZIP files on upload and import their contents. The ZIP is deleted after successful extraction.

#### `close_upload_on_success`
_(boolean; default: `0`)_

Auto-close the upload panel when all uploads complete without errors. The panel stays open if any upload fails.

#### `folder_upload_enabled`
_(boolean; default: `1`)_

Enable folder drag-and-drop: dragging a folder onto the Albums page creates an album from the folder and uploads its contents. Sub-folders become sub-albums recursively.

#### `folder_upload_max_depth`
_(integer; default: `5`)_ <span class="expert-tag">Expert</span>

Maximum sub-folder recursion depth for folder uploads. `0` = unlimited; `1` = top-level folder only.

#### `exiftool_path`
_(string; default: empty)_ <span class="expert-tag">Expert</span>

Path to the `exiftool` binary. Leave empty to use the system default.

#### `ffmpeg_path`
_(string; default: `/usr/bin/ffmpeg`)_ <span class="expert-tag">Expert</span>

Path to the `ffmpeg` binary.

#### `ffprobe_path`
_(string; default: `/usr/bin/ffprobe`)_ <span class="expert-tag">Expert</span>

Path to the `ffprobe` binary.

#### `has_exiftool`
_(enum: `0|1|2`; default: `1`)_ <span class="expert-tag">Expert</span>

Whether exiftool processing is available (`0` = no, `1` = yes, `2` = available but disabled).

#### `has_ffmpeg`
_(enum: `0|1|2`; default: `1`)_ <span class="expert-tag">Expert</span>

Whether ffmpeg processing is available.

#### `imagick`
_(boolean; default: `1`)_ <span class="expert-tag">Expert</span>

Use ImageMagick for image processing when available. Falls back to GD if disabled or unavailable.

#### `local_takestamp_video_formats`
_(string; default: `.avi|.mov`)_

Pipe-separated list of video formats for which the local file modification time is used as the taken-at timestamp (instead of metadata).

#### `lossless_optimization`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

Apply additional lossless compression to images after thumbnail generation.

#### `prefer_available_xmp_metadata`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

Use XMP sidecar files for metadata instead of embedded EXIF when both are present.

#### `raw_formats`
_(string; default: `.tex`)_

Pipe-separated list of additional file extensions treated as raw/passthrough files (uploaded but not processed).

#### `use_last_modified_date_when_no_exif_date`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

Use the file's last-modified time as the taken-at date when EXIF data contains no creation date.

---

## Permissions

Controls public access and download rights.

#### `login_required`
_(boolean; default: `0`)_

Require users to log in to access any part of the gallery.

#### `login_required_root_only`
_(boolean; default: `1`)_

Require login only at the root gallery page. Users with a direct link to an album can still access it without logging in.

#### `grants_download`
_(boolean; default: `0`)_

Allow downloading by default (applies to cases not covered by per-album settings, such as photos in private albums shared with individual users).

#### `grants_full_photo_access`
_(boolean; default: `1`)_

Allow access to full-resolution photos by default (applies to the same cases as `grants_download`).

#### `share_button_visible`
_(boolean; default: `0`)_

Show a social-sharing button in the gallery header.

#### `unlock_password_photos_with_url_param`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

Allow the album password to be passed as a URL query parameter to auto-unlock password-protected albums.

#### `disable_thumb_download`
_(boolean; default: `1`)_ <span class="expert-tag">Expert</span>

Prevent downloading of square (200×200) thumbnails.

#### `disable_thumb2x_download`
_(boolean; default: `1`)_ <span class="expert-tag">Expert</span>

Prevent downloading of HiDPI (400×400) square thumbnails.

#### `disable_small_download`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Prevent downloading of small thumbnails.

#### `disable_small2x_download`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Prevent downloading of HiDPI small thumbnails.

#### `disable_medium_download`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Prevent downloading of medium images.

#### `disable_medium2x_download`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Prevent downloading of HiDPI medium images.

---

## Search

#### `search_public`
_(boolean; default: `0`)_

Allow anonymous users to use the search bar.

#### `search_minimum_length_required`
_(positive integer; default: `4`)_

Minimum number of characters required before a search query is triggered.

#### `search_pagination_limit`
_(positive integer; default: `300`)_

Maximum number of results shown per search page.

#### `search_photos_layout`
_(enum: `square|justified|masonry|grid`; default: `square`)_

Photo layout used on the search results page.

#### `search_colour_distance`
_(integer; default: `30`)_ <span class="expert-tag">Expert</span>

Maximum Manhattan RGB distance for palette colour matching: `|R−R₀| + |G−G₀| + |B−B₀| ≤ this value`.

---

## Timeline

Controls the timeline view that shows photos and albums grouped by date.

#### `timeline_page_enabled`
_(boolean; default: `1`)_

Enable the Timeline page.

#### `timeline_photos_layout`
_(enum: `square|justified|masonry|grid`; default: `square`)_

Photo layout on the Timeline page.

#### `timeline_photos_order`
_(enum: `taken_at|created_at`; default: `taken_at`)_

Whether photos on the Timeline are ordered by capture date or upload date.

#### `timeline_photos_pagination_limit`
_(positive integer; default: `200`)_

Number of photos per page on the Timeline.

#### `timeline_left_border_enabled`
_(boolean; default: `1`)_ <span class="se-tag">SE</span>

Show the vertical left-border line on timelines.

#### `timeline_albums_enabled`
_(boolean; default: `1`)_

Globally enable album timelines within each album. Can also be toggled per album.

#### `timeline_albums_public`
_(boolean; default: `0`)_

Show the album timeline to anonymous users.

#### `timeline_albums_granularity`
_(enum: `year|month|day`; default: `year`)_ <span class="se-tag">SE</span>

Grouping granularity for the album timeline.

#### `timeline_albums_root_enabled`
_(boolean; default: `1`)_

Enable the timeline view for albums at the root level.

#### `timeline_photos_enabled`
_(boolean; default: `1`)_

Globally enable photo timelines within each album. Can also be toggled per album.

#### `timeline_photos_public`
_(boolean; default: `0`)_

Allow anonymous users to access the photo timeline.

#### `timeline_photos_granularity`
_(enum: `year|month|day|hour`; default: `day`)_ <span class="se-tag">SE</span>

Grouping granularity for the photo timeline.

#### Timeline date format settings <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Accepts [PHP date format strings](https://www.php.net/manual/en/datetime.format.php):

| Key | Default | Used for |
|-----|---------|----------|
| `timeline_album_date_format_year` | `Y` | Year-level album grouping header |
| `timeline_album_date_format_month` | `M Y` | Month-level album grouping header |
| `timeline_album_date_format_day` | `j M` | Day-level album grouping header |
| `timeline_photo_date_format_year` | `Y` | Year-level photo grouping header |
| `timeline_photo_date_format_month` | `M Y` | Month-level photo grouping header |
| `timeline_photo_date_format_day` | `j M Y` | Day-level photo grouping header |
| `timeline_photo_date_format_hour` | `g:i` | Hour-level photo grouping header |
| `timeline_quick_access_date_format_year` | `Y` | Year quick-access label on the Timeline page |
| `timeline_quick_access_date_format_month` | `M` | Month quick-access label |
| `timeline_quick_access_date_format_day` | `j M` | Day quick-access label |
| `timeline_quick_access_date_format_hour` | `h M, g:i` | Hour quick-access label |

---

## Frame

Configure the photo-frame / slideshow mode accessible via `/frame`.

#### `mod_frame_enabled`
_(boolean; default: `1`)_

Enable the Frame mode. The button is only visible when the access condition is satisfied.

#### `random_album_id`
_(string; default: `highlighted`)_

Album ID used as the source for the Frame. Leave empty to use all searchable photos.

#### `mod_frame_refresh`
_(integer; default: `30`)_

Seconds between photo changes in Frame mode.

---

## Map / GPS

Controls map and GPS coordinate features.

#### `map_display`
_(boolean; default: `0`)_

Enable map views when photos have GPS coordinates.

#### `map_display_public`
_(boolean; default: `0`)_

Allow anonymous users to access map views.

#### `map_display_direction`
_(boolean; default: `1`)_

Show the camera direction indicator on the map when GPS direction data is available.

#### `map_include_subalbums`
_(boolean; default: `0`)_

Include photos from sub-albums on the map view.

#### `map_provider`
_(map_provider; default: `OpenStreetMap.org`)_

Map tile provider. All providers use OpenStreetMap data. Options include `Wikimedia`, `OpenStreetMap.org`, `OpenStreetMap.de`, `OpenStreetMap.fr`, and `RRZE`.

#### `location_decoding`
_(boolean; default: `0`)_

Decode GPS coordinates into human-readable location names using a reverse-geocoding service.

#### `location_decoding_timeout`
_(integer; default: `30`)_ <span class="expert-tag">Expert</span>

Timeout in seconds for reverse-geocoding queries.

#### `location_show`
_(boolean; default: `1`)_

Show the decoded location name in the photo details sidebar (only affects the decoded location, not raw coordinates).

#### `location_show_public`
_(boolean; default: `0`)_

Show decoded location names to anonymous users.

#### `gps_coordinate_display`
_(boolean; default: `1`)_

Display raw latitude/longitude coordinates in the photo details. Disabling this hides GPS coordinates from all users.

#### `gps_coordinate_display_public`
_(boolean; default: `0`)_

Show GPS coordinates to anonymous users.

---

## RSS

#### `rss_enable`
_(boolean; default: `0`)_

Enable the RSS feed at `/rss`.

#### `rss_max_items`
_(positive integer; default: `100`)_

Maximum number of items in the RSS feed.

#### `rss_recent_days`
_(positive integer; default: `7`)_

Include photos uploaded within the last X days in the RSS feed.

---

## Sensitive Albums

Controls how albums marked as sensitive (NSFW) are handled.

#### `nsfw_visible`
_(boolean; default: `1`)_

Show sensitive albums by default (no blurring or hiding).

#### `nsfw_warning`
_(boolean; default: `0`)_

Display a warning the first time a sensitive album is opened.

#### `nsfw_blur`
_(boolean; default: `0`)_

Blur the cover thumbnail of sensitive albums.

#### `nsfw_banner_blur_backdrop`
_(boolean; default: `0`)_

Use a blurred backdrop for the sensitive-album warning instead of a solid dark-red overlay.

#### `nsfw_banner_override`
_(string; default: empty)_ <span class="expert-tag">Expert</span>

Custom HTML warning text for sensitive albums. **This field is not sanitized — use with care.**

#### `nsfw_warning_admin`
_(boolean; default: `0`)_

Show the sensitive-album warning to logged-in users as well.

#### `flow_blur_nsfw_enabled`
_(boolean; default: `1`)_

Blur sensitive album photos in the Flow view. Users can un-blur by clicking on the album.

#### Sensitive content exclusions

The following settings hide sensitive album content from specific features (all default to `1`):

| Key | Description |
|-----|-------------|
| `hide_nsfw_in_flow` | Hide sensitive albums from the Flow view |
| `hide_nsfw_in_frame` | Hide sensitive photos from Frame mode |
| `hide_nsfw_in_map` | Hide sensitive photos from Map views |
| `hide_nsfw_in_person_albums` | Hide sensitive photos from Person Albums |
| `hide_nsfw_in_rss` | Hide sensitive photos from the RSS feed |
| `hide_nsfw_in_search` | Hide sensitive photos from Search results |
| `hide_nsfw_in_smart_albums` | Hide sensitive photos from Smart Albums |
| `hide_nsfw_in_tag_albums` | Hide sensitive photos from Tag Albums |
| `hide_nsfw_in_tag_listing` | Hide sensitive photos from tag photo listings |
| `hide_nsfw_in_timeline` | Hide sensitive photos from the Timeline |

---

## Back Home

Add a configurable "back" button in the gallery header, useful for embedding Lychee in a larger site.

#### `back_button_enabled`
_(boolean; default: `0`)_

Enable the back/home button in the gallery.

#### `back_button_text`
_(string; default: `Return to Home`)_

Label text for the back button.

#### `back_button_url`
_(string; default: `/`)_

URL the back button links to.

---

## Pro <span class="se-tag">SE</span>

Advanced engagement features requiring Lychee SE.

#### `client_side_favourite_enabled`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Allow visitors to mark photos as their favourites. Favourites are stored in the browser's local storage.

#### `metrics_enabled`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Enable view/share/download statistics on photos and albums. When enabled, anonymous users are counted.

#### `metrics_logged_in_users_enabed`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Count logged-in users in statistics (admin users are excluded).

#### `metrics_access`
_(enum: `admin|owner|logged-in users|public`; default: `admin`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Who can see album/photo statistics.

#### `live_metrics_enabled`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Enable live metrics providing an activity history of your gallery.

#### `live_metrics_access`
_(enum: `admin|logged-in users`; default: `admin`)_ <span class="se-tag">SE</span>

Who can view live metrics.

#### `live_metrics_max_time`
_(positive integer; default: `30`)_ <span class="se-tag">SE</span>

Maximum retention period for live metrics data, in days.

---

## Privacy Options

Settings to restrict image URL access and protect photo metadata.

#### `temporary_image_link_enabled`
_(boolean; default: `0`)_

Serve all images via signed (temporary) URLs to prevent hotlinking and unauthorized direct access.

#### `temporary_image_link_when_logged_in`
_(boolean; default: `0`)_

Use temporary image links for logged-in users as well.

#### `temporary_image_link_when_admin`
_(boolean; default: `0`)_

Use temporary image links for admin users as well.

#### `temporary_image_link_life_in_seconds`
_(positive integer; default: `86400`)_ <span class="expert-tag">Expert</span>

Lifetime of temporary image links in seconds (default 24 hours). If you use request caching, set this higher than your cache expiration time.

#### `secure_image_link_enabled`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Encrypt image links so that the file paths cannot be guessed.

#### `exif_disabled_for_all`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Disable the details and overlay panels in the front end. Note: this does not remove the data from API responses.

#### `file_name_hidden`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Hide photo titles from anonymous users. Logged-in users can still see titles.

---

## Flow <span class="se-tag">SE</span>

The Flow module displays albums as a social-media-style feed. Only albums containing photos are shown; albums with only child albums are excluded.

#### `flow_enabled`
_(boolean; default: `1`)_

Enable the Flow view.

#### `flow_public`
_(boolean; default: `0`)_

Allow anonymous users to access the Flow.

#### `flow_strategy`
_(enum: `auto|opt-in`; default: `auto`)_ <span class="se-tag">SE</span>

How albums are included in the Flow: `auto` includes all albums; `opt-in` includes only albums with Flow explicitly enabled.

#### `flow_base`
_(string; default: empty)_ <span class="expert-tag">Expert</span>

Album ID used as the root for the Flow. Leave empty to use the gallery root.

#### `flow_include_sub_albums`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Include all descendants of the base album, not just direct children.

#### `flow_include_photos_from_children`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

When an album has no photos but has children, display photos from those children. **Not recommended** — can cause memory exhaustion and slowdowns.

#### `flow_max_items`
_(positive integer; default: `10`)_ <span class="expert-tag">Expert</span>

Number of albums loaded per Flow page. Lower = more requests; higher = more memory usage.

#### `flow_open_album_on_click`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Navigate to the album when clicking a Flow card (instead of opening the photo viewer directly).

#### `flow_display_open_album_button`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Show an "Open Album" button on each Flow card.

#### `flow_image_header_enabled`
_(boolean; default: `1`)_ <span class="se-tag">SE</span>

Show an image header at the top of each Flow card featuring the album cover.

#### `flow_image_header_cover`
_(enum: `cover|fit`; default: `cover`)_ <span class="se-tag">SE</span>

How the header image fills the card header: `cover` crops to fill; `fit` scales to fit.

#### `flow_image_header_height`
_(positive integer; default: `24`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Height of the image header in `rem`.

#### `flow_carousel_enabled`
_(boolean; default: `1`)_ <span class="se-tag">SE</span>

Show a photo carousel below the image header on each Flow card.

#### `flow_carousel_height`
_(positive integer; default: `6`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Height of the photo carousel in `rem`.

#### `flow_highlight_first_picture`
_(boolean; default: `1`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Use the first photo in the album as the main image instead of the album cover.

#### `flow_min_max_enabled`
_(boolean; default: `1`)_ <span class="se-tag">SE</span>

Display the min/max date range of the album's photos on Flow cards.

#### `flow_min_max_order`
_(enum: `older_younger|younger_older`; default: `older_younger`)_ <span class="expert-tag">Expert</span>

Which date (older or newer) appears first in the Flow min/max date display.

#### `flow_display_statistics`
_(boolean; default: `1`)_ <span class="se-tag">SE</span>

Show view, share, and download counts on Flow cards.

#### `flow_compact_mode_enabled`
_(boolean; default: `1`)_ <span class="se-tag">SE</span>

Clamp the description to 3 lines and hide extra information (photo count, child count). A "Show more" button expands the card.

#### Flow date format settings <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Accepts [PHP date format strings](https://www.php.net/manual/en/datetime.format.php):

| Key | Default | Used for |
|-----|---------|----------|
| `date_format_flow_published` | `M j, Y, g:i:s A e` | Album published date shown on Flow cards |
| `date_format_flow_min_max` | `F Y` | Min/max date range on Flow cards |

---

## Watermarker <span class="se-tag">SE</span>

Automatically apply a watermark image to uploaded photos. **Warning:** enabling watermarking approximately doubles file-storage usage on your server.

The watermark image is specified by its photo ID (the 24-character identifier visible in the photo's URL). A PNG with transparent background is recommended.

#### `watermark_enabled`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Enable watermarking of uploaded photos.

#### `watermark_photo_id`
_(string; default: empty)_ <span class="se-tag">SE</span>

Photo ID (24-character sequence) of the image to use as the watermark.

#### `watermark_public`
_(boolean; default: `1`)_ <span class="se-tag">SE</span>

Show watermarked versions to anonymous users.

#### `watermark_logged_in_users_enabled`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Show watermarked versions to logged-in users.

#### `watermark_original`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Also apply the watermark to the original photo (not just intermediate sizes).

#### `watermark_size`
_(positive integer; default: `50`)_ <span class="se-tag">SE</span>

Watermark size as a percentage of the image area (1–100%).

#### `watermark_opacity`
_(positive integer; default: `75`)_ <span class="se-tag">SE</span>

Watermark opacity (1–100%). Values below 25 are nearly invisible.

#### `watermark_position`
_(enum: `top-left|top|top-right|left|center|right|bottom-left|bottom|bottom-right`; default: `center`)_ <span class="se-tag">SE</span>

Position of the watermark on the image.

#### `watermark_shift_type`
_(enum: `relative|absolute`; default: `relative`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Whether the position shift is relative to image size or in absolute pixels.

#### `watermark_shift_x` / `watermark_shift_x_direction`
_(integer / enum: `left|right`; defaults: `0` / `right`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Horizontal offset and direction of the watermark from its anchor position.

#### `watermark_shift_y` / `watermark_shift_y_direction`
_(integer / enum: `up|down`; defaults: `0` / `up`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Vertical offset and direction of the watermark from its anchor position.

#### `watermark_random_path`
_(boolean; default: `1`)_ <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Store watermarked images at a random path (harder to guess). When disabled, a suffix is appended to the original path.

#### `watermark_optout_disabled`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Prevent users from opting out of watermarking during upload. All photos will be watermarked according to global settings.

---

## Renamer <span class="se-tag">SE</span>

Automatically rename photos and albums on upload or sync import based on configurable rules.

**Note:** renaming is likely to interfere with fast duplicate detection for items renamed via sync.

#### `renamer_enabled`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Enable the renamer module.

#### `renamer_enforced`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Apply the instance-owner's renaming rules regardless of individual user settings.

#### `renamer_enforced_before`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Apply owner rules before user rules.

#### `renamer_enforced_after`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Apply owner rules after user rules.

#### `renamer_photo_title_enabled`
_(boolean; default: `1`)_ <span class="se-tag">SE</span>

Apply renamer rules to photo titles on upload/import.

#### `renamer_album_title_enabled`
_(boolean; default: `1`)_ <span class="se-tag">SE</span>

Apply renamer rules to album titles on creation.

---

## Photo Star Rating

Enable users to rate photos on a 1–5 star scale.

#### `rating_enabled`
_(boolean; default: `1`)_

Master switch for the photo rating feature.

#### `rating_public`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Allow all users (including anonymous visitors) to see photo ratings.

#### `rating_show_only_when_user_rated`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Only display ratings after the current user has submitted their own rating.

#### `rating_show_avg_in_details`
_(boolean; default: `1`)_

Show the average rating (and rating count) in the photo details sidebar instead of the user's personal rating.

#### `rating_photo_view_mode`
_(enum: `always|hover|never`; default: `hover`)_ <span class="se-tag">SE</span>

When to show the rating overlay in the full photo view.

#### `rating_show_avg_in_photo_view`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Show the average rating in the full photo view instead of the user's personal rating.

#### `rating_album_view_mode`
_(enum: `always|hover|never`; default: `hover`)_ <span class="se-tag">SE</span>

When to show the rating on photo thumbnails in the album view.

#### `rating_show_avg_in_album_view`
_(boolean; default: `1`)_

Show the average rating on photo thumbnails instead of the user's personal rating.

---

## Contact <span class="se-tag">SE</span>

Manage a contact form that visitors can use to send messages.

#### `contact_form_enabled`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Enable the contact form on the website.

#### `contact_form_security_question`
_(string; default: empty)_ <span class="se-tag">SE</span>

Optional security question shown on the contact form. Leave empty to skip.

#### `contact_form_security_answer`
_(string; default: empty)_ <span class="se-tag">SE</span>

Expected answer to the security question (case-insensitive). Ignored when the question is empty.

#### `contact_form_custom_consent_required`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Require users to check a consent checkbox before submitting the contact form (e.g. for GDPR compliance).

---

## AI Vision

Integrates with an external AI service for facial recognition, person management, and automatic face scanning.

#### `ai_vision_enabled`
_(boolean; default: `0`)_

Master switch for the AI Vision subsystem. When disabled, all AI Vision endpoints and UI elements are inactive.

#### `ai_vision_face_enabled`
_(boolean; default: `0`)_

Enable facial recognition. Requires `ai_vision_enabled = 1`. When disabled, face detection endpoints, People pages, and auto-scan on upload are inactive.

#### `ai_vision_face_permission_mode`
_(enum: `public|private|privacy-preserving|restricted`; default: `restricted`)_

Controls who can view person records, face overlays, and manage faces.

#### `ai_vision_face_overlay_enabled`
_(boolean; default: `1`)_

Show face bounding-box overlays on photos. When disabled, no face overlays are shown anywhere in the UI.

#### `ai_vision_face_overlay_default_visibility`
_(enum: `visible|hidden`; default: `visible`)_ <span class="expert-tag">Expert</span>

Whether face overlays are visible or hidden by default when a photo is opened. Users can toggle with the `P` key.

#### `ai_vision_face_recognition_warning`
_(boolean; default: `1`)_

Display a legal warning about facial recognition on the Face Clusters and Face Maintenance pages.

#### `ai_vision_face_selfie_confidence_threshold`
_(string/float; default: `0.8`)_ <span class="expert-tag">Expert</span>

Minimum confidence score (0.0–1.0) required to automatically link a person via selfie upload.

#### `ai_vision_face_person_is_searchable_default`
_(boolean; default: `1`)_ <span class="expert-tag">Expert</span>

Default searchability flag when a new Person record is created.

#### `ai_vision_face_allow_user_claim`
_(boolean; default: `1`)_ <span class="expert-tag">Expert</span>

Allow regular users to claim a Person record to link it to their account. Admins can always claim/unclaim.

#### `ai_vision_nsfw_enabled`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Enable automatic NSFW classification of uploaded photos via the external AI service.

#### `ai_vision_nsfw_preset`
_(enum: `default|strict|moderation|nude_female|permissive|social_media`; default: `default`)_ <span class="se-tag">SE</span>

Detection preset controlling NSFW classifier sensitivity and which labels trigger each action.

#### NSFW action settings <span class="se-tag">SE</span>

These settings control what happens when a block-level NSFW finding is detected, per user trust level:

| Key | Options | Default | Applied to |
|-----|---------|---------|------------|
| `ai_vision_nsfw_check_block_action` | `block\|moderate` | `block` | Check-level users |
| `ai_vision_nsfw_monitor_block_action` | `block\|moderate` | `moderate` | Monitor-level users |
| `ai_vision_nsfw_trust_but_verify_block_action` | `block\|moderate` | `moderate` | Trust-but-verify users |
| `ai_vision_nsfw_trust_block_action` | `block\|moderate\|approve` | `approve` | Trusted users |

`block` permanently deletes the photo; `moderate` holds it for admin review; `approve` logs the finding but takes no action.

#### `ai_vision_nsfw_sensitive_album_action`
_(enum: `mark_album|nothing`; default: `mark_album`)_ <span class="se-tag">SE</span>

Whether a sensitive-tier NSFW finding causes the photo's album(s) to be marked as sensitive.

#### `ai_vision_nsfw_sensitive_no_album_action`
_(enum: `skip|moderate`; default: `skip`)_ <span class="se-tag">SE</span>

Fallback when a sensitive finding fires on an unsorted photo with no album. `skip` logs a warning; `moderate` holds the photo for review.

#### `ai_vision_nsfw_scan_trusted_users`
_(boolean; default: `0`)_ <span class="se-tag">SE</span>

Also scan photos uploaded by Trusted users for NSFW content.

#### NSFW hide-on-scan settings <span class="expert-tag">Expert</span> <span class="se-tag">SE</span>

Temporarily hide photos while the NSFW scan is in progress. If the classifier is unavailable, the photo remains hidden until manually approved.

| Key | Default | Applied to |
|-----|---------|------------|
| `ai_vision_nsfw_monitor_hide_on_scan` | `0` | Monitor-level user uploads |
| `ai_vision_nsfw_trust_but_verify_hide_on_scan` | `0` | Trust-but-verify user uploads |
| `ai_vision_nsfw_trust_hide_on_scan` | `0` | Trusted user uploads |

---

## Gestures

Configure touch and scroll gesture behaviour for photo navigation.

#### `is_scroll_to_navigate_photos_enabled`
_(boolean; default: `1`)_

Navigate between photos by scrolling with the mouse wheel in the photo view.

#### `is_swipe_vertically_to_go_back_enabled`
_(boolean; default: `1`)_

Swipe vertically on a photo to return to the album view.

---

## Users Management

#### `allow_username_change`
_(boolean; default: `1`)_

Allow users to change their own username.

#### `user_registration_enabled`
_(boolean; default: `0`)_

Allow new users to self-register. When disabled, only admins can create accounts.

#### `default_user_quota`
_(integer; default: `0`)_ <span class="se-tag">SE</span>

Default storage quota for new users in KB. Set to `0` to disable quota enforcement.

#### `user_invitation_ttl`
_(positive integer; default: `7`)_ <span class="expert-tag">Expert</span>

Maximum lifetime of invitation links in days. **Note:** invitation links cannot be revoked once issued.

#### `default_user_trust_level`
_(enum: `check|monitor|trust_but_verify|trusted`; default: `trusted`)_

Default upload trust level assigned to newly created users. `check` = uploads require admin approval; `trusted` = uploads are immediately public.

#### `guest_upload_trust_level`
_(enum: `check|monitor|trust_but_verify|trusted`; default: `check`)_ <span class="se-tag">SE</span>

Upload trust level for anonymous (guest) uploads.

#### `grant_new_user_modification_rights`
_(boolean; default: `0`)_

Allow newly created users to edit their own profile.

#### `grant_new_user_upload_rights`
_(boolean; default: `0`)_

Allow newly created users to upload content.

#### `oauth_create_user_on_first_attempt`
_(boolean; default: `0`)_

Automatically create a user account on first OAuth login if no matching account exists.

---

## Admin

Low-level administrative and maintenance settings.

#### `version`
_(integer; default: `070604`)_ <span class="expert-tag">Expert</span>

Internal Lychee database schema version. **Do not change this.**

#### `dropbox_key`
_(string; default: `disabled`)_

Dropbox API key for the _Import from Dropbox_ feature. Set to `disabled` to mark the feature as unavailable.

#### `check_for_updates`
_(boolean; default: `0`)_

Periodically check GitHub for new Lychee releases and display a notification when one is available.

#### `update_check_every_days`
_(positive integer; default: `3`)_

How often (in days) to check for updates.

#### `allow_online_git_pull`
_(boolean; default: `1`)_ <span class="expert-tag">Expert</span>

Allow updates to be triggered via the web interface using `git pull`.

#### `apply_composer_update`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

Run `composer update` automatically when updating Lychee via the web interface.

#### `hide_version_number`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

Hide the Lychee version number in the login dialog and About screen.

#### `show_keybinding_help_button`
_(boolean; default: `1`)_

Show the keyboard shortcut help button in the gallery header.

#### `show_keybinding_help_popup`
_(boolean; default: `1`)_

Display the keyboard shortcut help popup automatically on login.

#### `owner_id`
_(admin_user; default: `1`)_ <span class="expert-tag">Expert</span>

User ID of the installation owner. **Changing this allows another admin to take over the server.**

#### `zip64`
_(boolean; default: `1`)_ <span class="expert-tag">Expert</span>

Use the Zip64 archive format for downloads (supports files >4 GB and >64k entries). Disable only if your users' unzip tools don't support Zip64.

#### `zip_deflate_level`
_(enum: `-1|0|1|2|3|4|5|6|7|8|9`; default: `6`)_ <span class="expert-tag">Expert</span>

ZIP compression level. `-1` = no compression (STORE method); `0` = DEFLATE with no compression; `1`–`9` = increasing compression (slower but smaller).

#### Import via URL security settings <span class="expert-tag">Expert</span>

These settings guard against Server-Side Request Forgery (SSRF) when using the _Import via URL_ feature. All default to enabled (`1`) and should only be disabled for specific, trusted environments:

| Key | Default | Description |
|-----|---------|-------------|
| `import_via_url_forbidden_localhost` | `1` | Block requests to localhost |
| `import_via_url_forbidden_local_ip` | `1` | Block requests to private/internal IP ranges |
| `import_via_url_require_https` | `1` | Require HTTPS for import URLs |
| `import_via_url_forbidden_ports` | `1` | Restrict to ports 80 and 443 only |
| `import_via_url_block_redirect` | `1` | Do not follow HTTP redirects |

#### `enable_propagate_unlock_option`
_(boolean; default: `0`)_ <span class="expert-tag">Expert</span>

When unlocking a password-protected album, also unlock all other albums that share the same password. **Note:** this can expose content unintentionally if multiple users share a password.

#### `default_all_settings`
_(boolean; default: `0`)_

Show all settings on a single page by default (instead of grouped sections).

#### `default_expert_settings`
_(boolean; default: `0`)_

Enable expert mode in settings by default.

#### `default_old_settings`
_(boolean; default: `0`)_

Use the legacy text-input settings view by default.

#### `disable_recursive_permission_check`
_(boolean; default: `1`)_

Disable the recursive permission check on the Diagnostics page to avoid slowdowns on large libraries.

#### `log_max_num_line`
_(positive integer; default: `1000`)_ <span class="expert-tag">Expert</span>

Maximum number of log lines displayed on the Logs page.

#### `maintenance_processing_limit`
_(positive integer; default: `5000`)_

Maximum number of operations processed in a single maintenance run. Lower values reduce the risk of timeouts on large libraries.
