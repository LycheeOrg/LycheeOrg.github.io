<style>
.docs_main h1+ul ul li {
    display: inline-block;
    width: 7em;
}

.docs_main ul li p {
  text-align: justify;
}

.docs_main ul li blockquote {
  margin-top: 0.75em;
  border-left: 1px dotted #ff2d20;
  padding-left: 10px;
  margin-left: 10px;
}

.docs_main ul li blockquote p {
    font-size: inherit;
}

.docs_main ul li p ~ ul{
  margin-top: -1em;
}

.docs_main ul li blockquote ul {
    padding-left: 0.5em;
}
</style>

## Master branch


- `fixes` #1452 : Provide an ASCII fallback for multibyte filenames.

## Version 4

### v4.5.3

Released on Aug 07, 2022

#### IMPORTANT

- The internal representation of Albums changed with version 4.5.0.  
We strongly recommend that you **BACK UP YOUR DATABASE BEFORE UPDATING**.
- The folder structure changed for images; **please check the required directory permissions**.  
Read more [here  &#187;](https://lycheeorg.github.io/docs/#directory-permissions).

#### Changes

- `new` : New folder structure for images:
    - Deep directory structure.  Instead of all images of a certain kind residing in a single, flat directory (potentially containing thousands of files), we now have two additional two-letter directory levels under each kind (e.g., images are stored as `medium/ba/d0/9a28ec995ead4877dfa1befa2d3b.jpg`).
    - HiDPI (`@2x`) variants now reside in their own directories.
    - `big` has been renamed to `original`.

    Note that this only affects newly added photos; those added in the past are not moved to new locations.  Also, see the note above about directory permissions.

- `new` : Refactoring of the internal architecture and the representation of albums.  While this didn't add any major new features, a number of optimizations have been put in place to speed up various operations, e.g., on installations with many hundreds of albums.  Because this requires a particularly complex database migration, those with existing installations should pay attention to the note above about backing up their database.
- `new` : Refactoring of error handling and reporting.  This should result in more meaningful error messages both in the web front end and in the server logs (instead of the old cryptic "Server error or API not found" messages).
- `new` :Refactoring of the file handling during upload/import.  Instead of using temporary files and (re-)reading them many times, we now rely on file streams.  This not only speeds up processing during upload/import (by around 50% in our tests), but is also an important step towards future support for the use of AWS S3 as image storage.
- `new` : Addedfeatures in the web front end :
    - QR code added in the sharing menu.
    - GPX tracks can be added to albums for displaying together with photos on the map.
    - Drag/drop support added for albums and photos to facilitate more intuitive Move/Merge
- `new` : ZIP compression level can now be changed and the compression can be disabled.
- `new` : Support of Vietnamese language.


### v4.4.0

Released on Dec 03, 2021

- `new` #1145 : Upgrade Composer and PHP Version
  > **Attention**: Support for PHP < 8 has been removed.
- `fixes` #1152 : Fix diagnostics
- `fixes` #1154 : Set configuration option `user_agent` during init.

### v4.3.6

Released on Nov 23, 2021

- `fixes` #1059 : Add Cache busting.
- `new` #1049 / `fixes` #1011 : New Photos Email Notification
  > - Send an email when new photos were added to albums that have been shared.
  > - Use the laravel notification system to send via SMTP, `env` settings will need to be set up.
  > - It is set to send out emails once a week via cron, so the laravel cron job would need to be set up.
  > - Neither is required so if people don't want to set those up then it won't affect the operation of Lychee.
  > - Add admin setting to toggle the notification option, which enables a user level menu item to change their email. This is purely opt-in, so users can clear their email if they don't wish to receive the emails anymore.
  > - The email that gets sent out has been branded lychee, and will group the last week's worth of notifications and send them all out in one email to each user that has an email set up.
- `new` #1065 : Add Polish translation.
- `new` #1071 : Avoid git rebase conflicts during development on other branches
- `new` #1086 : cli sync from from server with option to delete, import via symlink, etc.
- `new` #1097 : Make language more gender neutral.
- `fixes` #1102 : Character limitation of table column logs.function causes server error 500 for deployments with long installation path
- `fixes` #1105 : Fix type issues related to thumbs
- `fixes` #1108 : Fixes takestamps.
  > - This should correct all instances of incorrect album min/max takestamps and as a bonus be computationally much less expensive.
- `fixes` #1110 : `round` in php8 requires an `int` or `float` as the first argument.
- `fixes` #1119 : No video upload when ffmpeg is missing
- `new` #1122 : Improved French translations.
- `fixes` #1121 : Fix lychee:video_data
- `fixes` #1033 : A bit of JS to prevent multiple submissions of the migration form.
- `fixes` #1127 : The upload_processing_limit parameter only works when uploading images in the admin account. It does not work for images uploaded by other users
- `new` #1142 : also support Caps on size format in diagnostics.
- `fixes` #1146 : _artisan optimize_ crashes with _Unable to prepare route_
- `fixes` https://github.com/LycheeOrg/Lychee-front/pull/270: _Copy To..._ didn't work correctly
- `fixes` https://github.com/LycheeOrg/Lychee-front/issues/273: Wrong support of ' (single quote) in some places
- `fixes` #1123: Album renaming did not work reliably
- `new` https://github.com/LycheeOrg/Lychee-front/pull/276: Remember user preference for the visibility of the info sidebar
- `fixes` https://github.com/LycheeOrg/Lychee-front/pull/278: Fix the menu for smart and tag albums and in public mode, fix import into top-level albums view, fix empty info sidebar for albums

### v4.3.4

Released Jul 11, 2021

- `new` #972 : more versions and dependencies check
- `fixes` #954 : Google Motion Photo
- `new` #988 : Added raw values of attributes to JSON API
- `new` #1000 : Extended search for cameramodel and date.
- `fixes` #998 : Use Guzzle7 instead of Guzzle6
- `fixes` #994 : Disable login with Legacy if UserAdmin exists
- `new` #991 : Add attribute 'filesize_raw' to entity 'Photo'
- `new` #1016 : Refactor timestamps
- `fixes` #1008 : null error on live photo import
- `new` #1041 : Enhance German Translation


### v4.3.0

Released April 18, 2021

- `new` #940 : Improved support for touch devices.
- `new` #939 : Responsive web design for small screens.
- `fixes` #959 : Excluded '/api/Session::init' from CSRF protection (as per the API specs).
- `fixes` #959 : Fixes _.lycheeignore_ support.
- `new` #942 : Add support for Portuguese language.
- `fixes` #927 : Also copy over the password column when migrating from the very old version 3 of Lychee
- `fixes` #932 : Public photos hidden 
  > It adds a new config variable public_photos_hidden, which defaults to 1 (preserving the current behavior). If set to 0, photos individually made public (rather than through an album) will be included in the results of a public search or in public tagged albums. Basically, they will no longer be treated as hidden (even though they still won't be findable through browsing; we could address that as well by making the Public smart album, well, public -- I welcome your input if we should, and if so, what to name the config variable to enabled that, other than public_public wink).


### v4.2.2

Released Feb 16, 2021

- `fixes` #882 : Password albums were broken.
- `fixes` #891 : Download: file not found on password protected Album
- `fixes` #895 : Default license display
- `fixes` #888 : Refactoring of the rotation code
- `new` #887 : Add the possibility to not display the GPS direction on the map
- `new` #892 : Add `--force` option to the Command Line Interface for Takedate
- `fixes` #890 : Fix delete bug when selecting multiple sub albums
- `new` #901 : Add more diagnostics checks
- `new` #905 : Improve Chinese translation
- `fixes` #908 : Migration from v3 was broken since version 4.2
  >  By adding nested set tree, column `_lft` and `_rgt` did not exist on first import while the code required it.
- `new` #919 : Add the possibility to limit the number of image being processed
  > This will lower the memory load on the server, especially on RAM limited instances.
- `fixes` #925 : Some user decided to upload pictures without extension, this broke our code...
- `fixes` #903 : Windows `microtime()` was a bit slow, generating collisions in the uploaded file names.
  > The file name are now generated from the sha1 hash of the file.
- `new` #894 : Extend the functionality of _Import from server_ to have the same interface as from the command line.

### v4.2.1

Released Jan 24, 2021

- `new` #875 : Add custom cover for albums
  > - custom album covers
  > - IMPORTANT: support for 3 distinct images for albums dropped (overkill given that 2 are barely visible)

### v4.2.0

Released Jan 24, 2021

- `fixes` #831 - Bad extension filename when you upload *.jpg
  > The regression was introduced in 4.0.8 as part of #777.
- `new` #874 - Update CLI Takedate
  > - add option --timestamp added to set create_at to timestamp of media file for media that lacks EXIF information
  > - use same formatting for 'sysdate' as for 'takedate'
- `new` #832 - Major rework of backend
  > * start using Livewire for the front-end, for now accessible at `example.com/livewire` if enabled via `LIVEWIRE_ENABLED` in `.env` (DO NOT USE, still in development)
  > * use Facade `AccessControl` to access `Session` information (basically home-brewed `Auth` Facade)
  > * use Facade `Lang` to access `Lang` information (Easier to use through the blade template)
  > * heavy refactoring of the core, introducing more granularity:
  >      * Interfaces are Contracts
  >      * Group Factories
  >      * use `trait` on album for smaller dedicated operations
  >      * add Nested Set theory to Album to allow access to all descendants  
  > 
  > * fixes #843 
  > * fixes #846
  > * fixes #858


### v4.1.0

Released Dec 27, 2020

- `new` #798 : Force migration page.
  > when the database is behind the file version, we immediately redirect to a migration page to ensure that
  > database columns are not missing, generating error 500.
- `new` #800 : Move to GitHub actions instead of Travis CI.
  > They are still available in the Ajax query
- `upd` #799 #816 : **Require PHP 7.4**
  > PHP 7.3 is EOL.
- `new` #807 : add new command: `php artisan lychee:rebuild_albums_takestamps`
  > there are instances where the album min max takestamps are broken. This allows the user to reset it.
- `upd` #808 : Update traditional Chinese files.
- `fixes` #813 : some error 500 during installations were not properly caught.
- `fixes` #806 : Direct Links of albums do not respect url if lychee installed in subdirectory
- `fixes` #811 : fall back to native metadata extraction on error
- `fixes` #810 : fix(rss): avoid display feed link in HTML if RSS option is disabled
- `new` #819 : add support for WebAuth: Yubikeys & fingerprint & other authentication devices.
  > This is only available to the admin login (for now)
  > Also implements shortcut `k` to pop-up the passwordless login interface.
- `new` #822 : add sensitive albums
  > - adds a new "flag" so that such folders can be recognized at first glance while being logged in.
  > - adds a key-bind `h` who hides all folders previously marked as sensitive.
  > - adds a pink star in the header to notify the user is in a Sensitive folder.
  > - Changing this property is either done on clicking on the star or toggling it in the visibility parameters.
  > - makes it possible to hide Sensitive folder by default.
  >
  > **Important note: if a sensitive folder is set as public, it will be revealed by `h`.** If you do not wish such public folder to be visible, set it as _hidden_.
- `fixes` #831 : Use correct file name for small/medium downloads
  > fixes a regression bug introduced by #777


### v4.0.8

Released Nov 19, 2020

**BREAKING CHANGE: REQUIRE PHP 7.4**

- `fixes` #783 : Can't rename tag album
  > Tag-albums were not accessible by `albums.getByID`
- `fixes` #781 : Fixes a bug which prevented the use of sharing albums between users
  > This rare bug was only triggered if a non-admin user was sharing an album with
  > another user.
- `fixes` #779 : Fixes some missing information on Tag Albums in the front end.
- `fixes` #766 : It is no longer possible to use the 'photo rotation' functionality
  > While the buttons are still accessible we now return an error instead of filling up
  > the entire disk space of the server.
- `fixes` #751 : In some rare instance, it was not possible to generate video thumbnails
  > this is fixed. We try to reextract the 'aperture' property to get the thumbnail.
  > We also added a warning in the case where FFmpeg was not enabled.
- `fixes` #769 : when moving pictures in Image view, the second try resulted in failure
  > we no longer clear the content of `json.album` when moving an image.
  > This ensure that the required properties are still accessible
- `fixes` : Settings are accessible in Image view
  > There were rare sequence of events which prevented the settings view to open.
- `new` : /Frame will now display a warning if no pictures are found.
  > instead of staying a black screen, we now send an `alert()`
- `new` : Share information are no longer displayed in public mode
  > They are still available in the Ajax query
- `upd` #773 : Update French localization
  > spacing typos in French localization
- `new` #771 : Update French localization
  > minor changes in the French localization.
- `new` #764 : Add Diagnotics warnings if the php init values are too low (less than 30M). 
- `new` #757 : Add limits on the number of logs seen.
  > Too many logs lines where crashing php by using too much memory.
- `new` #758 : Add the possibility to chose the picture ordering per album
  > the admin can now chose whether to order by name etc per album instead of globally.

### v4.0.7

Released Oct 9, 2020


- `fixes` #584 : Albums that do not allow photo downloads cannot be included as enclosures.
  > This checks album permissions before creating the enclosure to add to the feed.
- `new` #616 : Add picture rotations
  > As known improvements, this code will rotate all images.
- `fixes` #621 ( #623 ) : Original migration from v3 is less prone to break
- `new` #625 : Better new smart albums
  > this allows the ability to add more smart albums and more flexibility in using them.
- `fixes` #642 : Permission problem on Windows
  > Windows does not understand the concept of readable but not writable permission.
- `new` #656 : Add support for FireTV
- `fixes` #662 : Error code changes in PhP
- `new` #660 : Add new available licenses
- `new` #659 : Add lossless image optimization support
- `fixes` #668 : Improved French translation
- `new` #671 : Add a redirection system
  > Instagram uses the hashtag for topics as a result, sharing a lychee link to an album does not work on it.
  > Given example.com/r/123456 will be redirected to example.com/gallery#123456  
  > and example.com/r/123456/7890 will be redirected to example.com/gallery#123456/7890  
  > to allow sharing on such plateform.
- `new` #667 : Add support for traditional Chinese language
- `new` #678 : Add support for Norvegian language
- `new` #677 : Make swipping tolerances configurable.
- `fixes` #680 : Distinguish UTC vs local video takestamps
- `fixes` #708 : More failsafe when migrating from V3.
- `new` #704 : Add smart albums by tag
  > it is now possible to create smart albums which will take a list of tag and return an album containing the pictures with those tags.
- `new` #721 : Upgrade to Laravel version 8
- `new` #727 : When checking a password on an album, upon success we also unlock the other albums with that same password.
- `new` #749 : Add webp support to the GD handler


### v4.0.6

Released May 26, 2020

- `new` #588 : add an option to the sync command to 're-sync' images that already exist.
  > Since XMP sidecars are now allowed, images with the same checksum will not get
  > updated metadata if the sidecar changes but the checksum remains the same. This
  > adds an optional flag to the `lychee:sync` command that forces existing images
  > with no change in checksum to get updated metadata from XMP files (if they exist).
  > It only updates the image if the metadata read in differs from the metadata that
  > the image aleady has.
- `new` #599 : Added method to get the full path of albums.
  > Specifically in the sharing screen, when albums are sometimes named the same
  > (if they are organized by Year and Month), then it is impossible to tell which
  > album you are actually sharing. This adds the ability to get the album's
  > "full path" and sends it down for the sharing settings.
- `fixes` #596 : Failing xmp file read results in fallback to native exif extraction.
  > If the EXIF succeeds but sidecar fails, it reverts falls into the catch.
- `new` #574 : Support of HEIC files and subsequently convert raw files (e.g. .NEF) into jpeg.
  > if a raw file is imported such as .nef, php-imagick will try to generate a thumbnail jpeg for it.
  > Note that the extension still needs to be added in your advanced settings.
  > 
  > **Important:** Lychee was never meant to convert RAW files such as .nef, .cr2 .arw etc.
  > If you shoot RAW, it is to be able to change *exposure*, *dodge*&*burn*, *crop* etc. later in
  > a proper image processing software such as Lightroom, > Photoshop, Capture One, Luminar, Darktable &hellip;
  > otherwise you better shoot JPEG. Lychee does not intend to provide those functionality.
- `new` #594 : Add debug bar for `dev` install.
  > It is disabled by default, even in debug mode. To enable it, set `DEBUGBAR_ENABLED` to `true` in your `.env` file.
- `new` #579 : Ghostbuster command to clean up dead symlinks.
  > The ghostbuster command also parses the database and see if some symlinks are dead.
  > It will delete the photo from the database in such case.
  > As this behaviour can modify the database, we disable it by default. 
- `new` #577 : Parse additional xmp sidecars files to update metadata.
  > This reads in XMP sidecar files (if they exist).
  > Thankfully, exiftool supports reading in sidecars, so we can use the same
  > technique we're using to read the files. We merge both file and sidecar metadata,
  > taking priority based on user settings (default to prefer image metadata)
- `fixes` #581 : Undefined property errors when migrating from 3.1.6.
  > The missing `license`, `lens` are now taken care off. 
- `fixes` #565 : No Dropbox Import with Lychee 4.0.0.
  > The CSP was a bit too tight, preventing the execution of the script from dropbox.

### v4.0.5

Released May 15, 2020

- `new` #551 : Add RSS module.
  > we provide a RSS feed, available at the `/rss` address.
  > it will contains the last `rss_max_items` (default: 100) over the last `rss_recent_days` (default: 7) days.
- `fixes` #557 : report files not imported by sync.
  > When using the command `lychee:sync` if a file is not imported for some reason, the Log will contains more detailed information instead of just an error message.
- `fixes` #550 : Version 4.0.4 database is not updated.
  > Simply forgot to add the bump version.
- `fixes` #460 : Wrong rotation of photos when imported from server via symlink.
  > thumbnails are now also rotated in the proper direction.

### v4.0.4

Released May 11, 2020

- `new` #543 : More idiot proof safeties (and avoid some 404 errors complaints).
  > - We add a check in the public directory that composer has indeed been run.
  > - We add a check that if apache is being used, the rewrite module is enabled (avoid silly 404 error when redirected to `/install`).
- `new` #541 : Better support for SQLite
  > We create a file in `database/database.sqlite` to avoid issues in the case where some user decides to use this type of database without giving a path. 
- `fixes` #539 : Invalid exif geolocation causes db error
  >  We now check that the latitude is between -90 and 90 degrees, we also check that the longitude is between -180 and 180 degrees. Any other values are discarded.
- `fixes` #533 : Add LYCHEE_UPLOADS_URL to secure-headers.php
  > This allows the use allow images to be loaded from another server (CDN).
- `fixes` #529 : Footer linkable.
  > With the update to Laravel v7, the footer was not html html tags anymore. We fix this. This allows the use of links in the footer, for e.g. legal stuff in Germany.
- `fixes` #525 : The config from the v3 was not migrated
  > We now also migrates most of the configuration from the v3 if the `lychee_settings` table if found.


### v4.0.3

Released April 29, 2020

- `fixes` #498 remove Lychee-front version number alltogether
  > add Diagnostic information:
  > 
  > - Composer install type
  > - release type (git vs release)
  > - add button to allow migration for users using the release channel instead of master.
- `fixes` #508
  > Diagnostic was checking the existence of mysqli only if postgresql is not used. With the added support of SQLite we now thoroughly check each possibilities.
- `fixes` #510
  > add SQLite3 to the travis build check.

### v4.0.2

Released April 22, 2020

- `fixes` #488
  > Error in the migration which made the script some files were existing.
- `fixes` #485
  > Align lychee-front version number, remove error when not provided.
- `fixes` #487
  > add missing files (css) to the installer.

### v4.0.1

Released April 19, 2020

- `fixes` #481 
  > Decrease the size of the released archive by 82%.
- `fixes` missing download button when album is downloadable, does not have pictures but subalbums

### v4.0.0

Released April 18, 2020

[Upgrade from version 3.x &#187;](https://github.com/LycheeOrg/Lychee/wiki/Upgrade-from-version-3)

#### New

- `new` : uses the new Laravel backend
  > Better security for access control & more flexibility.
- `new` : broader database support
  > With Laravel we are now Database agnostic; you can choose between MySQL, SQLite and PostgreSQL.
- `new` : introduce the sub-albums
  > You can now create albums within albums.
- `new` : introduce multi user system (in addition to admin)
  > The admin can arbitrarily change passwords, lock an account (user cannot change his password), give rights to the user to upload pictures and create albums.
- `new` : sharing between users
  > Users can share albums with each other. *Interface still needs improvements*. Note that you are only give READ access, not write access.
- `new` : Frame module
  > By enabling the Frame module in the advanced settings, a user can display his *starred* pictures as a slideshow.
- `new` : Landing page module
  > Allows the user to have a landing page instead of directly arriving at the gallery if enabled.
- `new` : Image symbolic module
  > To prevent full pictures from being directly available, a module is available to make the image link hard to guess. *This will induce a slow down when the image is generated*
- `new` : use XCRF cookies
  > All requests to the server require an encrypted cookie in order to prevent cross-site request forgeries.
- `new` : *"one click update"*
  > Admins can update their installation in one click in the Diagnostic interface if their installation has been done with `git`.
  > This also support composer updates but this is more risqu&eacute;.
- `new` : Full HiDPI support
  > Optional HiDPI support for preview images can be enabled in the advanced settings.
- `new` : Improved sharing and downloading
  > Sharing and Visibility were split into two menus to make them easier to use; one can now download an image in any of the available sizes; multiple photos or albums can be downloaded in one go.
- `new` : Improved Smart albums
  > _Recent_ and _Starred_ can now be enabled in public mode using advanced settings; the age qualifying for _Recent_ can be adjusted.
- `new` : Continuous Integration and Code Coverage
  > While this is not visible to the users, we now test our builds before placing them in the **master** branch. This increases the stability of our builds. Our test suite currently covers 50% of our code.
- `new` : Image wraparound configurable
  > Wraparound from the last to first image when selecting _Next_ in photo view can now be disabled in the advanced settings.
- `new` : Support for `cn`, `cz`, `nl`, `en` (default), `fr`, `de`, `el`, `it`, `ru`, `sk`, `es`, `sv`
- `new` : Support for GPS coordinates
  > Decode the GPS data from the picture
- `new` : Display on map with OpenStreetMap
  > optionally display where on the map the picture has been taken  
  > optionally add a global map to see where all your pictures have been taken.
- `new` : Live photos
  > Add support to live photos, also extract the video from the photo.
- `new` : Support 32 bits version
  > Add support to 32 bits version of PHP (even though we don't like it).
- `new` : Provide command line access from server side
  > This should replace the use of `lycheeupload`, `lycheesync`, `lychee-create-medium`
  > available commands are:  
  >  
  >  - `lychee:exif_lens`: Get EXIF data from pictures if missing                                          
  >  - `lychee:reset_admin` : Reset Login and Password of the admin user.                                     
  >  - `lychee:logs` : Print the logs table.                                                           
  >  - `lychee:diagnostics` : Show the diagnostics informations.                                              
  >  - `lychee:decode_GPS_locations` : Decodes the GPS location data and adds street, city, country, etc. to the tags  
  >  - `lychee:generate_thumbs` : Generate intermediate thumbs if missing                                         
  >  - `lychee:video_data` : Generate video thumbnails and metadata if missing                               
  >  - `lychee:sync` : Sync a directory to lychee                                                      
  >  - `lychee:npm` : Launch npm on the public/src folder                                             
  >  - `lychee:takedate` : Make sure takedate is correct.                                                  
  >  
  > use `php artisan lychee:<command> -h` for more informations about the command.
  > For example: `php artisan lychee:logs` will display the last 100 logs (requires the database).

#### Fixes

- `fixes` : Improved _Import from Server_
  > User can now select whether to delete originals right in the dialog box; status updates are provided throughout the input process; improvements were made to prevent PHP and HTTP timeouts.
- `fixes` : Improved support for video files
  > Next/prev buttons no longer cover the video player; extracted preview image now retains the video aspect ratio; basic video metadata is extracted and displayed in the Info sidebar.
- `fixes` : Multiselect improvements
  > Shift-click is now supported for selecting ranges; clicking on the background clears selection; Ctrl-click for unselecting has been fixed.
- `fixes`: Sidebar improvements
  > The Info sidebar no longer overlaps content; the displayed text can be selected and copied.
- `fixes`: Simplified password protection of albums
  > Password-protected albums stay unlocked for the duration of the viewing session.

---

## Version 3

### v3.2.16

Released June 17, 2019

- `new` : hides lychee version number by default (e#82)
- `wont-fix`: `CVE-2021-43675` - Lychee-v3 3.2.16 is affected by a Cross Site Scripting (XSS) vulnerability in `php/Access/Guest.php`.
  > The function exit will terminate the script and print the message to the user. The message will contain albumID which is controlled by the user.

### v3.2.15

Released June 16, 2019

- `update` : improve stability when getting bad EXIF data (e#205)
- ` fixes` : ignore bad shutter data (3#240)
- `update` : switch the git commit format number to only 7 characters in Diagnostics
- `fixes` : takedate format string (3#215, 3#256) 
- `new` : add setting to allow public search (3#262)
- `fixes` : wrong version number displayed in Lychee (3#268)
- `update` : credits.

### v3.2.14

Released March 28, 2019

- `Updates` Add primary key to settings table (3#221)
- `Updates` Add git source commit/branch/repo to Diagnostics page
- `Updates` Use better lens tags from exiftool if present (if exiftool is enabled) (3#235)
- `Updates` Accept larger input from exiftool
- `Updates` Make photo/album IDs more consistent
- `New` Add fullscreen support to album and photo views (3#228)
- `Updates` Use sortingAlbums and sortingPhotos even if logged out.
- `Updates` Hide passwords. Add password confirmation.

- `Fixes` 3#220, 3#222, 3#234, 'F' and 'f' hotkey behaviour and some spelling mistakes (3#229)

### v3.2.13

Released February 20, 2019

- `New` Add "unjustified" layout
- `Updates` Improve Diagnostics page
- `Fixes` 3#194, 3#196, 3#205, 3#208

### v3.2.12

Released February 12, 2019

- `New` Add usage of exiftool to get exif tags from camera #189 
Using exiftool for getting exif tags make available a lot more tags than the built-in functionality in PHP. Using exiftool will make eg. lens info available without having to rely on that users have exported a raw from Ligthroom.
**This setting needs to be enabled via the `more` menu as it makes system calls.**
- `Fixes` image size missing from about 3#188

### v3.2.11

Released February 3, 2019

- `New` Add description overlay and takestamps overlay in addition to Exif. Closes 3#167
- `New` Add Setting to remove script execution time limit during imports. Fixes 3#177
  This setting can only be activated via the `More` setting and at user owns risks.

### v3.2.10

Released January 19, 2019

- `New` Switch to InnoDB engine. Closes #169
- `New` Add setting to decide whether to delete photos from source when imported. Fixes 3#173
- `New` Use existing albums (if available) when importing from server
- Remove '[Import] ' prefix for albums created by import

### v3.2.9

Released January 9, 2019

Nothing major here. Just a bunch of small bug fixes

**WARNING**: Lychee now requires PHP 7.1 ( http://php.net/supported-versions.php )

- `Fixes`  Cross-Origin Request Blocked: https://lycheeorg.github.io/update.json ( 3#121 )
 The server is now doing the check for update (on `Session::init`) if this one fail, the user will do an ajax request to check if an update is available.
- `Fixes` Syntax Error in Session.php ( 3#153 )
- `Fixes` Small bugs ( 3#136 ,  3#157 , 3#159 ,  3#163 , 3#166 )
- `Fixes` lychee uploading pics into uploads/thumb folder only  ( 3#148 , 3#165 )
- `Updates` German translations ( 3#161 )

### v3.2.8

Released December 26, 2018

- `Fixes` Site broken (3#157)

- `New` Admins can now access all settings via `Settings -> more` at the bottom of the page.
**WARNING**: it is now easier to break your installation.
- `New` Admins can now create a specific `user.css` file that will be loaded in addition to the `main.css` one. This css file can be modified at the bottom of the `Settings` screen.
- `New` Admins can now define the default size for their medium and small images (via the advanced settings).

- `Fixes` Turn off zoom-in animation when switching photos (3#154)
- `Fixes` Setting // Image Size Definition // Small, Medium, large // With Default values (3#152)
- `Fixes` "Display EXIF data overlay" can toggled with click on image (3#151)
- `Fixes` "play-icon.png" should be in "lychee-front/images" not root (3#150) It is now placed in `dist`
- `Fixes` Shutter speed for long time exposures is displayed as fraction (3#149)
- `Fixes` [Wish] Custom Size Image Creation (3#141)
- `Fixes` New album doesn't show after create unless you refresh page (3#135)
- `Fixes` Unable to edit settings table in database (3#80)
- `Fixes` Hover-Over Blue Border/Square Highlights (3#51)

### v3.2.7

Released December 11, 2018

- `New` Album-level licenses
(**WARNING**: All photo-level licenses will be reset when this update is applied.)
- `New` Added script to generate "small" size files for existing images
- `Improved` Update link on login dialog directs to the [Releases](https://github.com/LycheeOrg/Lychee/releases) page rather than the Readme.
- `Fixes` Center align play icon in video thumbnail (3#133)
- `Fixes` Missing "small" folder in 3.2.6 release (3#146)
- `Fixes` Other minor bugfixes

### v3.2.6

Released November 30, 2018

- `New` Default Creative Commons license field in Settings. Applies to new uploads only.
- `Fixes` Misspelling of 'Starred' Smart Album (English)
- `Fixes` Albums not showing when 'Move' was selected on a single photo (3#129)
- `Fixes` Previously set license saved in License field (3#120)

### v3.2.5

Released November 26, 2018

- `New` Creative Commons licenses available as photo metadata (3#71)
- `New` "Copy to..." option is now available

### v3.2.{3,4}

Released November 22, 2018

- `Fixes` 3#112, 3#111 (quick fix), 3#110, 3#109, 3#105, LycheeOrg/Lychee-front 3#16.
- `New` small pictures (for the justified-layout)
- `New` Lens information
- `New` Displaying EXIF data as an overlay in the image view.

### v3.2.2

Released November 21, 2018

- `New` German translations (3#104)
- `New` support for justified-layout (3#95)

Justified Layout is available as an option in the settings. It will only works with Imagick and medium.
Lychee-front will require a npm install (only for devs).

### v3.2.1

Released November 20,2018

- `Fixed` small bugs
- `Fixed` SQL updated not applied
- `New` Swedish support (3#101)
- `New` multi selection with CTRL (3#36)
- `New` Content Security Policy via .htaccess  (3#91, 3#92)

### v3.2.0

Released November 12, 2018

* `Fixes` Picture ordering bug.
* `New` Panel for settings.
* `New` Allow video upload. (3#4)
* `New` localization (so far in English, French, Dutch and Simplified Chinese) (3#48, 3#53, 3#54, 3#55, 3#87, 3#94)

[OPTIONAL] In order to have Thumbnail for video you will need to use [composer](https://getcomposer.org/):
```
cd Lychee
composer update
```

### v3.1.6

Released March 20, 2017

- `Fixed` Downloading a SmartAlbum results in crash (e#652)
- `Fixed` htaccess IfModule for PHP7 (e#653)

### v3.1.5

Released October 25, 2016

- `New` Hide mouse pointer in full screen mode (e#620)
- `Improved` Smoothing rotation of album (e#626)

### v3.1.4

Released August 28, 2016

- `Fixed` Search stopped working because of an undefined index error (e#605)
- `Fixed` Better next/previous photo check to prevent an error when opening an album with only one photo

### v3.1.3

Released August 22, 2016

- `Improved` rotate and flip images with GD based on EXIF orientation (Thanks @qligier, e#600)
- `Improved` enter/leave fullscreen-mode by (not) moving the mouse for one second (Thanks @hrniels, e#583)
- `Improved` Prefetch the medium photo instead of the big one (Thanks @Bramas, e#446)
- `Improved` Added "session" to required extensions (e#579)
- `Improved` Added warning if Imagick is not installed/enabled (Thanks @hrniels, e#590)
- `Fixed` Don't assume that gd_info exists when running diagnostics (Thanks @hrniels, e#589 e#565)
- `Fixed` Sidebar showing up in smart albums when navigating back from the photo-view

### v3.1.2

Released June 12, 2016

- `Improved` Added indexes to SQL fields to improve query execution time (Thanks @qligier, e#533)
- `Improved` Protocol-relative URLs for open graph metadata (e#546)
- `Improved` Remove metadata from medium-sized images and thumbnails (Imagick only) (e#556)
- `Improved` Reduce quality of medium-sized images (Imagick only) (e#556)
- `Improved` orientation-handling with Imagick (e#556)

### v3.1.1

Released April 30, 2016

- `New` share button when logged out (e#473)
- `New` Import of IPTC photo tags (Thanks @qligier, e#514)
- `New` Added reset username and password to FAQ (e#500 e#128)
- `Improved` Removed will-change from the main image to improve the image rendering in Chrome (e#501)
- `Improved` scroll and rendering performance by removing will-change
- `Improved` Open Facebook and Twitter sharing sheet in new window
- `Improved` EXIF and IPTC extraction (Thanks @qligier, e#518)
- `Fixed` broken URL in Update.md (e#516)
- `Fixed` error 500 on database connect error (Thanks @tribut, e#530)

### v3.1.0

Released March 29, 2016

**Warning**: It's no longer possible to update from Lychee versions older than 2.7.

**Warning**: Plugins which use the plugin API of Lychee must be updated to work with the new back-end.

**Notice**: It's no longer possible to edit the thumb quality in the database.

**Notice**: It's no longer possible to disable the creation of medium-sized photos when Imagick is installed on the system.

This updates includes a huge rewrite of the back-end. We are now using namespaces and the singleton pattern for Settings::get(), Database::get() and Plugins::get(). Everything is way better documented thanks to PHPDoc comments. Ugly `#` comments have been replaced with the more known `//`. Unused functions are gone and returns are more strict. We also added a handy module to output messages. Failed database updates and invalid queries will be saved to the log.

- `New` Empty titles for albums
- `New` Share albums as hidden so they are only viewable with a direct link (e#27)
- `New` Log failed and successful login attempts (Thanks @qligier, e#382 e#246)
- `Improved` error messages and log output
- `Improved` The search shows albums above photos (e#434)
- `Improved` Album id now based on the current microtime (e#27)
- `Improved` Back-end modules and plugins
- `Improved` Database connect function and update mechanism
- `Improved` Default photo title now "Untitled"
- `Improved` Move to next photo after after moving a picture (e#437)
- `Improved` Return to album overview when canceling album password input
- `Improved` URL import now accepts photo URLs containing "?" and ":" (Thanks @qligier, e#482)
- `Improved` Replaced date by strftime to simplify date translations (Thanks @qligier, e#461)
- `Fixed` Missing icons in Safari 9.1
- `Fixed` duplicate uploads (Thanks @qligier, e#433)
- `Fixed` incorrect escaping when using backslashes
- `Fixed` session_start() after sending headers (e#433)
- `Fixed` error when deleting last open photo in album
- `Fixed` Photo sometimes not loading when visiting directly
- `Fixed` Move album, merge album and switch album/photo menus no longer show empty titles for untitled albums/photos

### v3.0.9

Released January 10, 2016

- `Improved` Disabled dragging for thumbnails
- `Improved` Avoided unnecessary devicePixelRatio checks by using srcset for all thumbnails
- `Improved` Avoided devicePixelRatio check by using srcset for the imageview image
- `Improved` Don't show log and system information when logged out (Thanks @Bramas, e#421)
- `Fixed` Swipe-gestures on mobile devices

### v3.0.8

Released December 20, 2015

- `Improved` Lychee update site now with SSL (e#317)
- `Improved` Set undefined vars, remove unused vars and code that cannot be reached (Thanks @mattsches, e#435)

### v3.0.7

Released November 15, 2015

- Internal changes and updated dependencies
- `New` PHP-version-check now requires PHP >= 5.5
- `New` Preloading of big photos (e#185)

### v3.0.6

Released September 13, 2015

- `Improved` Share photo now shares view.php link (e#392)
- `Fixed` Incorrect error messages for failed uploads (e#393)
- `Fixed` XSS issues and escaping problems
- `Fixed` Broken "Download album" when album has an ampersand in the password (e#356)

### v3.0.5

Released August 9, 2015

- `Fixed` view.php not displaying photos

### v3.0.4

Released July 17, 2015

- `Improved` Removed bower and updated basicModal & basicContext
- `Improved` Small interface performance improvements
- `Improved` Updated all JS-files to take advantage of ES2015
- `Improved` Better error-handling for the Dropbox-, URL- and Server-Import
- `Improved` Added skipDuplicates- and identifier-check to the diagnostics
- `Fixed` error when using "Merge All" with one selected album
- `Fixed` error when saving username and password after the initial setup
- `Fixed` Clicks not recognized when using a mouse on a touchscreen-device (e#345)

### v3.0.3

Released June 28, 2015

- `New` Skip duplicates on upload (e#367, [How to activate](settings.md))

### v3.0.2

Released June 13, 2015

- `Improved` Permission errors are now easier to understand (e#351)
- `Improved` Escape data from database before inserting into `view.php`
- `Fixed` PHP-version-check now requires PHP >= 5.3 like written in the docs

### v3.0.1

Released May 24, 2015

- `New` Album Sorting (Thanks @ophian, e#98)
- `New` Identifier to prevent login of multiple Lychee-instances (e#344)
- `Improved` Albums and photos now can have a title with up to 50 chars (e#332)
- `Fixed` Removing last Tag from photo not possible in Firefox (e#269)

### v3.0.0

Released May 6, 2015

**Warning**: You need to enter a new username and password when upgrading from a previous version. Your installation is accessible for everyone till you enter a new login by visiting your Lychee. Both fields are now stored in a secure way. Legacy md5 code has been removed.

**Warning**: Upgrading from a previous version will set *all* public albums to private. Passwords  are now stored in a secure way. Legacy md5 code has been removed.

**Warning**: We recommend to backup your database and photos before upgrading to the newest version.

**Deprecated**: Photos uploaded with Lychee v1.1 or older aren't supported anymore. Thumbnails  fail to load on high-res screens.

- `New` Redesigned interface, icons and symbols
- `New` Rewritten Front-End
- `New` Dialog system now based on [basicModal](https://github.com/electerious/basicModal)
- `New` Context-menus now based on [basicContext](https://github.com/electerious/basicContext)
- `New` Edit the sharing options of a public album
- `New` Quickly switch between albums and photos by clicking the title in the header
- `New` Renamed API functions
- `New` Merge albums (Thanks @rhurling, e#340, e#341, e#166)
- `New` iPhone 6 Homescreen icon
- `Improved` Performance of animations
- `Improved` Prevent download of deleted albums/photos
- `Improved` Opening a private photo when logged out now shows an error
- `Improved` Reduced attribute changes to improve performance
- `Improved` Interact with the content while the sidebar stays open
- `Improved` Username and password now stored in a safer way
- `Improved` Album passwords now stored in a safer way
- `Improved` Don't refresh albums when password-input canceled by user
- `Improved` Additional Open Graph Metadata (e#299)
- `Improved` Check allow_url_fopen (e#302)
- `Fixed` Prevent ctrl+a from selecting the sidebar (e#230)
- `Fixed` Removed unused scrolling bars in FF (e#316, e#289)

And much more…

---

## Version 2

### v2.7.2

Released April 13, 2015

- `Fixed` Prevented remote code execution of photos imported using "Import from URL" (Thanks Segment S.r.l)
- `Fixed` Stopped view.php from returning data of private photos

### v2.7.1

Released January 26, 2015

- `Improved` auto-login after first installation
- `Fixed` Disabled import of the medium-folder
- `Fixed` error when using apostrophes in text #290
- `Fixed` $medium is now a tinyint like defined in the database structure
- `Fixed` incorrect height calculation for photos
- `Fixed` creation of test db e#295
- `Fixed` a warning caused by set_charset e#291

### v2.7

Released December 6, 2014

- `New` Intermediate sized images for small screen devices #67
- `New` Added Docker help (@renfredxh, e#252)
- `New` Move-Photo context shows album previews
- `Improved` Upload shows server-errors
- `Improved` Improved thumb creation
- `Improved` Docker (@renfredxh, e#252)
- `Improved` CSS has been rewritten partly
- `Improved` Front-end has been rewritten partly e#245
- `Improved` Folder- and code-structure has been updated
- `Improved` Context-menu now based on [basicContext](https://github.com/electerious/basicContext) e#245
- `Fixed` OpenGraph image too big for some sites e#69
- `Fixed` Wrong sizes after EXIF rotation
- `Fixed` Returning to 'Albums' after searching failed
- `Fixed` Move-Photo not scrollable e#215

### v2.6.3

Released October 10, 2014

- `New` Caching for albums (Thanks @r0x0r, e#232)
- `New` Save scroll position of albums (Thanks @r0x0r, e#232)
- `New` Added Dockerfile (@renfredxh, e#236)
- `Improved` Newest album on the top (Thanks @r0x0r, e#232)
- `Fixed` Login in private mode (Safari)
- `Fixed` Drag & Drop with open photo
- `Fixed` Wrong modified date of the photo files
- `Fixed` Search function always returned all photos (Thanks @powentan, e#234)

### v2.6.2

Released September 12, 2014

- `New` Select all albums/photos with `cmd+a` or `ctrl+a`
- `New` Detect duplicates and only save one file (e#48)
- `New` Duplicate photos (e#186)
- `New` Added contributing guide
- `New` Database table prefix for multiple Lychee installations (e#196)
- `Improved` Use IPTC Title when Headline not available (e#216)
- `Improved` Diagnostics are showing system information
- `Improved` Harden against SQL injection attacks (e#38)
- `Fixed` a problem with htmlentities and older PHP versions (e#212)

### v2.6.1

Released August 22, 2014

- `New` Support for IE >= 11 (e#148)
- `New` Choose if public album is downloadable or not (e#191)
- `Improved` Albums gradient overlay is less harsh (e#200)

### v2.6

Released August 16, 2014

- `New` Rewritten and redesigned Uploader (e#101)
- `New` Custom server-import directory (e#187)
- `New` Plugin documentation
- `Improved` Database and installation process (e#202 #195)
- `Improved` "No public albums" now easier to read (e#205)
- `Fixed` Don't show EXIF info when not available (e#194)

### v2.5.6

Released July 25, 2014

- `New` Choose if album should be listed public (e#177)
- `New` Gulp instead of Grunt with autoprefixer
- `Improved` Slightly better performance when opening big albums
- `Improved` Checksum with sha1 instead of md5 (e#179)
- `Fixed` Missing public badge on public albums
- `Fixed` Wrong path for public photos in view.php
- `Fixed` Wrong link to thumbs when searching
- `Fixed` Wrong date in album view when takestamp was null
- `Fixed` It wasn't possible to rename albums while searching
- `Fixed` It was possible to right-click on SmartAlbums after searching

### v2.5.5

Released July 5, 2014

- `New` Smart Album "Recent"
- `New` Checksum of photo in database (e#48)
- `New` Show takedate in photo-overlay (when available)
- `Improved` Permission check when running with the same UID (e#174)

### v2.5

Released June 24, 2014

- `New` Swipe gestures on mobile devices
- `New` Plugin-System
- `New` Rewritten Back-End
- `New` Support for ImageMagick (thanks @bb-Ricardo)
- `New` Logging-System
- `New` Blowfish hash instead of MD5 for all new passwords (thanks @bb-Ricardo)
- `New` Compile Lychee using Grunt (with npm and bower)
- `New` Open full photo without making the photo public
- `Improved` Shortcuts
- `Improved` Album share dialog
- `Improved` Database update mechanism
- `Improved` Download photos with correct title (thanks @bb-Ricardo)
- `Improved` EXIF parsing
- `Improved` URL and Server import (thanks @djdallmann)
- `Improved` Check permissions on upload
- `Fixed` Wrong capture date in Infobox
- `Fixed` Sorting by takedate

### v2.1.1

Released March 20, 2014

- `New` Delete albums with cmd + backspace
- `New` Using iOS 7.1 minimal-ui
- `Improved` Faster loading of single photos
- `Improved` Faster and snappier animations
- `Improved` Better dialog when clearing Unsorted
- `Fixed` Warning when uploading images without EXIF-Data
- `Fixed` Close upload on error

### v2.1

Released March 4, 2014

Important: You need to reenter your database credentials and set the correct rights for `data/`, when updating from a previous version.

- `New` Multi-select (e#32)
- `New` Multi-folder import from server (e#47)
- `New` Tagging (e#5)
- `New` Import of original image name (e#39)
- `New` Makefile
- `Improved` Upload-process
- `Improved` Documentation
- `Improved` Overlay for photos
- `Fixed` Dropbox import (e#84)
- `Fixed` Wrong login or password annotation (e#71)
- `Fixed` Escaping issue (e#89)
- `Moved` Config now located in `data/`

### v2.0.3

Released February 26, 2014

- Critical security fix
- Notifications for Chrome

### v2.0.2

Released January 30, 2014

- Clear search button (e#62)
- Speed improvements (e#57)
- Show tooltip when album/photo title too long (e#66)
- Fixed php notices
- Avoid empty downloads in empty albums (e#56)
- Correct position of upload modal on mobile devices
- Improved security

### v2.0.1

Released January 24, 2014

- Share > Direct Link
- Download individual images (e#43)
- ContextMenu stays within the window (e#41)
- Prevent default ContextMenu (e#45)
- Small ContextMenu improvements
- Small security improvements

### v2.0

Released January 22, 2014

- All new redefined interface
- Faster animations and transitions
- Import from Dropbox
- Import from Server
- Download public albums
- Several sorting options
- Installation assistant
- Infobox and description for albums
- Faster loading and improved performance
- Better file handling and upload
- Album covers are chosen intelligent
- Prettier URLs
- Massive changes under the hood
- IPTC support (Headline and Caption)
- EXIF Orientation support

### v1.3.2

Released November 21, 2013

This update includes small fixes and enhancements.

### v1.3.1

Released September 8, 2013

- Twitter Cards and Open Graph support for shared photos
- Option to set album-password directly after clicking "Make Public"
- Download Album works again

### v1.3

Released Septermber 3, 2013

New:
- Protect public albums with passwords
- Export to Dropbox
- Sharing-Link is displayed directly inside the sharing-dropdown
- Delete photos with cmd+backspace

Improved:
- Massive speed improvements
- Changing the title, starring, description, etc. is now instant
- Longer filenames for pictures (more security)

ShortLinks are removed for more independency and privacy.
There are a lot of changes under the hood, including a lot of bug fixes and improvements. Please report every bug you find!

### v1.2

Released June 17, 2013

- Share whole albums
- Public Mode
- Import images via URL
- New Share-Button
- Improved Toolbar
- Check for updates (see config.php)
- ASC or DESC sorting (see config.php)
- Download album fixed
- Code optimizations (thanks @tibounise)
- Changes and enhancements

### v1.1

Released May 3, 2013

- FTP Sharing
- New Upload & New Search
- Performance and stuff under the hood
- Desktop Notifications
- Right-Click on photos and albums
- Retina Thumbs
- Improved Interface

### v1.0.2

Released January 15, 2013

- Better mobile experience
- New Login
- jQuery update
- Small fixes and enhancements

### v1.0.1

Released October 25, 2012

- Improved ImageView
- Login-Window now shows the version of Lychee
- iPhone Homescreen Icon
- Improved Readme with Pictures



### v1.0

Released October 2, 2012

- Lychee v1.0
