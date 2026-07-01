---
title: Photos
description: Upload, manage, and view photos in Lychee.
sidebar:
  order: 2
---

Lychee supports uploading and managing photos in all major image formats, as well as video files.

## Supported Formats

**Images:** `jpg`, `jpeg`, `png`, `gif`, `webp`

**Videos:** `ogv`, `mp4`, `mpg`, `webm`, `mov`, `m4v`, `avi`, `wmv`

## Uploading

Photos can be uploaded via:

- **Drag and drop** — drop files directly into the browser
- **Upload button** — click the upload button in the top bar
- **CLI import** — use `php artisan lychee:sync /path/to/import` for batch imports
- **Chunk upload** — large files are automatically split into manageable chunks

## Photo Features

- **Full size and variants** — original files are preserved with optimized variants generated
- **Auto rotation** — photos are automatically rotated based on EXIF orientation data
- **EXIF data decoding** — metadata is extracted and displayed
- **GPS localization** — location data is parsed and shown on the map
- **Slideshow** — view photos in a fullscreen slideshow with navigation
- **Rating** — rate photos from 1 to 5 stars
- **Hotlink protection** — prevent unauthorized embedding of your images

## Photo Management

- Move photos between albums
- Copy photos to multiple albums
- Bulk select and manage multiple photos at once
- Edit titles and descriptions
- Set or modify photo dates
- Tag photos for organization

## Downloading

Individual photos or selections can be downloaded at their original resolution. Albums support ZIP downloads.
