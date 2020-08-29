<style>
    .docs_main h4 a:before {
    content: "#";
    font-weight: 400;
    margin-left: -25px;
    position: absolute;
    font-size: 20px;
    color: #ff2d20;
    opacity: .6;
}
</style>

## Background

Virtually all Lychee settings are stored in the database, alongside the metadata of the images and albums. While all the settings can be changed using the web browser, some of them are featured in an easy-to-use high-level GUI whereas others require the use of a more textual, lower-level interface.

Settings are accessible to the administrator after logging in by clicking on the cogwheel icon in the top-left corner and selecting _Settings_ from the menu that pops up.

## Basic Settings

The following settings can be changed via the easy-to-use GUI.

### Login

The text input fields at the top of the page can be used to change the username and password of the current user.  These settings are available for non-administrator users as well, provided that their account is not restricted.  Current username and password must be provided for verification (with the exception of the administrator, who does not need to provide the username).

### Sorting

Changes the order in which albums/subalbums and photos are displayed.

Albums can be sorted by their _Creation Time_, _Title_, _Description_, _Public_ status, and the earliest and latest _Take Date_ of the photos inside the album.

Photos can be sorted by their _Upload Time_, _Take Date_ (extracted from the metadata inside the file such as EXIF), _Title_ (which defaults to the file name), _Description_, _Public_ status, _Star_ (favorite) status, and _Photo Format_.

Order can be either _Ascending_ or _Descending_.

Textual fields (_Title_, _Description_) are sorted case-insensitively and using natural ordering (`9` precedes `10`, etc.).

### Dropbox Key

