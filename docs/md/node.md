The current Front-end of Lychee is 100% JS generated. In order to modify it you will need to recompile it.

### Git Submodule

At the moment, the current strategy of Lychee is to separate the front-end from the back-end.
This allowed us to easily develop the version 4 while having the version 3 still live.
It also kept the consistency of the GUI between the two major versions.

As a result you will find the front-end files in the `public/Lychee-front` directory after you initialized it as follows:

```
git submodule init
git submodule update
```

### Dependencies

In order to compile the front-end, you have to install the following dependencies:

- `node` [Node.js](http://nodejs.org) v5.7.0 or later
- `npm` [Node Packaged Modules](https://www.npmjs.org)

After installing [Node.js](http://nodejs.org) you can use the included `npm` package manager to download all dependencies:

```
npm install
```

### Build

The Gulpfile is located in `public/Lychee-front/` and can be executed using the `npm run compile` command.
This will take care of concatenating and minimizing the files.

Do not forget to clear your cache in order to see the change done.

### Creating Pull Requests

Please be sure to submit any front end pull requests to [LycheeOrg/Lychee-front](https://github.com/LycheeOrg/Lychee-front).