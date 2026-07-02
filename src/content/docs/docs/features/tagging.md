---
title: Tagging
description: Organize photos with tags for easy filtering and smart album creation.
sidebar:
  order: 3
---

Tags provide a flexible way to categorize and find photos across your entire library.

:::note
Tags are shared, global entities — if two users both tag a photo `car`, they're using the same underlying tag. Management actions (rename, merge, delete) only ever touch **your own** photos; other users' photos keep the tag untouched, unless you're an admin, in which case they apply gallery-wide. A tag is only fully removed once no photo anywhere references it anymore.
:::

## Tag Management

Any user with upload rights (not just admins) can manage tags from the Tag Management view:

- **Rename tags** — internally this finds (or creates) a tag with the new name and migrates your photos to it, then removes the old name from your photos. If another user still has photos under the old name, their tag is left alone.
- **Merge tags** — combine one tag into another; your photos (and any of your [Tag Albums](#tag-albums)) referencing the source tag are moved to the destination tag.
- **Delete tags** — remove a tag from your own photos. The tag itself disappears once no one's photos reference it anymore.
- **Tag management view** — lists every tag with a photo count. As a non-admin, the count and the tag's photo listing only ever reflect **your own** photos, even though the tag name may be shared with other users.

## Using Tags

- **Tag descriptions** — besides a name, a tag can also have a description.
- **Photo listing per tag** — view all of your own photos under a specific tag (admins see everyone's).
- **Auto-completion** — the tag input suggests existing tags (with their photo counts) as you type. When tagging a photo, you can also add a brand-new tag by typing a name that doesn't exist yet; when picking tags to build a Tag Album, only existing tags are offered.
- **Bulk tagging** — apply tags to multiple selected photos at once, either adding them alongside existing tags or overriding (replacing) whatever tags those photos already had.

## Tag Albums

Tag Albums are dynamic, tag-driven smart albums: pick one or more tags and a match mode, and every photo carrying **any** of them (OR) or **all** of them (AND) is included automatically — no manual sorting required. Like other smart albums, they re-evaluate live: tag or re-tag a photo and matching Tag Albums update immediately. See [Smart Albums](/docs/features/smart-albums/#user-created-smart-albums) for how they compare to the built-in smart albums, and the `TA_override_visibility` setting below for making their contents visible independently of each photo's own visibility.

## Settings

| Setting                        | Description                                                                                   | Default |
|-----------------------------------|-----------------------------------------------------------------------------------------------------|-----------|
| `TA_override_visibility`       | Tag Album visibility overrides individual photo visibility, making matching photos publicly accessible regardless of their own settings. | off |
| `hide_nsfw_in_tag_albums`      | Hide sensitive photos from Tag Albums.                                                        | on      |
| `hide_nsfw_in_tag_listing`     | Hide sensitive photos from the per-tag photo listing.                                          | on      |
| `photo_thumb_tags_enabled` <span class="se-tag">SE</span> | Show tags on photo thumbnails in the album view. Has no effect when `photo_thumb_info` is set to `description`. | off |

The NSFW-related settings live under [Sensitive Albums](/docs/getting-started/settings/#sensitive-albums); `TA_override_visibility` and `photo_thumb_tags_enabled` live under [Smart & Featured Albums](/docs/getting-started/settings/#smart--featured-albums) and [Gallery](/docs/getting-started/settings/#gallery) respectively.

## Supporter Edition Features

With the [Supporter Edition](/docs/se/overview/):

- **Display tags on album view** — show tags directly on photo thumbnails in the album grid, via `photo_thumb_tags_enabled`.