This key is required to use the _Import from Dropbox_ feature of Lychee. You can get your personal drop-ins app key from the [Dropbox website](https://www.dropbox.com/developers/apps/create).

### Language

Changes the language of the Lychee user interface.

### License

Sets the license of any _subsequently uploaded or imported_ photos.  [Need help choosing?](https://creativecommons.org/choose/)

### Layout

Selects the layout of the photos inside the albums. Available options include:
* _Square thumbnails_: The photos will be displayed as square thumbnails cropped from the center of each original photo, laid out in a uniform grid.
* _With aspect, justified_: The photos will be displayed as thumbnails that preserve the originals' aspect ratio; each row will be scaled up or down to ensure that the photos are justified to both margins.
* _With aspect, unjustified_: The photos will be displayed as thumbnails that preserve the originals' aspect ratio; all photos will have a uniform height, therefore the rows will not be justified to the right margin.

Note: the albums/subalbums are always laid out using the _Square thumbnails_ layout.

### Public search

Determines whether the search bar is available when nobody is logged in (in the public mode).

### Overlay

Determines if an overlay with metadata is displayed at the bottom of the screen in the photo view. The overlay can display the following data:
* _Photo EXIF data_: shutter speed, aperture value, ISO value, focal length, and lens used
* _Photo description_
* _Photo date taken_

Note that these settings determine the defaults but the person viewing the gallery is free to override them. The overlay can be toggled on/off by clicking on the image in the photo view, and the data displayed can be changed using the `o` [keyboard shortcut](Keyboard-Shortcuts).

### Maps

Determines the availability of the standalone map view as well as the small map preview in the info sidebar in the photo view, used for displaying the location where the photos were taken.  Maps can be enabled just for the logged-in users or also in the public mode.  The standalone map view can display photos from the current album only or also including its subalbums.

Note that enabling the maps adds a viewing-time dependency of your gallery on an external server belonging to the map tile provider and, in the process, leaks coarse location data to that provider. You can choose between several available map tile providers.  All the providers use the OpenStreetMap data [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright).

## CSS Personalization

Much of the appearance of the Lychee web interface is determined by the CSS.  The bottom of the basic settings screen features a text input field where custom CSS can be entered to tweak the Lychee user interface.  Effective use of this feature requires the knowledge of CSS and the internals of the Lychee front end (see the [source code](https://github.com/LycheeOrg/Lychee-front)), which go beyond the scope of this document, but check the [FAQ](faq.html) for a few examples.

Unlike the rest of the config, this field is stored in the text file `public/dist/user.css` and can be modified directly there using your favorite editor.

## Full Settings

Clicking _More_ at the bottom of the basic settings screen brings up the full settings, where every configuration option from the database can be modified. This is a low-level interface so be careful what you are doing! Any modifications made are validated and take effect after clicking on the _Save my modification, I accept the Risk!_ button at the bottom of the screen.

### Admin

#### `version`

(integer; default value: `040000`)

Internal Lychee database version number. _Do not change it._

#### `username` and `password`

(string; empty by default)

The administrator's username and password, encoded using `bcrypt`. If you ever forget either of them and can't access your gallery, see [this FAQ](faq.html#how-to-reset-username-and-password).

#### `check_for_updates`

(boolean; default value: `0`)

If activated, the server will periodically (at most once a day) check with GitHub if a newer release of Lychee is available and if so, it will display information about it in the login dialog and the _About Lychee_ dialog.

Note that this functionality is currently not available with Lychee v4.

#### `dropbox_key`

(string; empty by default)

See [Dropbox Key](#dropbox-key).

#### `api_key`

(string; empty by default)

Makes it possible to bypass the default Lychee CSRF token validation by providing a valid key in the request header. This is of importance exclusively for developers who want to interact with the Lychee server outside of the Lychee front end.

#### `allow_online_git_pull` and `force_migration_in_production`

(boolean; default values: `1` and `0`, respectively)

**FIXME** refer to installation or update wiki.

#### `gen_demo_js`

(boolean; default value: `0`)

This feature is of importance for Lychee developers only.  It is used when creating the [live demo](https://lycheeorg.github.io/demo/).

### Config

#### `site_title`

(string; default value: `Lychee v4`)

Sets the site title of the Lychee gallery in the web browser.

#### `site_copyright_enable`

(boolean; default value `1`)

Determines whether to display the copyright message at the bottom of the gallery.  See also [site_copyright_begin](#site_copyright_begin-and-site_copyright_end) and [landing_owner](#landing_owner).

#### `site_copyright_begin` and `site_copyright_end`

(integer; default values `2019`)

Determine the year range in the copyright message at the bottom of the gallery (see [site_copyright_enable](#site_copyright_enable)).

#### `additional_footer_text`

(string; empty by default)

Adds an additional paragraph of personal text underneath the copyright message at the bottom of the gallery.

#### `display_social_in_gallery`

(boolean; default value `0`)

Adds icons linking to social sites above the copyright message at the bottom of the gallery. See also [landing_facebook](#landing_facebook-landing_flickr-landing_twitter-landing_instagram-and-landing_youtube).

#### `public_search`

(boolean; default value `0`)

See [Public search](#public-search).

#### `hide_version_number`

(boolean; default value `0`)

Suppresses the displaying of Lychee version information in the login dialog.

#### `downloadable`

(boolean; default value `0`)

Determines whether users can download photos that are not owned by them.  Note that this setting is _not_ applicable to the most common case of photos in a public album – in that case, the owner specifies download permissions on a per-album basis via the album visibility dialog while making the album public.  The setting is applicable in the remaining cases though, such as public photos in private albums and private albums shared with individual users.

See also [full_photo](#full_photo).

#### `share_button_visible`

(boolean; default value `0`)

Determines whether display social media sharing links. Note that this setting is _not_ applicable to the most common case of photos in a public album – in that case, the owner specifies sharing links visibility per-album basis via the album visibility dialog while making the album public.  The setting is applicable in the remaining cases though, such as public photos in private albums and private albums shared with individual users.

#### `raw_formats`

(string; default value `.tex`)

List of filename extensions of raw photos, `|`-separated.

#### `zip64`

(boolean; default value `1`)

Determines whether to use the _Zip64_ archive format when downloading multiple photos at a time.  This is the preferred format as it is not subject to any restrictive limits, but some unzip implementations are reported to not support it.  Changing this value to `0` will use an older, more universally supported zip format that is, however, limited to a 4GB archive size and 64K archived files total.

#### `force_32bit_ids`

(boolean; default value `0`)

Lychee uses 64-bit IDs for albums and photos when the server is running on a 64-bit platform, which ensures a better uniqueness of these IDs.  It uses shorter, 32-bit IDs when running on a 32-bit platform.  This setting
forces the use of 32-bit IDs even on 64-bit platforms.  This may be required for proper operation in some strangely configured shared hosting environments but in general, using this setting is not recommended.

#### `update_check_every_days`

(integer; default value `3`)

**FIXME** refer to installation or update wiki.

### Gallery

#### `sorting_Photos_col`

(possible values: `id|takestamp|title|description|public|star|type`; default value `takestamp`)

See [Sorting](#sorting).

#### `sorting_Albums_col`

(possible values: `id|title|description|public|max_takestamp|min_takestamp|created_at`; default value `max_takestamp`)

See [Sorting](#sorting).

#### `sorting_Photos_order` and `sorting_Albums_order`

(possible values: `ASC|DESC`; default values `ASC`)

See [Sorting](#sorting).

#### `lang`

(string; default value `en`)

See [Language](#language).

#### `layout`

(possible values: `0|1|2` for square, justified, and unjustified, respectively; default value `1`)

See [Layout](#layout).

#### `image_overlay`

(boolean; default value `1`)

See [Overlay](#overlay).

#### `image_overlay_type`

(possible values: `exif|desc|takedate`; default value `desc`)

See [Overlay](#overlay).

#### `default_license`

(string; default value `none`)

See [License](#license).

#### `full_photo`

(boolean; default value `1`)

Determines whether users can view original (full-size) photos that are not owned by them.  Note that this setting is _not_ applicable to the most common case of photos in a public album – in that case, the owner specifies full-photo permissions on a per-album basis via the album visibility dialog while making the album public.  The setting is applicable in the remaining cases though, such as public photos in private albums and private albums shared with individual users.

See also [downloadable](#downloadable).

#### `photos_wraparound`

(boolean; default value `1`)

Determines whether the next/previous arrows (or left/right swipes) in the photo view wrap from the last photo in the album to the first one and vice versa.

### Image Processing

#### `imagick`

(boolean; default value `1`)

Determines the use of ImageMagick for image processing during upload/import time, if it is available.  Otherwise, the built-in GD library will be used.

**FIXME** link to FAQ

#### `skip_duplicates`

(boolean; default value `0`)

Determines whether to skip photos and albums during upload/import time if they already exist in the gallery.  Can be handy with the _Import from Server_ if one wishes to periodically synchronize an external directory with the Lychee gallery, as it will import only the newly added albums and photos then.

#### `small_max_width` and `small_max_height`

(integer; default values `0` and `360`, respectively)

Specify the size limits, in pixels, of the smaller of the aspect-preserving intermediate images generated during the photo upload/import time.  These images are used in the album view for displaying photo thumbnails in the justified and unjustified [layouts](#Layout).

A value of `0` for one of the limits (as is the case with `small_max_width` by default) results in that limit being ignored while the other dimension equals the other limit (e.g., by default, a `6000x4000` original will be scaled down to `540x360`).  Setting _both_ limits to `0` will disable the generation of that intermediate image size.

Note that for a given intermediate image to be generated, the original must be larger than the generated intermediate image would be.  E.g., by default, a `320x240` original will result in no intermediate image.

**FIXME** link to FAQ

#### `medium_max_width` and `medium_max_height`

(integer; default values `1920` and `1080`, respectively)

Specify the size limits, in pixels, of the larger of the aspect-preserving intermediate images generated during the photo upload/import time.  These images are used in the photo view and can thus be displayed in sizes up to full-screen.

See [small_max_width](#small_max_width-and-small_max_height) for a detailed explanation of how these limits work.  As an example, by default, a `6000x4000` original will be scaled down to `1620x1080`.

**FIXME** link to FAQ

#### `compression_quality`

(integer in the `0-100` range; default value `90`)

Determines the compression quality of the intermediate images generated in the JPEG format.

#### `delete_imported`

(boolean; default value `0`)

Specifies whether to delete the original files during an _Import from Server_ operation.  Note that the initial dialog window has a checkbox that enables the user to override the value set here.

#### `thumb_2x`, `small_2x`, and `medium_2x`

(boolean; default value `1`)

Determine whether to generate HiDPI variants of each intermediate image type (in addition to the regular ones), for use on high-resolution displays. `thumb` refers to the thumbnails used in the square [layout](#Layout), `small` to the thumbnails used in the justified and unjustified [layouts](#Layout) (see also [small_max_width](#small_max_width-and-small_max_height)), and `medium` to the images used in the photo view (see also [medium_max_width](#medium_max_width-and-medium_max_height)).

For each intermediate image type, the size limits of the HiDPI variant are taken from the corresponding regular  variant, multiplied by `2`.  E.g., by default, a `6000x4000` original will be scaled down to a `small` image of `540x360` and a `small_2x` image of `1080x720`.

Note that `thumb` images have a fixed size of `200x200` (`400x400` for `thumb_2x`).

**FIXME** link to FAQ

### Mod Frame

#### `Mod_Frame`

(boolean; default value `1`)

Enables the picture frame mode.

**FIXME** link to usage page

#### `Mod_Frame_refresh`

(integer; default value `30`)

Specifies the refresh time in the picture frame mode, in seconds.

**FIXME** link to usage page

### Mod Map

#### `map_display` and `map_display_public`

(boolean; default values `0`)

See [Maps](#maps).

#### `map_provider`

(possible values: `Wikimedia|OpenStreetMap.org|OpenStreetMap.de|OpenStreetMap.fr|RRZE`; default value `Wikimedia`)

See [Maps](#maps).

#### `map_include_subalbums`

(boolean; default value `0`)

See [Maps](#maps).

### Mod Welcome

#### `landing_page_enable`

(boolean; default value `1`)

Enables the landing page.

**FIXME** link to usage

#### `landing_owner`

(string; default value `John Smith`)

Specifies the name of the owner of the gallery, displayed in the copyright note at the bottom of the screen (see [site_copyright_enable](#site_copyright_enable)).

#### `landing_title` and `landing_subtitle`

(string; default values `John Smith` and `Cats, Dogs & Humans Photography`, respectively)

Specify the title and subtitle displayed on the landing page of the gallery.

#### `landing_facebook`, `landing_flickr`, `landing_twitter`, `landing_instagram`, and `landing_youtube`

(string; default values `https://www.facebook.com/JohnSmith`, `https://www.flickr.com/JohnSmith`, `https://www.twitter.com/JohnSmith`, `https://instagram.com/JohnSmith`, and `https://www.youtube.com/JohnSmith`, respectively)

Specify the URLs to the various social media spaces associated with the gallery.  To disable a particular media icon, set the corresponding setting to an empty string.

#### `landing_background`

(string; default value `dist/cat.jpg`)

Image displayed in the background of the landing page.

### Smart Albums

#### `public_recent`

(boolean; default value `0`)

Determines whether the _Recent_ smart album is displayed in the public mode.

#### `recent_age`

(integer; default value `1`)

Specifies the age of photos to be included in the _Recent_ smart album, in days.

#### `public_starred`

(boolean; default value `0`)

Determines whether the _Starred_ smart album is displayed in the public mode.

### Symbolic Link

#### `SL_enable` and `SL_for_admin`

(boolean; default values `0`)

This functionality is disabled by default.

Specify whether symbolic linking should be enabled for regular users (including the public mode) and the administrator, respectively.

The idea is to create symbolic links that will be removed after a set period of time. 
The goal of this approach is to avoid someone finding
upload/small/1234567890abcdef.jpg or upload/thumb/1234567890abcdef.jpeg and deduce the url of the full sized picture: upload/big/1234567890abcdef.jpg
In such way we protect the access to full sized pictures.

Enabling this might impact performances since when the life time expires, the entire set of links needs to be recreated before the gallery can be visible. This will impact on huge galleries.

#### `SL_life_time_days`

(integer; default value `1`)

Specifies the life time of symbolic links, in days.  After that time, the links are removed and new ones are created in their place, as needed.
