## A brief introduction to Livewire

We first give a short intuition of how [Livewire](https://livewire.laravel.com/docs/quickstart), the framework of the new front-end, works.

### Livewire and Controllers

The Laravel framework on which Lychee is based provides two options regarding how a request may be routed:

- the request is directed to a controller below `app/Http/Controllers`
- the request is directed to a Livewire component below `app/Livewire/Components`

In the first case, a controller returns a JSON object or an HTML page rendered from a blade template.
In the second case (Livewire), only a block of HTML built from a blade template will be returned.

From a very high level, Livewire makes use of two folders:

- `app/Livewire/Components` which hosts the components and their inner logic.
- `resources/views/{components|livewire}` which hosts the HTML layout of the components.

So far one could say there is not much difference with a normal request life cycle. Where Livewire starts to shine is in the ability to call the methods of the component directly _from HTML_. Instead of having to use a JavaScript hook, make an AJAX call, parse the result, and update the layout accordingly, the user/programmer can directly interact with the designated component and Livewire takes care of the request and rendering.

### Laravel Components

In Laravel, it is possible to create reusable templates also called components. They are called from the blade part using the following syntax:
```html
<x-album :data="$album" />
```
Note that PHP expressions and variables should be passed to the component via attributes that use the `:` character as a prefix (in this case `data`).
Attributes are automatically inserted in the constructor of the component:
```php
public function __construct(AbstractAlbum $data)
{
	// component logic for the rendering
}
```
Laravel then calls the `render()` method and returns the corresponding view.
```php
public function render()
{
	return view('components.gallery.album');
}

```
Public attributes in the component class (e.g. `public string $title`) are then accessible in the blade template part:
```html
<!--  ...  -->
<div class='overlay'>
	<h1 title='{{ $title }}'>{{ $title }}</h1>
</div>
<!--  ...  -->
```

### Livewire Components

Similarly to Laravel components, the Livewire ones use the `render()` method, blade views, and public attributes.
One could say that the Livewire components are just Laravel components on steroids.

In order to call Livewire, the following syntax is used:
```html
<livewire:pages.gallery.album :album="$this->album" />
```
This will call the Livewire component located at `app/Livewire/Components/Pages/Gallery/Album.php`.  
As opposed to their Laravel counterparts, it is not possible to use the constructor to read the attributes.
For this reason a method `mount()` has been added:
```php
public function mount(AbstractAlbum $album)
{
	$this->load($album);
}
```
Then the `render()` function is used in order to retrieve the respective HTML section of the component.
```php
public function render()
{
	return view('livewire.pages.gallery.album');
}
```

#### Calling methods

Where Livewire becomes interesting is in its ability to call PHP functions directly from user-land.
Methods of the component can be callable by using additional HTML attributes.
For example in `resources/views/livewire/pages/gallery/albums.php` the attribute `wire:click="login"`
will call the `login()` method of the component `app/Livewire/Pages/Gallery/Album.php`
```html
<a wire:click="login" class="button">
	<x-icons.iconic icon='account-login' />
</a>
```
```php
public function login()
{
	// ...
}
```
This method will then execute and trigger a re-rendering of the component.

#### Emitting events

In addition to calling a method of a component,
it is also possible to trigger actions in other components.
As a matter of fact, in the specific case of the `login()` method,
we are emitting an event which will trigger the opening of the `app/Livewire/Components/Base/Modal.php` component with a login form:
```php
protected function login()
{
	$form = 'forms.login';
	$params = [];
	$this->dispatch('openModal', $form, $params)->to(Modal::class);
}
```
`Modal.php` contains the following code:
```php
class Modal extends Openable
{
	#[On('openModal')]
	public function openModal(string $type, array $params = [])
	{
		//...
	}
```
The attribute `#[On('event-name')]` informs the component which events it needs to react to.
In this specific case `openModal()` method has two arguments which are provided by the `$this->dispatch('eventName', $arg1, $arg2);`

With these tools at hand, we are now able to understand a bit better the structure of the Livewire front-end.

## Lychee Livewire Front-end

Since Livewire v3, the front-end uses a layout which is significantly close to a normal website.
We make use of `navigate`. Read more [here](https://livewire.laravel.com/docs/navigate)

Each page is now located in `App/Livewire/Components/Page` with the exception of the different gallery views which are in
`App/Livewire/Components/Page/Gallery`.

This makes use of a unified layout provided in `resources/views/components/layouts/app.blade.php`.

**More info to come.**

## Pitfalls & Wireable

There are a few points where special attention is required. At the end of lifecycle of a request,
Livewire deserializes the components and forwards them to the client in an encrypted and hashed form.
When executing a method call from user-land, component's data are sent to the server and deserialized.
If an attribute of the component is an `Interface`, Livewire will panic. It uses the type of the attribute
to retrieve the constructor and hydrate the model.

Do note that by default, the dehydration uses the `toArray()` method. As a result the hydration will not be working in most cases.
For this reason Livewire proposes the interface `Wireable` which requires two methods: `toLivewire()` and `static fromLivewire($value)`.
The former will return the serialized version of the object and the latter will rebuild the object from the serialized version.

Another option is to use Synthesizers. Examples which take care of AbstractAlbums and Photos are in `App/Livewire/Synth`;