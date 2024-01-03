The current Front-end of Lychee is using [Tailwindcss][1], [AlpineJS][2], [TypeScript][3] and [Blade templates][4]. In order to modify it you will need to recompile it.

### Dependencies

In order to compile the front-end, you have to install the following dependencies:

- `node` [Node.js](http://nodejs.org) v20.0.0 or later
- `npm` [Node Packaged Modules](https://www.npmjs.org)

After installing [Node.js](http://nodejs.org) you can use the included `npm` package manager to download all dependencies:

```bash
npm install
```

### Build

In order to generate the front-end visual you will need to run the following:

```bash
npm run dev
```
This will create the files required to run Lychee.

When running in production, you should be used instead:
```bash
npm run build
```
This will create a `public/build` folder with the associated files.

### Points of attention

To ease your development, some pain points are to be considered:

- variables names (attributes) in blade templates must use camelCase.
- try to keep the alpine components code in the `.ts` files.
- TailwindCSS is doing tree-shaking, this means that any unused css class will not be provided in the production build.
  When using classes programatically (e.g. in php), make sure to add them to `tailwind.config.js`

[1]: https://tailwindcss.com/docs/utility-first
[2]: https://alpinejs.dev
[3]: https://www.typescriptlang.org/
[4]: https://laravel.com/docs/blade