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

## Version 6

### v6.4.1

Released on Mar 28, 2025

#### Fixes...

`klo` refers to *Keep the Light On*. In other words, basic software updates.  

* `klo` #3058 : Refactoring & simplify by @ildyria.
* `fixes` #3147 : Fix S3/symlink mitigation conflation by @RickyRomero.
* `klo` #3145 : phpstan: level 2 by @ppshobi.
* `klo` #3161 : Composer update by @ildyria.
* `fixes` #3164 : Fix 500 error when downloading pictures by @ildyria.
* `klo` #3140 : Dropping Legacy path for Photo create by @ildyria.
  > We were already rolling with the PIPE version for a while as the value was defaulted to true:
  > `'create-photo-via-pipes' => (bool) env('PHOTO_PIPES', true),`  
  > Nobody complained so far, so bye bye old path.
* `fixes` #3152 : Pin tailwind 4.0.6, add cursor feedback on images & others by @ildyria.


### v6.4.0

Released on Mar 23, 2025

#### Mostly a klo release, but a spicy one!

One of the weakness of our codebase was a constant mix between camelCase and snake_case.
This was due to the combination of:
- the database attributes being in snake_case
- the old style php being in snake_case
- some recent contributions being in camelCase
- Matthias and Ildyria are also a enterprise grade developers (understand Java, C++, C#) and we are used to camelCase.

As a result, ppshobi decided to write a rector rule to convert all the code base to a single standard.
After further thoughts, we decided to go with snake_case. This is a bit more verbose, but it is easier to read when you are not use to camelCase.

#### Changes

`SE` refers to functionalities that are aimed at the Supporter Edition.

* `new` #3100 : feat: custom variable casing rector rule to convert camelCase vars to snake_case by @ppshobi.
* `fixes` #3107 : Do not upload placeholders to S3 by @ildyria.
  > The placeholder are base64 encoded directly in the database, as a result, when the jobs uploading 
  > the images to S3, they couldn't find the non-existing images and were crashing.
  > We fixes this.
* `klo` #3104 : Improve baseline by @ildyria.
  > Due to migration to Phpstan v2, we had to reset our baseline.
* `klo` #3109 : Snakecasify variables in app/Actions/Photo by @ildyria.
* `new` #3091 : feat: basic docker-compose setup by @ppshobi.
* `klo` #3112 : snakecasify app/Actions/User by @ildyria.
* `klo` #3113 : snakecasify app/Assets by @ildyria.
* `klo` #3110 : snakecasify app/Actions/RSS by @ildyria.
* `klo` #3116 : snakecasify app/Casts by @ildyria.
* `klo` #3111 : snakecasify app/Actions/Diagnostics by @ildyria.
* `klo` #3122 : snakecasify app/Jobs by @ildyria.
* `klo` #3119 : snakecasify app/Factories by @ildyria.
* `klo` #3115 : Snake caseify  `app/Actions/Import` by @ppshobi.
* `klo` #3120 : snakecasify app/Http/Middleware by @ildyria.
* `klo` #3117 : Snakecasify app/Console by @ildyria.
* `klo` #3121 : snakecasify app/Images by @ildyria.
* `klo` #3118 : snakecasify app/Exceptions by @ildyria.
* `klo` #3124 : snakecasify app/Metadata by @ildyria.
* `klo` #3125 : snakecasify app/ModelFunctions by @ildyria.
* `klo` #3126 : snakecasify app/Policies by @ildyria.
* `klo` #3127 : snakecasify app/Relations by @ildyria.
* `klo` #3128 : snakecasify app/Models by @ildyria.
* `klo` #3132 : snakecasify app/SmartAlbums by @ildyria.
* `klo` #3133 : snakecasify app/View by @ildyria.
* `klo` #3137 : snakecasify app/Http/Controllers by @ildyria.
* `klo` #3130 : snakecasify app/DTO by @ildyria.
* `klo` #3139 : snakecasify app/Legacy by @ildyria.
* `klo` #3138 : snakecasify app/Http/Resources by @ildyria.
* `new` #3045 : Refactor Album page into 2 components: display - actions by @ildyria.
  > This is may seem a small change, but this means that effectively the album page is loaded behind the photo view.
  > As a result, if you go back from a photo to the album view, you no longer have a scroll down and triggering the
  > loading of all the images (even though they were set to be lazy loaded).
* `SE` #3045: Add favourite support by @ildyria.
  > This is a feature that is only available for our Sponsors. It allows any anonymous users to mark a photo as favourite.
  > This is implemented in a privacy friendly way: the favourite is stored in the local storage of the browser.
  > As a result, the favourite is only available on the browser that marked the photo as favourite (no cross-device communication, no data on the server).
* `klo` #3142 : snakecasify all left in app/Actions (#3123) by @ildyria.
* `fixes` #3136 : Ignore some specific files from being rectorified. by @ildyria.
  > Due to licensing constraint, we prefer to not touch some files which were directly imported as is (under MIT license).
* `klo` #3135 : snakecasify app/Http/Requests by @ildyria.
* `klo` #3131 : snakecasify app/Rules by @ildyria.
* `klo` #3144 : snakecasify the missing directories by @ildyria.
* `klo` #3143 : version 6.4.0 by @ildyria.

### v6.3.5

Released on Mar 19, 2025

#### PHPSTAN 2.0 and a new contributor: ppshobi!

We have the pleasure to announce that @ppshobi has joined the team as a developer.
He has been working on the codebase for a while now and has been a great help in the transition to PHPSTAN 2.0.
We are looking forward to his future contributions.

#### Changes

* `klo` #3044 : Refactor a bit of UI. by @ildyria.
* `new` #3034 : Add opcache enabled check by @ildyria.
  > Mostly useful for debugging purposes.
* `new` #3059 : Improved left menu by @ildyria.
  > This makes the menu more in line with current UI standards.
* `fixes` #3064 : Exclude /feed from content type check by @ildyria.
  > When loading feeds with Content-Type: application/xml, Lychee was crashing wrongly.
* `klo` #3062 : Special characters cannot be used for the database password by @ildyria.
  > Though not recommnended as it complexifies the way you have to install Lychee.
* `SE` #3069 : Allow anonymous users to upload by @ildyria.
  > This is only available for our Sponsors, this is also very niche option.
  > The owner of the album can now decide whether anonymous users can upload to the album.
  > There is no image validation, as a result, you are responsible for the content that is uploaded.
  > Use at your own risk.
* `klo` #3070 : Move legacy translations to Legacy folder by @ildyria.
  > This is in preparation of the removal of the v4 front-end and to avoid confusion on translation work needed.
* `fixes` #3078 : isDocker should return false if fails by @ildyria.
  > The function was crashing when the file was innaccessible, rendering the diagnostic page... effectively useless.
* `new` #3080 : Add vue-component-analyzer by @ildyria.
  > This is for our reviewers so they can get a better understanding of the front-end architecture.
* `new` #3082 : Do not open a new tab when downloading pictures by @ildyria.
* `new` #3085 : feat: `npm run build-dev` to build js/css etc... assets without minif… by @ppshobi.
* `klo` #3079 : Fix handle button in toggle being too big. by @ildyria.
* `new` #3088 : install rector & update phpstan -> set level to 1 and fix errors by @ppshobi.
  > Preparatory work for the rector runs and version 6.4.0
* `fixes` #3087 : Drop middleware not existing to avoid a 500 by @ildyria.
* `new` #3090 : fix: rector default run by @ppshobi.
* `fixes` #3086 : Fix Mod frame button not visible by @ildyria.
* `new` #3097 : Polish translations thanks to @jarex691 by @ildyria.
* `new` #3101 : Fix untranslated strings + more PL translations thanks to @jarex691 by @ildyria.
* `klo` #3102 : Add logging line to know which size variant crashed. by @ildyria.
* `klo` #3105 : Version 6.3.5 by @ildyria.

#### New Contributors

* @ppshobi made their first contribution in https://github.com/LycheeOrg/Lychee/pull/3085

### v6.3.4

Released on Feb 28, 2025

#### Changes

* `klo` #3027 : Add Diagnostics cache checks by @ildyria.
* `klo` #3035 : Scroll top button for album and albums views by @sancsin.
* `klo` #3023 : Split-oauth endpoint to reduce the number of requests. by @ildyria.
* `klo` #3046 : Simplified Chinese localization by @x1ntt.
* `klo` #3047 : Version 6.3.4 by @ildyria.

### v6.3.3

Released on Feb 21, 2025

#### Changes

* `new` #3015 : Do not display useless message in diagnostics by @ildyria.
* `fixes` #3011 : Handle failing encoding gracefully by @ildyria.
* `new` #3012 : Add config option for the number of operations done by @ildyria.
* `new` #3013 : Full permission check is now disabled by default by @ildyria.
* `se` #3014 : Add more privacy options by @ildyria.
* `se` #2983 : Add more statistics: punch card a la GitHub (SE) by @ildyria.
* `fixes` #3032 : Fix aspect ratio being dropped due to Tree shaking by @ildyria.
* `new` #3026 : Add more markdown processing options by @ildyria.
* `klo` #3028 : Offboarding Sonar - done with it breaking randomly... by @ildyria.


**Full Changelog**: https://github.com/LycheeOrg/Lychee/compare/v6.3.2...v6.3.3

### v6.3.2

Released on Feb 17, 2025

#### Changes

* `fixes` #3007 : Fix wrong translation keys by @ildyria.
* `new` #3009 : RSS Feed Enhancements (enclosure + category) by @cdzombak.
* `fixes` #3010 : Fix missing dependency in production build by @ildyria.

#### New Contributors
* @cdzombak made their first contribution in #3009

**Full Changelog**: https://github.com/LycheeOrg/Lychee/compare/v6.3.1...v6.3.2


### v6.3.1

Released on Feb 15, 2025

#### Changes

* `fixes` #3006 : catch Error when Redis is crashing and not die in 500... by @ildyria.
  > Mis-configuration of redis cache could crash the server catastrophically. The user had to change their
  > `.env` file into insecure settings in order to be able to debug the issue. Instead we just log the crash
  > in error log and execute the request as expected.

### v6.3.0

Released on Feb 14, 2025

#### Localization Reset !

With the version 6, a lot of the strings were still hard coded in the front-end.
We have now moved all the strings to the back-end and we have had to reset the localization.
This means that all the strings are now in English and you will have to re-translate them.

If you would like to help us have a look at your language files in the `resources/lang` folder and submit a PR.
Please ignore the lychee.php file as it is the Legacy file and will be removed in a future version.

#### Caching for performance improvements

Lychee version 6.3 provides significant performance improvements by adding support for caching the API GET request.
**This feature is disabled by default** and **can be enabled in the settings**.

If you would like to use redis as a cache driver, you can set the following values in your `.env` (or similar):

> `CACHE_DRIVER=redis`
> `REDIS_URL=redis://default:@127.0.0.1:6379`
> `REDIS_HOST=127.0.0.1`
> `REDIS_PORT=6379`
> `REDIS_PASSWORD=`

We also recommend that you set in order to retain access to your logs if the redis connection is broken:

> `LOG_VIEWER_CACHE_DRIVER=file`


#### Changes

* `klo` #2824 : Composer + npm update by @ildyria.
* `fixes` #2823 : Fix user count not updated on front-end when creating new users by @ildyria.
* `new` #2825 : Update README.md by @tinohager.
* `fixes` #2827 : Optimize User Management by @tinohager.
* `fixes` #2830 : Remove Keyboard Navigation help view on mobile by @tinohager.
* `fixes` #2829 : Fix dialog width for mobile  by @tinohager.
* `fixes` #2849 : Fixes upload fails for non-existent partner video upload to S3 by @kiancross.
* `fixes` #2852 : Fix functionality to hide back button when configuration is set by @kiancross.
* `fixes` #2851 : Fix aesthetics of footer social icons by @kiancross.
* `new` #2850 : Add scroll to top when pressing the 'i' or clicking on details by @ildyria.
* `fixes` #2856 : Exit with error for unsupported S3 backend by @kiancross.
* `new` #2846 : Force redirection if accessing urls where being logged is required by @ildyria.
* `fixes` #2858 : Fix webauthn not showing up by @ildyria.
* `new` #2860 : Minor UI improvements by @ildyria.
* `klo` #2845 : dependencies updates by @ildyria.
* `new` #2847 : Improve spinner on Mobile UI by @ildyria.
* `fixes` #2870 : Fix missing include in `hook-redirection.blade.php` by @kiancross.
* `new` #2869 : Resolve route name clashes to enable cache generation by @kiancross.
* `new` #2871 : Add additional CSP header configuration options by @kiancross.
* `fixes` #2857 : The eye does nothing if there are no hidden albums by @ildyria.
* `new` #2867 : Update french translation by @jphuguet.
* `fixes` #2874 : Fix download image on context menu by @ildyria.
* `fixes` #2875 : End of Line fixed during clone to avoid prettier to mess up formatting by @ildyria.
* `klo` #2876 : Drop laminas-text, add related source files to Lychee by @ildyria.
* `fixes` #2879 : Fixes "Videos not loading when going consecutively" by @sancsin.
* `klo` #2880 : Fix sonar warning by @ildyria.
* `klo` #2881 : Npm/composer update by @ildyria.
* `klo` #2884 : Dropping support of php8.2 by @ildyria.
* `klo` #2885 : Update artifact actions by @ildyria.
* `fixes` #2887 : Improve version wording by @ildyria.
* `fixes` #2877 : **Reset localization** (sorry) + improved clarity of language setup by @ildyria.
* `fixes` #2888 : UI fix maintenance button alignment by @ildyria.
* `fixes` #2893 : Use h-40 instead of h-56 for maintenance block by @ildyria.
* `fixes` #2892 : Fix diagnostics not being complete on version 6 by @ildyria.
* `new` #2894 : Add Docker info, do not display Update Maintenance on docker by @ildyria.
* `fixes` #2899 : Fix docker status always returning custom by @ildyria.
* `fixes` #2898 : Fixes Session timeout error #2896 and #2897 by @sancsin.
* `klo` #2914 : Group dependencies update from dependabots by @ildyria.
* `klo` #2891 : Add license + copyright to all files by @ildyria.
* `new` #2919 : Update README.md by @Espionage724.
* `new` #2927 : Implements enhancement ideas in #2924 and #2925 and fixes #2925 by @sancsin.
  > \#2924 : Video finishing before moving to next photo/video in slideshow mode  
  > \#2925 : Next and Previous buttons hidden when in slideshow mode
* `fixes` #2929 : Fix links from LycheeOrg.github.io to LycheeOrg.dev by @ildyria.
* `klo` #2928 : Mark all legacy classes as final by @ildyria.
* `klo` #2930 : Set up codeowners in simple way by @ildyria.
* `klo` #2931 : Remove some exceptions from phpstan.neon by @ildyria.
* `klo` #2923 : Improve code coverage by @ildyria.
* `fixes` #2936 : Zip are directly GET requests we do not have the XSRF token by @ildyria.
* `new` #2945 : Scroll to thumbnail of viewed photo in Album View by @sancsin.
* `fixes` #2922 : Add configuration integrity check by @ildyria.
* `klo` #2921 : Check that the copyright notice is present in all files by @ildyria.
* `new` #2947 : Add latency middleware to see loading times in development by @ildyria.
* `fixes` #2948 : Fix forgotten to cast to boolean by @ildyria.
* `klo` #2952 : Update csp config with base by @ildyria.
* `new` #2955 : Add a feature flag to disable the content-type verification by @ildyria.
* `new` #2958 : Add a small heartbeat endpoint (`/up`) by @ildyria.
* `fixes` #2959 : Minor UX UI improvements by @ildyria.
* `klo` #2960 : Add license checker by @ildyria.
* `fixes` #2962 : Fix cors setting on Vite 6.0.9 by @ildyria.
* `new` #2954 : Allow to edit taken_at date by @ildyria.
* `klo` #2973 : Add class-leak checker by @ildyria.
* `new` #2938 : Add modal for creating sharing by @ildyria.
* `new` #2950 / #2951 : Sharing propagation by @ildyria.
* `fixes` #2977 : Fixes the delete button text by @RustyPotato.
* `fixes` #2978 : Fixes Displayed Times in Jobs page by @RustyPotato.
* `fixes` #2979 : Fixes more missing dialog strings by @RustyPotato.
* `new` #2859 : Add Caching for faster response time by @ildyria.
* `klo` #2981 : Make sure that all v2 API routes are covered by the caching by @ildyria.
* `fixes` #2982 : Fix landing page animations by @ildyria.
* `fixes` #2990 : Fix broken build on ARM by @ildyria.
* `fixes` #2994 : Fixes #2993 and #2992 by @sancsin.
  > \#2992 : Photos in-between two selected photos are not selecting when using shift-select to select multiple photos.  
  > \#2993 : Albums in-between two selected albums are not selecting when using shift-select to select multiple albums in gallery view.
* `new` #2890 : Frontend part of Duplicate Finder by @ildyria.
* `new` #2889 : Backend part of Duplicate Finder by @ildyria.
* `fixes` #2934 : Php 32bit - Zip-stream with version 2.1 instead of 3.1 by @ildyria.
  > This allows users of php with 32 bits to use the zip download feature.
  > Zip-Strean 3.1 only supports 64 bits systems, as a result we allow to use Zip-stream 2.4 or 3.1 depending of the architecture.
  > In such case, we advise 32 bits users to remove their `composer.lock` and do a `composer install` as the `composer.lock` is targetted at 64 bits builds.
* `fixes` #2996 : Fix api doc not showing by @ildyria.
  > Api docs were broken for an obscure reason.
* `new` #3001 : Feature: Authelia login support by @usmanatron.
* `klo` #3003 : Update dependencies + fix CVE complaint from OSSF by @ildyria.
* `klo` #3004 : Improve .env.example by @ildyria.

#### New Contributors

* @jphuguet made their first contribution in #2867.
* @sancsin made their first contribution in #2879.
* @Espionage724 made their first contribution in #2919.
* @RustyPotato made their first contribution in #2977.
* @usmanatron made their first contribution in #3001.

#### New Developer

We welcome @sancsin in the team. He already made valuable contributions to the project.

#### New Reviewers

We welcome @RonnieTaz and @jasonmillward in the reviewing team.
They are going to help us with changes, relieving some of the pressure from @d7415 .

**Full Changelog**: https://github.com/LycheeOrg/Lychee/compare/v6.2.0...v6.3.0


### v6.2.0

Released on Dec 17, 2024

#### Fixes and new documentation

While this release is mainly focused on fixing bugs, we add back the live API documentation page.
We implemented a type inference system that allows scramble to also support the Spatie Data objects.

#### Changes

* `fixes` #2757 : Change the plaintext-field to a password-field in AlbumUnlock by @Gendra13.
  > Minor oversight, the password was displayed in clear text at input.
* `klo` #2756 : Documentation stuff by @ildyria.
* `fixes` #2759 : Fix error appearing when clicking on `+` menu in Smart albums by @ildyria.
* `new` #2761 : Add password unlocking middleware by @ildyria.
  > The user can now directly provide a ?password=xxx in the URL to unlock the album.
* `fixes` #2760 : Fix copy move selection by @ildyria.
* `new` #2751 : Add Album loading progress spinner by @tinohager.
  > Quality of life improvement, the user now knows when the album is loading.
* `new` #2785 : Close left menu when loading the gallery by @ildyria.
  > Remove one click when going back to the gallery.
* `new` #2784 : Add configuration setting for number of albums per row in mobile view by @ildyria.
  > The admin can now set the number of albums per row in mobile view (width smaller than 640px).
  > Some users might prefer to have a single album per row.
* `fixes` #2788 : Fix hidden gallery footer social icons by @pmrowla.
* `fixes` #2766 : Fixes Justify layout by @ildyria.
  > Hopefully this removes the re-rendering when selecting pictures due to computational width changes.
* `new` #2768 : Add page that allows to fix broken trees by @ildyria.
  > This is a now page which allows the admin to completely break their Lychee install.
  > We do not recommend you to use it. It is only for the most desperate cases.
  > Knowledge of Nested tree structure is required.
* `fixes` #2805 : Small fixes for mobile view by @tinohager.
* `fixes` #2806 : Code cleanup, resort imports by @tinohager.
* `new` #2808 : Activate Focus on Input elements by @tinohager.
* `fixes` #2810 : Fix disabling the copyright in footer not working as expected by @ildyria.
  > Configuration option was not applied properly on the front-end.
* `fixes` #2811 : Improve instruction for using tags by @ildyria.
  > In version 4 and 5, tags were comma separated. In version 6, they are to be confirmed by pressing enter.
  > This behaviour was not properly documented.
* `new` #2812 : API documentation improved and auto generated by @ildyria.
  > This is page is not directly advertised on the server, but available at `/docs/api`.

### v6.1.2

Released on Nov 27, 2024

#### Changes

* `fixes` #2745 : Avoid preventing rendering when albums is returning 401 by @ildyria.
  > This bug was triggered by requiring login on root to access the gallery.
* `fixes` #2746 : Fix photo timeline when there are no borders by @ildyria.
  > Bug introduced by the new timeline layout that was only affecting the photo layout when the absence of border was set in Lychee SE
* `new` #2749 : Create automated signed releases by @ildyria.
  > We use [cosign](https://github.com/sigstore/cosign) to generate signed releases.
  > The public key is available here: [lychee-cosign.pub](https://lycheeorg.dev/lychee-cosign.pub).
* `fixes` #2753 : ListAlbum fix by @ildyria.
  > When using extremely long albums names, the limiting of strings were getting negative length.
  > This resulted in error 500 when fetching the list of target albums.

### v6.1.1

Released on Nov 26, 2024

Small patch that aims to fix issues introduced in the latest release.

#### Changes

* `fixes` #2738 : Fix Authentik icon by @sushain97.
* `fixes` #2741 : Fix wrong config in smart albums by @ildyria.
* `fixes` #2743 : Fix create Tag album callback not triggering by @ildyria.

### v6.1.0

Released on Nov 25, 2024

#### Fixes and new layout: Timelines

We are introducing a new layout for albums: Timelines. This layout is a new way to display your pictures in a chronological order.
You can enable it per album in the album settings or globally.

Additionally, we thank @aSouchereau for the new LQ Image Placeholder: a heavily blurred version will be displayed while a higher quality thumb is loading.
We also thank @nanawel for adding the Authentik support to the Oauth provider.

#### Changes

* `new` #2629 : Get automated signed releases by @ildyria.
* `fixes` #2630 : Fix sub-albums sorting not being respected per album by @ildyria.
* `new` #2633 : Enable lazy loading for pictures past number 10 in an album by @ildyria.
* `fixes` #2634 : Fix building artifact in Integrate workflow by @d7415. 
* `new` #2636 : Vite local dev by @ildyria.
  > Allows local front-end development with Vite without having to install the full php stack.
  > See .env.example for instructions
* `fixes` #2638 : Fix icons missing on map by @ildyria.
* `klo` #2653 : Composer update + phpstan by @ildyria.
* `fixes` #2652 : Improve support for free-bsd by @ildyria.
* `fixes` #2654 : Improved support for Heic - suggested by @Borisvl by @ildyria.
* `new` #2661 : Low Quality Image Placeholder cont by @aSouchereau. 
* `new` #2674 : Add ability to toggle H on touch devices by @ildyria.
* `new` #2664 : Avoid revealing Lychee keys when making videos by @ildyria.
* `fixes` #2676 : Do not show placeholder data in statistics by @ildyria.
* `new` #2677 : Add scroll to top element by @ildyria.
* `fixes` #2682 : Fix error 500 when accessing Tag album as anonymous user by @ildyria.
* `fixes` #2685 : Fix date not being properly displayed due to Carbon3 change by @ildyria.
* `fixes` #2684 : Fix delete not closing parent info dialog by @ildyria.
* `fixes` #2683 : Fix 422 when opening frame in smart-album by @ildyria.
* `fixes` #2687 : Fix src-set not properly defined by @ildyria.
* `fixes` #2690 : Avoid crash and die when generating smaller size variants by @ildyria.
* `fixes` #2688 : Fix error 403 on access directly password protected albums by @ildyria.
* `new` #2673 : Timeline settings + fix discovery of sensitive photos by @ildyria.
* `klo` #2710 : Bumps dependencies by @ildyria.
* `fixes` #2693 : Fix duplicate upload + add scroll remembering by @ildyria.
* `new` #2714 : Added Authentik support by @nanawel.
* `klo` #2735 : Bump dependencies by @ildyria.
* `new` #2679 : Support more layouts + Timeline in albums/album by @ildyria.
* `SE`  #2679 : Add Timeline granularity customization by @ildyria.
* `new` #2717 : Add copy to clipboard button in Diagnostics page by @ildyria.


### v6.0.1

Released on Oct 31, 2024

#### Changes

* `fixes` #2607 :  Fix icons when using sub-folder install by @ildyria.
* `fixes` #2605 :  Fix login menu not visible when set to the right by @ildyria.
* `klo` #2609 :  [StepSecurity] Apply security best practices by @step-security-bot.
* `klo` #2621 :  Disable snq if secret is not set by @ildyria.
* `fixes` #2624 :  Fix link to Logs in case of sub folder hosting by @ildyria.
* `new` #2625 :  Add link to album from sharing page by @ildyria.


### v6.0.0

Released on Oct 26, 2024

#### Dropping Livewire for Vue3

When we released version 5, we did not realize how much of a mistake switching to Livewire was.
Lychee's front-end became slow and sluggish, plagued with issues.
Most of the time as a work around, we had to advise users to disable version 5 of the front-end
by setting the environment variable `LIVEWIRE_ENABLED=false`.

With this in mind, at the end of June we came to the conclusion that we needed to build a new front-end from scratch.
We decided to go with Vue3, as it is a more mature framework and has a lot of support. This marks the begining of the Lychee version 6.

For more context on those changes, see our blog posts:

- Jun 25, 2024 - [Livewire performances problems 📉](/2024-06-25-performance-problems/)
- Jun 29, 2024 - [The future of Lychee: what is coming next. 🚀](/2024-06-29-future-of-lychee/)
- Sep 24, 2024 - [About Lychee API documentation](/2024-09-24-v6-scramble/)


#### Introducing Lychee SE

For the past few years, Lychee has been developed by a [small group of people](https://lycheeorg.dev/support/) who have been working on it in their free time. We are proud to offer this software for free and we will continue to do so. However with time our team has decreased to the point where maintaining Lychee has become a challenge. We have been thinking about ways to keep Lychee alive, to be able to keep providing support, and to add more features.

We have come to the conclusion that we need to add a sponsor tier system. We have extended Lychee with a new version called SE (Supporter Edition) which will be available for our GitHub supporters. This SE version comes with enhanced features and configurations, helping us fund ongoing improvements while offering a bit extra to our supporters. The free version of Lychee will continue to be available but with a more streamlined feature set.

We strongly encourage you to check the full comparison between the [free and supporter edition](https://lycheeorg.dev/get-supporter-edition).  
If you enjoy using Lychee, please consider [supporting us](https://github.com/sponsors/LycheeOrg).

Thank you for helping us keep Lychee alive and growing!

#### Important Docker Changes

If you are consuming Lychee via Docker, you will probably need to update your `docker-compose.yml` file.
In order solve the issue of temporary folders in the container, we added an extra volume `/lychee-tmp` which
by default with the updated `docker-compose.yml` will be mapped to `./lychee/tmp`, see [here](https://github.com/LycheeOrg/Lychee-Docker/blob/master/docker-compose.yml).

This volume allows you to control the temporary folder and avoid the issue of running out of space in the container.

#### Changes

`SE` refers to functionalities that are aimed at the Supporter Edition.

* `new` #106 : have "Search" on all views by @ildyria.
* `fixes` #126 : Add (optional) lossless rotation by @ildyria.
  > Add the ability to over-write the original image with a temporary backup if the image was rotated.
  > All the smaller sizes are normalized but the original is reverted back.
  > Effectively, this is not lossless rotation, this is just no rotation for the original.
* `fixes` #226 `SE` : Add counters for total pictures and subalbums by @ildyria.
  > We added a statistic page, allowing the users to check how much space they are using
  > and the total number of pictures and album that are in the library.
* `new` #520 `SE` : Show and limit the space used by @ildyria.
  > We introduced a quota system, allowing the admin to set a limit on the space used by each user.
* `fixes` #987 : Open image in new tab by @ildyria.
  > With the switch to Vue3, this feature is now fully functional.
* `new` #1420 : Album name in link preview by @ildyria.
* `new` #1641 `SE` : User note (only available to admin) by @ildyria.
  > Admin can now add notes to users. Those are only visible to the admin users.
* `fixes` #1987 : No space left on device by @ildyria.
  > This error was mostly due to having temporary folders in the containers but without any ability to empty them.
  > We now provide a UI to clean those folders, furthermore, those can now be mapped to a host directory.
* `new` #2082 : SEO optimization 1/3 - Setting `<title>` and `<meta>` tags by @ildyria.
  > The title and meta tag are directly fetched from the album targetted by the link.
* `new` #2086 : Feature request: light theme for Lychee by @ildyria.
  > Lychee now comes also with a Light theme, the user no longer needs to tweak their custom.css
  > as there is now a native support for both dark and light sides.
* `fixes` #2168 : Universal Drag & Drop and Paste to upload no longer work when using Livewire by @ildyria.
  > When moving to version 5, this functionality was lost. We now re-introduce it.
* `fixes` #2194 : Change album cover picture creates a slide show of all the picture after the selected one by @ildyria.
  > Version 5 had this annoying re-rendering of the album when changing the cover picture which was completely messed up.
  > By switching to Vue3, this is now fixed.
* `fixes` #2361 : Image selecting does not work on chrome + MacOS by @ildyria.
  > One of the main complaints of MacOs user was that CTRL was also opening the context menu.
  > We now support the CMD key for MacOs users, this should fix this issue.
* `fixes` #2495 : Inverted date on album tiles with multiple months by @ildyria.
  > We provide the ability to change the order of the dates displayed both in the thumbs and hero on albums, cathering to either user preferences.
* `dropped` : API Documentation.
  > We have decided to drop the API documentation end-point as it was not working anymore.
  > Read [more](https://lycheeorg.test/2024-09-24-v6-scramble/).

## Version 5

### v5.5.1

Released on Jul 5, 2024

#### Changes

* `fixes` #2487 : Fixes videos not loading from S3 due to unlisted CSP host by @RickyRomero.
* `new` #2490 : Add support for paths in php-exif by @ildyria.
* `fixes` #2492 : Fix error when opening tag album by @ildyria.
* `klo` #2493 : Simplify by @ildyria.

### v5.5.0

Released on Jun 26, 2024

**Note:** Migrated to Laravel 11. Might have some instability.

#### Changes

* `fixes` #2470 : Fix smart album not having visibilty option by @ildyria.
* `new` #2465 : Add some details for clockwork profiler to work by @ildyria.
* `new` #2468 : Allow to disable smart albums individually by @ildyria.
* `fixes` #2474 : Fix filename: no more double extension on download by @ildyria.
* `new` #2475 : Add ability to create user on the fly on Oauth auth step by @ildyria.
  > This adds 3 settings:
  > 
  > - `oauth_create_user_on_first_attempt`:  
  >   Allow user creation when oauth id does not exist.
  > - `oauth_grant_new_user_upload_rights`:  
  >   Newly created users are allowed to upload content.
  > - `oauth_grant_new_user_modification_rights`:  
  >   Newly created users are allowed to edit their profile.
* `fixes` #2477 : Fix timezone warning by @ildyria. 
* `klo` #2478 : Minor speed improvements by @ildyria. 
* `klo` #2479 : disable livewire array hack by @ildyria. 
* `new` #2480 : add option to disable login requirements on albums by @ildyria. 
* `klo` #2464 : Migrate to Laravel 11 by @ildyria.

### v5.4.0

Released on Jun 17, 2024

#### Changes

* `klo` #2460 : Composer update by @ildyria.
* `fixes` #2462 : Fix #2446: Apostrophes are allowed in names by @ildyria.
* `new` #2461 : Add login_required option so access is only after login in by @ildyria.


### v5.3.1

Released on Jun 9, 2024

#### Changes

* `fixes` #2421 : Fix `gen-sizevariants` button french translation by @HorlogeSkynet.
* `fixes` #2423 : Fix map not updating in sidebar view by @ildyria.
* `fixes` #2430 : Fix error cover option when selecting photo in smart album by @ildyria.
* `fixes` #2431 : Fix broken thumbnail by @ildyria.
* `fixes` #2435 : Fix order max-min in header to match order in thumbnail by @ildyria.
* `new` #2429 : Use random instead of sorted for thumbs of Smart Albumbs by @ildyria.
* `fixes` #2442 : Small improvements to French translation by @anantone.
* `fixes` #2444 : Fix additional_footer_text setting (#2445) by @leso-kn.
* `fixes` #2448 : Composer update + phpstan annotations + Improved speed by @ildyria.

### v5.3.0

Released on Apr 29, 2024

#### Note on S3 buckets support.

As this is a change by @Kovah and we are unfortunately not able to provide support on how to make it work.
Refer to https://laravel-news.com/using-aws-s3-for-laravel-storage for details of the settings.
**Any issues on that subject will be closed.** Sorry.

#### Changes

* `fixes` #2400 : Fix description empty string creating bug in layout by @ildyria.
* `new` #2379 : Add S3 bucket support by @Kovah.
* `fixes` #2411 : Fix teapot not flagging on phpinfo.php by @ildyria.
* `fixes` #2416 : Add migration on forgotten license CC-BY-SA by @ildyria.
* `fixes` #2413 : Fixes scrolling of details when description is too wide/long by @ildyria.
* `new` #1880 : Adding copyright to albums #1838 by @ThanasisMpalatsoukas.

### v5.2.2

Released on Apr 20, 2024

#### Changes

* `fixes` #2396 : Fixes HTTP 500 "Attempt to read property "photo_id" on null" on album page when no photo is found for header by @nanawel.
* `fixes` #2397 : Use portrait when landscape is not available for header image by @ildyria.

### v5.2.1

Released on Apr 19, 2024

**BROKEN - Use v5.2.2 instead.**

#### Canary

We provide the `PHOTO_PIPES` flag in `.env` to enable the future code flow to process images. 
By default its value is `false`.

#### Changes

* `klo` #2364 : Avoid crashing when livewire flag is set in tests by @ildyria.
* `klo` #2362 : More relevant diagnostic data, less privacy invasive by @ildyria.
* `new` via #2363 #2365 #2366 #2367 #2368 #2369 #2371 #2372 #2373 #2374 #2375 #2376:  
  Add optional (and future) pipeline flow to process images. This can be enabled by setting 
  `PHOTO_PIPES` to `true` in your `.env`
* `new` #2386 : New OAuth provider supported: keycloak by @jsaathof.
* `new` #2377 : New per-album setting to set the header image by @aSouchereau.
* `klo` #2387 : Remove non existing columns by @ildyria.
* `fixes` #2393 : Fix database license type by @ildyria.

### v5.2.0

Released on Apr 06, 2024

#### Anyone running version 5 should update without delays.

We strongly recommend anyone using Lychee version 5 to migrate as soon as possible to 5.2.
There are major bug fixes contained in this update, most notably when uploading multiple images at the same time.

#### The current LycheeOrg situation.

We are currently 2 active members (d7415 and myself). As a result development has been significantly slowed down.
If you like Lychee and wish to contribute, fix bugs and add new features you are more than welcome to join the team
or open pull requests.

#### Changes

* `new` #2242 : No more album ID within the history by @ildyria.
* `new` #2221 : Remove is_public & deprecated Public smart album by @ildyria.
* `fixes` #2245 : fix CVE-2020-8203 by @ildyria.
* `new` #2239 : Add pulse when jobs are waiting/processing by @ildyria.
* `fixes` #2246 : Avoid white flash on v4 redirection by @ildyria.
* `fixes` #2249 : Fix upload photo by @ildyria.
* `fixes` #2250 : Prebuild folders in storage by @ildyria.
* `new` #2251 : Improve diagnostics by adding check of temporary file systems by @ildyria.
* `klo` #2257 : Re-arrange commands by @ildyria.
* `fixes` #2256 : Null coalescence on css/js to catch when file does not exists by @ildyria.
* `fixes` #2252 : Add check for number of sizevariants without sizes by @ildyria.
* `klo` #2261 : Composer update by @ildyria.
* `klo` #2270 : Improve coverage by @ildyria.
* `fixes` #2264 : Avoid exception, add error when unlocking album by @ildyria.
* `fixes` #2291 : If LegacyIdException is thrown provide proper solution by @ildyria.
* `new` #2282 : Add support for Feature flags by @ildyria.
* `klo` #2269 : Mark some classes are readonly by @ildyria.
* `fixes` #2286 : Support migration on docker builds without off time by @ildyria.
* `fixes` #2298 : Add permission when user is not owner but creating an album by @ildyria.
* `klo` #2310 : Dependencies update by @ildyria.
* `fixes` #2140 : Fix Front-end bugs (swiping, uploading, margins) by @ildyria.
* `fixes` #2317 : Add preg_quote before doing glob() to escape regex characters by @ildyria.
* `new` #2309 : Add subalbum search by @Tombula.
* `klo` #2324 : Bump livewire/livewire from 3.4.6 to 3.4.9 by @dependabot.
* `klo` #2325 : Pinning dependencies + fix permissions by @ildyria.
* `fixes` #2304 : Support Paths on V5 with Livewire by @ildyria.
* `fixes` #2326 : Fix livewire breaking on non debug with sub folder by @ildyria.
* `fixes` #2333 : only owner users with upload rights are allowed to edit albums by @ildyria.
* `new` #2335 : Proper markdown support on descriptions by @ildyria.
* `klo` #2340 : Bump vite from 5.1.6 to 5.1.7 by @dependabot.
* `fixes` #2347 : Fix description markdown on the overlay by @ildyria.
* `fixes` #2346 : Fix share button always visible by @ildyria.
* `klo` #2338 : Composer update + formatting by @ildyria.
* `new` #2331 : Improve logic for nested values in arrays for language by @ildyria.
* `new` #2332 : Create maintenance page by @ildyria.
* `klo` #2330 : Channel version type is an Enum by @ildyria.
* `new` #2348 : add Optimize module to maintenance page by @ildyria.
* `new` #2349 : add Cleaning module by @ildyria.
* `new` #2350 : add Update module by @ildyria.
* `new` #2351 : Add fix tree module by @ildyria.
* `new` #2352 : add Fix Jobs module by @ildyria.
* `new` #2353 : Add button to generate missing size variants by @ildyria.
* `new` #2354 : Add module to fix the missing file sizes from size variants by @ildyria.


### v5.1.1

Released on Jan 22, 2024

#### Thank you @qwerty287

It is with great regret that we see one of our core contributors leave for personal reasons.
Their critical mind was really appreciated and they will be sorely missed.
We wish them success in all their future endeavors.

#### Import From Dropbox

This functionality is back, you will need to add your token and authorize your app on dropbox.
See more here: https://www.dropbox.com/developers/saver

#### Redirection of legacy links

We now provide the possiblity to redirect when using old links such as `https://lychee.test/#albumID/photoID`.
To enable this add `LEGACY_V4_REDIRECT=true` in your `.env`.
Do note that this relies on a javascript hook and therefore page reload.
If you did not share any links that way, leave as is. Default value is `false`. 

#### Changes

* `new` #2210 : Diagnostics are now available when migrations are pending by @ildyria.
* `fixes` #2215 : Fix import from Dropbox from Livewire side by @ildyria.
* `fixes` #2211 : Fix upload on smart albums by @ildyria.
* `fixes` #2219 : Fix search broken when hitting albums by @ildyria.
* `fixes` #2117 : Add back Download and full size in photo view by @ildyria.
* `new` #2226 : Anonymize the paths in the diagnostics by @ildyria.
* `fixes` #2173 : Fix title not being updated by @ildyria.
* `fixes` #2176 : Add redirection for legacy links by @ildyria.

### v5.1.0

Released on Jan 18, 2024

#### Support for Oauth

Version 5.1.0 adds support for Oauth with the following providers:

- amazon
- apple
- facebook
- github
- google
- mastodon
- microsoft
- nextcloud

You will need to register your app to those providers and get your client id and secret.
Those should then be placed in your `.env` file. See `.env.example` for templates.

Note that Oauth is only usable once the user exists in Lychee database;
it is not possible to register directly via Oauth.

#### Changes

- `fixes` #2192 & #2195 : Load Thumb/Thumb2x as fail-over when Small does not exist by @ildyria.
- `new` #2201 : Display owner names instead of Shared Albumns by @ildyria.
- `new` #2199 : Add fallback on small2x for header if medium does not exists by @ildyria.
- `fixes` #2042 : Improve token guard to not crash when provided with Basic Auth by @ildyria.
- `new` #2200 : Improve diagnostics with count of thumbs that can be regenerated by @ildyria.
- `fixes` #2203 : Fixes star/unstar on right click by @ildyria.
- `new` #2190 : Oauth is now available by @ildyria.

### v5.0.3

Released on Jan 12, 2024

#### New settings on `APP_URL`

From this version Lychee v5 supports hosting with sub-folders. Please update your `.env` as follows:

- `APP_URL` **must** only contain the hostname up to the Top Level Domain (tld) e.g. .com, .org etc.

If you are using Lychee in a sub folder, specify the path after the tld here in the `APP_DIR` constant.
For example for `https://lychee.test/path/to/lychee`:

- Set `APP_URL=https://lychee.test`
- and `APP_DIR=/path/to/lychee`

#### Do note that We (LycheeOrg) do not recommend the use of APP_DIR.

#### Changes

* `fixes` #2126 : Cover for upper level album cannot be set - error 500 by @ildyria.
* `new` #2124 : Add clear error message when CSS is not loading by @ildyria.
* `fixes` #2135 : Description should be desc for overlay by @ildyria.
* `new` #2128 : Provide the ability to change the sorting of sub-album per album (Livewire only) by @ildyria.
* `fixes` #2142 : Improved diagnostics with censored URLs by @ildyria.
* `fixes` #2143 and #2157 : fix Russian about by @ildyria.
* `fixes` #2158 : Error displaying enlarged images when accessing a public album without being logged in by @ildyria.
* `fixes` #2161 : Update Readme, add theme repository, optimize ImageMagick by @tinohager.
* `fixes` #2147 : Fix custom.js not being loaded by @ildyria.
* `fixes` #2166 : Fix uploading large number of images fails with 429 by @ildyria.
* `fixes` #2171 : Remove text-neutral for easier configuration of themes by @ildyria.
* `new` #2153 : Add compact view for albums by @ildyria.
* `fixes` #2154 : Fix WebAuthn not working by @ildyria.
* `fixes` #2172 : Fix QR code displaying wrong URL by @ildyria.
* `fixes` #2137 : Fix livewire not working on directory folders by @ildyria.
* `new` #2138 : Allow different aspect ratios for album thumbs (+ per album setting) by @ildyria.
* `fixes` #2181 : Improved diagnostics by @ildyria.
* `fixes` #2186 : Fix double f aperture in sidebar by @ildyria.
* `new` #2179 : Add notify toast when updating user by @ildyria.
* `fixes` #2164 : Fix errors on access rights by @ildyria.
* `fixes` #2178 : Fix back button on unlock page by @ildyria.
* `new` #2185 : Add left-right for login button + add custom go Home button by @ildyria.
* `new` #2182 : make APP_URL optional again by @ildyria.

### v5.0.2

Released on Dec 28, 2023 

#### Fix SQL injection.

See here for more details: [GHSA-rjwv-5j3m-p5x4](https://github.com/LycheeOrg/Lychee/security/advisories/GHSA-rjwv-5j3m-p5x4)

#### Changes

* `fixes` #2116 : Fixes hover (left-right) preventing clicks on volume etc buttons + fix frame button by @ildyria
* `fixes` #2118 : Fix drag upload bug by @maoxian-1
* `fixes` #2123 : Fix SQL Injection by @ildyria


### v5.0.1

Released on Dec 27, 2023

#### Changes

* `fixes` #2090 : Add back blurred album thumbs by @ildyria.
* `fixes` #2091 : Forgotten attribute of the canEdit function by @ildyria.
* `fixes` #2095 : Redirection not functioning on album creation by @ildyria.
* `new` #2105 : Better diagnostics for APP_URL and LYCHEE_UPLOAD_URL by @ildyria.
* `fixes` #2108 : Fix unlock album component wrongly selected by @ildyria.
* `fixes` #2096 : Remove U2F from left menu when user is not allowed to modify their account by @ildyria.
* `new` #2110 : Force https at the boot level instead of in the route files by @ildyria.
* `fixes` #2112 : Remove path from query string via middleware by @mashb1t.
* `new` #2111 : More checks for potential upload bugs by @ildyria.
* `fixes` #2109 : Modify post-merge script to reflect 5.0.0 build changes by @TwizzyDizzy.

### v5.0.0

Released on Dec 25, 2023

#### BREAKING CHANGE IN BUILD STEPS

If you are using `git clone`, you will need to use `npm` to build the front-end:

1. `composer install --no-dev`
2. `php artisan migrate`
3. `npm install`
4. `npm run build`

Those files are however provided in the release zip file.

**`APP_URL` now needs to be defined in `.env` for the images to be properly displayed.**

#### Changes from v4.13.0

* `new` #2031 : improved honeypot logic & add more honey by @ildyria.
* `new` #2033 : map providers are now specified in an Enum by @ildyria.
* `fixes` #2041 : Delete existing user permissions associated by @ildyria.
* `new` #2066 : Add optimize database call by @ildyria.
* `fixes` #2069 : Adds missing space separator in Ghostbuster command advice by @HorlogeSkynet.
* `new` #2071 : Drops support for singular public photos in search by @ildyria.
* `new` #2060 : Bye bye PHP 8.1, long live PHP 8.2 by @ildyria.
* `new` #2072 : Add configuration check between int and positive (>0) by @ildyria.

#### Changes included in the new Front-end

* `fixes` [&#x266F;199](https://github.com/LycheeOrg/Lychee-front/issues/199) : Depreciated dependencies cries for a new frontend. #199
  > Complete rewrite of the front-end using latest technologies. Moving to a TALL stack: Tailwind, Alpinejs, Livewire, Laravel.
* `new` #12 : Shared albums: policy
  > Complete new implementation of sharing and access rights.
* `new` #383 : Allow other users to upload to shared albums
  > See #12
* `new` #725 : Login on direct album url if not logged in and album needs it
  > Proper implementation with the new frontend
* `new` #748 : UI/UX: give more information about the capabilities given to new users in the users page
* `fixes` #828 : Album name not correct displayed in confirmation popup when moving a newly created album
* `new` #857 : Support for very large uploads by chunking
* `fixes` #1053 : Public album is not and can not be configured to be public #1053
  > **BREAKING CHANGE**: The _public_ smart album has been removed. Pictures are no longer made public singular.
* `new` #1211 : Date/Time display options
  > Date/Time format are now configurable in the settings per location (sidebar, panel etc.)
* `new` #1249 : header text for the gallery
  > Description of each album is directly readable at the top and support markdown.
* `new` #1189 : Multiline descriptions with markdown support for images and albums
  > Similar functionalities have been added for pictures too.
* `new` #1253 : Change album's Top Right menu behavior when selecting some pictures
  > Top right action menu behaviour has enhanced to increase visibility and intent in the album view.
  > It now depends of the selected elements.
* `new` #1462 : Access Rights management: Users and Albums
  > Major refactoring the access rights, user can now give read, upload, edit, delete access to others.
* `fixes` #1676 : Unable to open sidebar, can't navigate away from log/diagnostic/setting page
* `new` #1704 : Add real links to albums
  > No longer use fragments, as a results links are properly clickable.
* `fixes` #1720 : Download button is visible and does not support download rights yet.
* `fixes` #1732 : Consistent URLs when Landing Page is disabled.
  > url have been made consisten accross the board.
* `fixes` #1744 : UX broken on version 4.7.0 for Safari iPhone
  > New front-end will need more testing.
* `new` #1825 : Change accent color
  > With the use of tailwindcss this is now easier to produce.
* `new` #1891 : Login popup appears if no albums created
* `fixes` #1948 : Internal server error on photo upload (permissions?)
  > No longer applicable due to new front-end
* `fixes` #1973 : The CSS tweaks to disable auto zoom in/out no longer work #1973
  > No longer applicable due to new front-end
* `new` #1989 : Add search / filter for 'Move' destination album list
* `new` #2011 : Album Delete Confirmation
  > deletion is now hidden in a danger zone.
* `fixes` #2050 : When trying to open a password protected shared album, no password prompt is shown
* `fixes` #2051 : Photo Download not work - UnauthorizedException 
* `fixes` #2058 : Insufficient privilieges when opening the "Share album" dialog as a regular user
* `fixes` #2068 : Album allow public upload but disallow deletion
  > Part of this is now available, user can give upload access to other users while preventing deletion.
    The public part is not taken in consideration as this is too much of a security risk.
* `new` [&#x266F;104](https://github.com/LycheeOrg/Lychee-front/issues/104) : Rework Sharing Dialog in Settings
  > Sharing page only provide an overview, sharing is now done at the album level.
* `new` [&#x266F;166](https://github.com/LycheeOrg/Lychee-front/issues/166) : Add album description between the header and the pictures
* `new` [&#x266F;268](https://github.com/LycheeOrg/Lychee-front/issues/268) : Css is too complex to permit anyone to create new theme
  > We now use tailwindcss, which makes it easier to create a unified theme.
* `new` [&#x266F;312](https://github.com/LycheeOrg/Lychee-front/issues/312) : Make login dialog more prominent, auto-show login dialog if necessary, hide empty smart folders for anonymous users
* `fixes` [&#x266F;343](https://github.com/LycheeOrg/Lychee-front/issues/343) : Use proper URL instead of # fragments.
* `fixes` [&#x266F;344](https://github.com/LycheeOrg/Lychee-front/issues/344) : a are now correct links/interactive
* `fixes` [&#x266F;373](https://github.com/LycheeOrg/Lychee-front/issues/373) : Left menu is now working correctly
* `new` #2078 : Diagnostics: Info are displayed in blue by @ildyria
* `new` #2079 : Add option for thumbs overlay: none|hidden|always by @ildyria

## Version 4

### v4.13.0

Released on Sep 24, 2023

#### Changes

* `fixes` #2018 : Unique constraint for config keys by @qwerty287.
* `fixes` #2019 : Update composer (include breaking) by @qwerty287.
* `fixes` #1948 #1993 : Fix complaint due to type casting by @ildyria.
* `fixes` #2025 : License as enum type by @ildyria.
* `fixes` #2026 : Minor refactoring in prevision for Livewire by @ildyria.

### v4.12.0

Released on Sep 16, 2023

#### Changes

* `fixes` #2003 : Fix missing album decorations by @evoludolab.
* `fixes` #2004 : Fix max/min_taken_at by @evoludolab.
* `fixes` #2007 : Fix missing left-right button on smart albums by @ildyria.
* `new` #2010 : Better diagnostics by @ildyria.
* `new` #2012 : Better support for future policies by @ildyria.
* `new` #2015 : Replace layout and overlay to proper Enum types by @ildyria.

### v4.11.1

Released on Sep 3, 2023

#### Changes

* `fixes` #1982 : How about we don't execute tests twice? by @ildyria.
* `fixes` #1981 : Minor fixes on List sharing permissions by @ildyria.
* `fixes` #1990 : Fix complaints in Diagnostics when no migrations has been run by @ildyria.
* `fixes` #1751 : Add error thrown if APP_URL does not match current url by @ildyria.
* `fixes` #1991 : Fixes no log write access infinite loop by @ildyria.
* `fixes` #1950 : Do not enforce strict model when downloading by @ildyria.
* `fixes` #1686 : Providing absolute path if not set by @ildyria.
* `new` #1999 : Webauthn supports also username by @ildyria.

### v4.11.0

Released on Aug 13, 2023

#### Changes

* `fixes` #1963 : Change two German translations by @caminsha
* `fixes` #1975 : Fix bad placeholder in PT locale by @d7415 
* `new` #1971 : Enable video thumbnail executable configuration by @Lingxi-Li 
* `new` #1977 : Hungarian language added by @KnauszFerenc

### v4.10.0

Released on Aug 1, 2023

#### Changes

* `fixes` #1928 : Fix NSFW not toggling via Protection Panel by @ildyria
* `new` #1933 : Improve translations to German by @CodingWithCard
* `new` #1916 : Use Actions instead of direct call in controller by @ildyria
* `fixes` #1919 : jobs can now also take string as input (upload in smart albums) by @ildyria
* `fixes` #1922 : Add integrity DB check by @ildyria
* `fixes` #1925 : Support ratio by @ildyria
* `fixes` #1935 #1936 : Remove/Update OSM domain by @qwerty287
* `fixes` #1942 : "Content-Security-Policy blocks blob requests required for Google Motion Pictures images"  by @Merlyn42

### v4.9.4

Released on Jun 28, 2023

#### Changes

* `new` #1901 : Make exceptions in one log line by @ildyria 
* `fixes` #1884 : Fixes wrong redirection when Lychee is used in a subfolder by @ildyria 
* `new` #1899 : Improved speed on global table by @ildyria 
* `new` #1908 : Update dependencies by @qwerty287 

### v4.9.3

Released on Jun 25, 2023

This releases introduces the ability to use external logging system.
Please refer to [External tracking with Matomo, Google Analytics & Co](external_tracking.html) for examples.
#### Changes

* `new` #1870 : Allow script-src and connect-src configuration by @timo-reymann
* `new` #1873 : Support files without extensions in importFromUrl by @wladif
* `fixes` #1887 : Make fileTimeModified parameter optional in Photo::add by @ildyria
* `fixes` #1853 : Fixes broken license editing by @ThanasisMpalatsoukas
* `new` #1875 : add support for 418 response code for dubious queries by @ildyria
* `fixes` #1868 : Can't remove album permissions by @ildyria
* `fixes` #1883 : Optimizing sql and improved Log data by @ildyria
* `fixes` #1882 : Improved csp rules for docs/api by @mingan666
* `fixes` #1775 : Search with Chinese by @ThanasisMpalatsoukas
* `new` #1898 : Improve explain on db_logging by @ildyria

### v4.9.2

Released on May 22, 2023

#### Changes

* `fixes` #1861 : Remove hashes from CSP when using log-viewer by @ildyria
* `fixes` #1862 : Remove duplicate link. Tweak comment by @d7415

### v4.9.1

Released on May 19, 2023

#### DO NOT USE - BROKEN LOGS (broken CSP).

#### Changes

* `fixes` #1856 : Fixes #1855 - update Makefile by @ildyria
* `fixes` #1857 : Fix version 4.9 log-viewer paths hard coding by @ildyria

### v4.9.0

Released on May 18, 2023

#### DO NOT USE - BROKEN LOGS (missing public files).

#### Changes

* `fixes` #1848 : Remove public option from album ordering: no longer supported by @ildyria
* `fixes` #1850 : Fix SQL error on removing public status from album by @ildyria
* `new` #1846 : Remove homemade Log solution, add support log-viewer by @ildyria

### v4.8.1

Released on May 15, 2023

#### Changes

* `new` #1826 : Improved support of migration very old versions (untestable code) by @ildyria
* `new` #1821 : Add backend implementation to use file's last modified time by @wladif
  > Now support last_modified_time when uploading file without exif data.
* `fixes` #1828 : Fix left/right in photo view of tag albums by @ildyria
* `new` #1827 : Support API documentation by @ildyria
* `new` #1829 : Composer update + fix php stan complaints by @ildyria
* `fixes` #1833 : fixes Mass assignment problem in Access Permissions by @ildyria



### v4.8.0

Released on May 5, 2023

#### Changes

* `new` #1792 : Use access permissions instead of base_album table to determine access rights by @ildyria


### v4.7.4

Released on May 4, 2023

#### Changes

* `new` #1819 : Make it possible to fetch random image without needing to be public & starred by @mingan666

### v4.7.3

Released on April 19, 2023

#### Changes

* `fixes` #1786 : Update dependencies (including php-exif) by @qwerty287
* `new` #1787 : Remove requirement of Auth in photo upload, pass ownerId as argument by @ildyria
* `new` #1785 : Add jobs processing by @ildyria
* `new` #1788 : Add Job History by @ildyria
* `fixes` #1789 : doc blocks + fix deprecation utf8_encoding by @ildyria
* `new` #1793 : Use enum instead of constants for SmartAlbumTypes by @ildyria
* `fixes` #1791 : Album creation no longer depends on Auth by @ildyria
* `fixes` #1797 : Fix a wrong help text by @Anduin2017
* `fixes` #1780 : Albums tagged NSFW do not appear in album list, ignoring visible parameter by @ildyria
* `fixes` #1765 , #1794 : Share button is not visible on public albums by @ildyria

### v4.7.2

Pre-released on Mar 8, 2023

#### Changes

* `new` #1755 : Ship an empty custom.js to prevent spamming the console (#1753) by @nicokaiser
* `fixes` #1756 : Fixes locale not working (#1754) by @ildyria
* `fixes` #1758 : Set noindex for error responses by @nicokaiser
* `fixes` #1759 : Fixes unknown orientation in GdHandler by @wladif
* `new` #1766 : Add setting `auto_fix_orientation` to enable auto image rotation by @wladif
* `fixes` #1764 : Migrate to Laravel 10 by @ildyria
* `new` #1769 : Compile WebAuthn.js into frontend.js by @qwerty287

### v4.7.1

Pre-released on Feb 5, 2023

#### DO NOT USE - BROKEN LOCALE.

#### Changes

* `fixes` #1688 : Update French.php by @davidbercot
* `fixes` #1674 : Share button not working by @ildyria
* `fixes` #1630 : 2FA not working by @ildyria
* `new` #1650 : Allow to store all files in `storage` by @qwerty287
* `fixes` #1698 : Fix 2fa tests by @ildyria
* `fixes` #1702 : Fix cache busting on user.css by @ildyria
* `fixes` #1701 : fix migration when photo do not have an album by @ildyria
* `fixes` #1705 : fix exception missing driver by @ildyria
* `fixes` #1706 : Simple composer update + fix php8.2 warning on formatting by @ildyria
* `new` #1707 : allow forcing HTTPS scheme by @ildyria
  > When serving behind a reverse proxy, the blade template engine think we are using HTTP.
  > This change adds a new `.env` configuration variable enforcing HTTPS scheme.
* `fixes` #1713 : update config doc + sync front + dusting by @ildyria
* `fixes` #1703 : Fixes #1703 by @ildyria
  > Updates were not properly applied because of precendence of versionning check.
* `new` #1708 : Setting to make `On This Day` smart album public by @aldjordje
* `fixes` #1722 : Fix sync default user by @ildyria
* `new` #1724 : Add configuration option to set auth guard driver by @r7l
* `fixes` #1730 : Fix wording for authentication guard option by @r7l
* `fixes` #1728 : Avoid showing errors in tests when they are expected by @ildyria
* `new` #1738 : Fix URLs in RSS feeds (#1732) by @nicokaiser
* `new` #1741 : Set theme-color on frontend template (#1740) by @nicokaiser
* `new` #1697 : execute custom js from custom by @cshyam1892
* `fixes` #1733 : migrate locales from 'app/Locale/' to 'lang/', drop Lang Facade by @ildyria
* `new` #1726 : use RuleSets instead of directly rule property by @ildyria
* `new` #1668 : DTO are less supported, and moving to Laravel Resources by @ildyria


### v4.7.0

Released on Jan 4, 2023

#### PHP 8.1+ REQUIRED

#### Changes

* `new` #1631 : Customizable album decorations by @evoludolab
  > Allows to change the layer symbol in the top right corner of albums which indicated
  > the existence of sub-albums to a counter, also support counting pictures or not displaying any symbol at all.
  > The layer symbol is still being used by default.
* `new` #1618 : Use Enum to enforce stricter types (⚠ php 8.1) by @ildyria
  > This reduces the risk of bugs.
* `rm` #1673 : Nuke demo generator, does not reflect the latest version by @ildyria
  > This removes the /demo page which was used to generate AJAX response in order to mock a
  > server response on the [demo](https://lychee-demo.fly.dev/) page of Lychee.
* `new` #1671 : Ensure php version is correct prior migrations by @ildyria
  > Before running any migration, we are not verifying that the required minimum version of PHP is used.
* `fixes` #1684 : Fix on HasAdminUser by @ildyria
  > When updating to 4.6.5, Users of the Migrate web interface where not able to procced.
  > This is now resolved.


### v4.6.5

Released on Dec 26, 2022

#### LAST SUPPORT FOR PHP 8.0

#### Changes

* `fixes` #1665 : Fix migration for PostgreSQL users by @ildyria
* `new` #1667 : add setting to allow username change (default to true) by @ildyria
### v4.6.4

Released on Dec 25, 2022

#### IMPORTANT

- This release does significant changes at the database level, do make sure you have a back-up available if necessary.

#### Changes

* `fixes` #1590 : Fix list of shares by @nagmat84
* `new` #1594 : Add flags to command by @qwerty287
* `new` #1591 : Add API to change upload date & fix API token auth by @qwerty287
* `fixes` #1598 : Fix remove album cover throwing 403 by @ildyria
* `new` #1522 : Merge `gallery`, `view` and `frame` into a Unified Frontend by @nagmat84
  > This will require adapting your personal user.css
* `new` #1562 : Refactor box model by @nagmat84
  > This will require adapting your personal user.css
* `new` #1611 : Checks if Webp is available for GD in diagnostics by @ildyria
* `new` #1607 : Smart album - On This Day - new feature by @aldjordje
  > Create a smart album which will show every day of the year the pictures that were taken on that specific day in the past.
* `new` #1619 : Add option to enable-disable smart albums in the back-end by @ildyria
  > Allows complete disabling of smart albums rather than using CSS trick.
* `new` #1632 : Add Unix socket support to Redis by @r7l
* `new` #1628 : Versioning code refactoring by @ildyria
* `fixes` #1653 : Full URL for metadata by @qwerty287
  > Fixes a bug where images only provided incomplete path in embeded previews.
* `fixes` #1649 : Remove and clean up unused files by @qwerty287
* `new` #1655 : Add number of foreign key check and listing option by @ildyria
* `new` #1539 : Apply rights naming convention by @ildyria
  > First step in direction of supporting multiple acces rights on albums.
* `new` #1602 : Create admin during installation, allow multiple admins by @qwerty287
* `fixes` #1662 : Remove (broken and unused) installer scripts by @qwerty287

### v4.6.2

Released on Nov 12, 2022

#### IMPORTANT

- This update contains an upgrade of U2F packages with a very different core, as a consequence any U2F credentials stored have been destroyed and will need to be registered again.

#### Changes

* `new` #1519 : Adopt new modern dialog
* `fixes` #1494 : Consolidate localization
* `new` #1558 : Add option to skip diagnostic checks
* `new` #1469 : Upgrade to Laravel 9 + switch to Laragear/WebAuthn
* `new` #1564 : Add option to append tags
* `fixes` #1581 : Fixes files installation if no Git repo is available
* `fixes` #1478 : Fixes smart albums rights

### v4.6.1

Released on Oct 08, 2022

#### IMPORTANT

- This update contains a Security Update which fix multiple [XSS vulnerability](https://github.com/LycheeOrg/Lychee-front/security/advisories/GHSA-cr79-38hg-27gv) and update the [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).
- This update will drop the API key in favor of Authorization token.
As a result, once the migration is applied the old API token won't work anymore.

#### Changes

* `new` #1489 : Drop page support
  > This functionality was not known by 99.9% of the users of Lychee.
  > We decided to drop its support in favor of more targetted development in the core.
* `new` #1443 : Add user and better structure to session json
* `new` #1153 : Support for multi path on server import
* `fixes` #1508 : Ensure that Admin rights are overloading others
* `fixes` #1366 : Improve config options
* `fixes` #1514 : 32 bits system improved support
  > For 32bit systems and time-based, legacy IDs we must catch failing inserts due to duplicate legacy ID
  > when insertions is running too fast. In the past it was sufficient to check for MySQL error codes 23000
  > and 23005 as integers and then pause for a short period of time.
* `fixes` #1480 : Shared albums should not consider the `require_link` property.
* `new` #1368 : Improve API client usability
* `fixes` #1528 : Improve CSP and fix XSS vulnerability
  > See [advisories](https://github.com/LycheeOrg/Lychee-front/security/advisories/GHSA-cr79-38hg-27gv)

### v4.6.0

Released on Sep 04, 2022

#### IMPORTANT

Once the migration is applied, should you wish to rollback, you will need to reset your admin user otherwise it will not be possible to log as admin anymore.

#### Changes

- `new` #1453 : Provide an ASCII fallback for multibyte filenames
- `new` #1403 : Use Laravel Auth facade instead of home-brewed authentication layer 
  > This change will prevent the rollback as the Admin now follows proper username - hashed password values in the database (previously was hashed username and hashed value).
- `fixes` #1472 : Fixes major bug with relation to Tag albums 
- `fixes` #1495 : Solve minor bugs in the installation procedure

### v4.5.3

Released on Aug 07, 2022

#### IMPORTANT

- The internal representation of Albums changed with version 4.5.0.  
We strongly recommend that you **BACK UP YOUR DATABASE BEFORE UPDATING**.
- The folder structure changed for images; **please check the required directory permissions**.  
Read more [here  &#187;](https://lycheeorg.dev/docs/#directory-permissions).

#### Changes

- `new` : New ID scheme. Albums and photos are migrated to a new ID scheme. Previously, albums and photos used time-based integer IDs. The new IDs are truly 144bit of randomness encoded in Base64 as a 24-character string; e.g., if your photo had the URL `https://my-domain.tld/r/16102925744307/16102927818284` before, it may have the URL `https://my-domain.tld/r/GTqZfSso3nPeCnTNW4ovisgC/jM6KkmlK7X0LtVas5MjrHtTO` after the migration. This means, **external links to your albums or photos will stop working.** However, we implemented a redirection service. You can enable/disable the re-direction service under `Settings` > `More` > `legacy_id_redirection`. This gives you time to migrate any external reference to the new IDs. We also generate a log entry every time the redirection service is used. This log contains the legacy and new ID as well as information where the request came from. This may help you with the migration of your external links.

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

- `Fixes`  Cross-Origin Request Blocked: https://lycheeorg.dev/update.json ( 3#121 )
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

---

## Version 1

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
