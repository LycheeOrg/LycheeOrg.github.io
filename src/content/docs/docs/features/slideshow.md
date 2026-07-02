---
title: Slideshow
description: View photos in fullscreen slideshow mode with navigation.
sidebar:
  order: 7
---

Lychee includes a built-in slideshow mode that auto-advances through a set of photos, with a brief fade-to-black transition between each one.

## How it works

- Photos advance automatically every `slideshow_timeout` seconds (default: `5`).
- Reaching the last photo loops back to the first (and vice versa) if `photos_wraparound` is enabled — otherwise the slideshow simply stops there.
- Videos are not skipped: the slideshow waits for a video to finish playing before advancing, rather than switching after the usual timeout.
  :::caution
  This wait relies on the video actually starting to play. If `autoplay_enabled` is turned off, a video reached during a slideshow will never autoplay and therefore never fire its "ended" event — the slideshow will appear to hang on that video until you manually skip past it.
  :::
- You can still navigate manually with the left/right arrow keys (see [Keyboard Shortcuts](/docs/usage/keyboard/)) while a slideshow is running; doing so shows that photo immediately and restarts the auto-advance timer from there.

## Starting a slideshow

A "Play" button starts the slideshow wherever you're viewing a set of photos: from an album's header, from within the photo viewer's toolbar, or from Tag results, Search results, the Timeline, or a Person's photos. The toolbar and other UI chrome automatically fade out once the slideshow is running (reappearing on hover on larger screens) to keep the view uncluttered; opening the toolbar and pressing the button again stops the slideshow.

## Settings

| Setting               | Description                                                                 | Default |
|--------------------------|-----------------------------------------------------------------------------------|-----------|
| `slideshow_enabled`   | Master toggle for the slideshow "Play" button.                              | on      |
| `slideshow_timeout`   | Seconds between photos while a slideshow is running.                       | `5`     |
| `photos_wraparound`   | Loop back to the first photo after the last one (and vice versa).          | on      |
| `autoplay_enabled`    | Set the `autoplay` attribute on video elements — see the caution above; disabling it can stall slideshows on video photos. | on      |
