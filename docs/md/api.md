<style>
.docs_main ul:not(:first-of-type) {
    margin: 0 0 0;
}
</style>
The current API provide the following entry points:
See:

- [routes/web.php](https://github.com/LycheeOrg/Lychee/blob/master/routes/web.php)
- [routes/admin.php](https://github.com/LycheeOrg/Lychee/blob/master/routes/admin.php)

### `php/index.php`, `/api/Session::init`

- **POST** request
- 0 arguments
- no CSRF protection
- Returns the server informations, including the locale translations.

### `/api/Session::login`

- **POST** request
- Returns `true` if login was successful, `false` otherwise.
```
$request->validate([
    'username' => 'required',
    'password' => 'required',
]);
```

### `/api/Session::logout`

- **POST** request
- 0 arguments
- Returns `true` and log out (flush Session variables)

### `/api/Albums::get`

- **POST** request
- 0 arguments

### `/api/Albums::getPositionData`

- **POST** request
- 0 arguments

### `/api/Album::get`

- **POST** request
- *read* protection
```
$request->validate(['albumID' => 'string|required']);
```

### `/api/Album::getPositionData`

- **POST** request
- *read* protection

### `/api/Album::getPublic`

- **POST** request
```
$request->validate([
    'albumID' => 'string|required',
    'password' => 'string|nullable',
]);
```

### `/api/Album::add`

- **POST** request
- *upload* protection
```
$request->validate([
    'title' => 'string|required|max:100',
    'parent_id' => 'int|nullable',
]);
```

### `/api/Album::setTitle`

- **POST** request
- *upload* protection
```
$request->validate([
    'albumIDs' => 'string|required',
    'title' => 'string|required|max:100',
]);
```

### `/api/Album::setDescription`

- **POST** request
- *upload* protection
```
$request->validate([
    'albumID' => 'integer|required',
    'description' => 'string|nullable|max:1000',
]);
```

### `/api/Album::setPublic`

- **POST** request
- *upload* protection
```
$request->validate([
    'albumID' => 'integer|required',
    'public' => 'integer|required',
    'visible' => 'integer|required',
    'downloadable' => 'integer|required',
    'share_button_visible' => 'integer|required',
    'full_photo' => 'integer|required',
]);
```

### `/api/Album::delete`

- **POST** request
- *upload* protection
```
$request->validate([
    'albumIDs' => 'string|required',
]);
```

### `/api/Album::merge`

- **POST** request
- *upload* protection
- the first id is the destination, the following contains the merged albums.
```
$request->validate([
    'albumIDs' => 'string|required',
]);
```

### `/api/Album::move`

- **POST** request
- *upload* protection
- the first id is the destination, the following contains the moved albums.
```
$request->validate(['albumIDs' => 'string|required']);
```

### `/api/Album::setLicense`

- **POST** request
- *upload* protection
- License is one of the following: `none`, `reserved`, `CC0`, `CC-BY`, `CC-BY-ND`, `CC-BY-SA`, `CC-BY-ND`, `CC-BY-NC-ND`, `CC-BY-NC-SA`
```
$request->validate([
    'albumID' => 'required|string',
    'license' => 'required|string',
]);
```

### `/api/Album::getArchive`

- **GET** request
- *read* protection
```
$request->validate([
    'albumIDs' => 'required|string',
]);
```

### `/api/Frame::getSettings`

- **POST** request

### `/api/Photo::get`

- **POST** request
- *read* protection
```
$request->validate([
    'photoID' => 'string|required',
]);
```

### `/api/Photo::getRandom`

- **POST** request

### `/api/Photo::setTitle`

- **POST** request
- *upload* protection
```
$request->validate([
    'photoIDs' => 'required|string',
    'title' => 'required|string|max:100',
]);
```

### `/api/Photo::setDescription`

- **POST** request
- *upload* protection
```
$request->validate([
    'photoID' => 'required|string',
    'description' => 'string|nullable',
]);
```

### `/api/Photo::setStar`

- **POST** request
- *upload* protection
```
$request->validate([
    'photoIDs' => 'required|string',
]);
```

### `/api/Photo::setPublic`

- **POST** request
- *upload* protection
```
$request->validate([
    'photoID' => 'required|string',
]);
```

### `/api/Photo::setAlbum`

- **POST** request
- *upload* protection
```
$request->validate([
    'photoIDs' => 'required|string',
    'albumID' => 'required|string',
]);
```

### `/api/Photo::setTags`

- **POST** request
- *upload* protection
```
$request->validate([
    'photoIDs' => 'required|string',
    'tags' => 'string|nullable',
]);
```

### `/api/Photo::add`

- **POST** request
- *upload* protection
- the `0` argument contains the file to upload.
```
$request->validate([
    'albumID' => 'string|required',
    '0' => 'required',
]);
```

### `/api/Photo::delete`

- **POST** request
- *upload* protection
```
$request->validate([
    'photoIDs' => 'required|string',
]);
```

### `/api/Photo::duplicate`

- **POST** request
- *upload* protection
```
$request->validate([
    'photoIDs' => 'required|string',
    'albumID' => 'string',
]);
```

### `/api/Photo::setLicense`

- **POST** request
- *upload* protection
- License is one of the following: `none`, `reserved`, `CC0`, `CC-BY`, `CC-BY-ND`, `CC-BY-SA`, `CC-BY-ND`, `CC-BY-NC-ND`, `CC-BY-NC-SA`
```
$request->validate([
    'photoID' => 'required|string',
    'license' => 'required|string',
]);
```


### `/api/Photo::getArchive`

- **GET** request
- *read* protection
- Kind is one of the following: `FULL`, `LIVEPHOTOVIDEO`, `MEDIUM2X`, `MEDIUM`, `SMALL2X`, `SMALL`, `THUMB2X`, `THUMB`
```
$request->validate([
    'photoIDs' => 'required|string',
    'kind' => 'nullable|string',
]);
```

### `/api/Photo::clearSymLink`

- **GET** request
- *admin* protection

### `/api/Sharing::List`

- **POST** request
- *upload* protection

### `/api/Sharing::ListUser`

- **POST** request
- *upload* protection
```
$request->validate([
    'albumIDs' => 'string|required',
]);
```

### `/api/Sharing::Add`

- **POST** request
- *upload* protection
```
$request->validate([
    'UserIDs' => 'string|required',
    'albumIDs' => 'string|required',
]);
```

### `/api/Sharing::Delete`

- **POST** request
- *upload* protection
```
$request->validate([
    'ShareIDs' => 'string|required',
]);
```

### `/api/Settings::setLogin`

- **POST** request
```
$request->validate([
    'username' => 'required|string',
    'password' => 'required|string',
]);
$oldPassword = $request->has('oldPassword') ? $request['oldPassword']: '';
$oldUsername = $request->has('oldUsername') ? $request['oldUsername']: '';
```

### `/api/Import::url`

- **POST** request
- *upload* protection
```
$request->validate([
    'url' => 'string|required',
    'albumID' => 'string|required',
]);
```

### `/api/Import::server`

- **POST** request
- *admin* protection
- delete_imported takes value `0` or `1`
```
$request->validate([
    'path' => 'string|required',
    'albumID' => 'int|required',
    'delete_imported' => 'int',
]);
```

### `/api/User::List`

- **POST** request
- *upload* protection

### `/api/User::Save`

- **POST** request
- *admin* protection
```
$request->validate([
    'id' => 'required',
    'username' => 'required|string|max:100',
    'upload' => 'required',
    'lock' => 'required',
]);
```

### `/api/User::Delete`

- **POST** request
- *admin* protection
```
$request->validate([
    'id' => 'required',
]);
```

### `/api/User::Create`

- **POST** request
- *admin* protection
```
$request->validate([
    'username' => 'required|string|max:100',
    'password' => 'required|string|max:50',
    'upload' => 'required',
    'lock' => 'required',
]);
```

### `/api/Logs`

- **POST** request
- *admin* protection

### `/api/Logs::clearNoise`

- **POST** request
- *admin* protection

### `/api/Diagnostics`

- **POST** request

### `/api/Diagnostics::getSize`

- **POST** request

### `/Logs`

- **GET** request
- *admin* protection

### `/api/Logs::clear`

- **GET** request
- *admin* protection

### `/Diagnostics`

- **GET** request

### `/Update`

- **GET** request
- *admin* protection

### `/api/Update::Apply`

- **POST** request
- *admin* protection

### `/api/Update::Check`

- **POST** request
- *admin* protection

### `/api/search`

- **POST** request
```
$request->validate([
    'term' => 'required|string',
]);
```

### `/api/Settings::setSorting`

- **POST** request
- *admin* protection
```
$request->validate([
    'typeAlbums' => 'required|string',
    'orderAlbums' => 'required|string',
    'typePhotos' => 'required|string',
    'orderPhotos' => 'required|string',
]);
```

### `/api/Settings::setLang`

- **POST** request
- *admin* protection
```
$request->validate([
    'lang' => 'required|string',
]);
```

### `/api/Settings::setLayout`

- **POST** request
- *admin* protection
```
$request->validate([
    'layout' => 'required|string',
]);
```

### `/api/Settings::setPublicSearch`

- **POST** request
- *admin* protection
```
$request->validate([
    'public_search' => 'required|string',
]);
```

### `/api/Settings::setImageOverlay`

- **POST** request
- *admin* protection
```
$request->validate([
    'image_overlay' => 'required|string',
]);
```

### `/api/Settings::setDefaultLicense`

- **POST** request
- *admin* protection
```
$request->validate([
    'license' => 'required|string',
]);
```
- License is one of the following: `none`, `reserved`, `CC0`, `CC-BY`, `CC-BY-ND`, `CC-BY-SA`, `CC-BY-ND`, `CC-BY-NC-ND`, `CC-BY-NC-SA`

### `/api/Settings::setMapDisplay`

- **POST** request
- *admin* protection
```
$request->validate([
    'map_display' => 'required|string',
]);
```

### `/api/Settings::setMapDisplayPublic`

- **POST** request
- *admin* protection
```
$request->validate([
    'map_display_public' => 'required|string',
]);
```

### `/api/Settings::setMapProvider`

- **POST** request
- *admin* protection
```
$request->validate([
    'map_provider' => 'required|string',
]);
```

### `/api/Settings::setMapIncludeSubalbums`

- **POST** request
- *admin* protection
```
$request->validate([
    'map_include_subalbums' => 'required|string',
]);
```

### `/api/Settings::setLocationDecoding`

- **POST** request
- *admin* protection
```
$request->validate([
    'location_decoding' => 'required|string',
]);
```

### `/api/Settings::setLocationShow`

- **POST** request
- *admin* protection
```
$request->validate([
    'location_show' => 'required|string',
]);
```

### `/api/Settings::setLocationShowPublic`

- **POST** request
- *admin* protection
```
$request->validate([
    'location_show_public' => 'required|string',
]);
```

### `/api/Settings::setCSS`

- **POST** request
- *admin* protection
```
$request->validate(['css' => 'nullable|string']);
```

### `/api/Settings::getAll`

- **POST** request
- *admin* protection

### `/api/Settings::saveAll`

- **POST** request
- *admin* protection
```
foreach (
    $request->except([
        '_token', 'function', '/api/Settings::saveAll',
    ]) as $key => $value
) {
    $value = ($value == null) ? '' : $value;
    $no_error &= Configs::set($key, $value);
}
```

### `/api/Settings::setOverlayType`

- **POST** request
- *admin* protection
```
$request->validate([
    'image_overlay_type' => 'required|string',
]);
```

### `/api/Settings::setDropboxKey`

- **POST** request
- *admin* protection
```
$request->validate([
    'key' => 'string|nullable',
]);
```
