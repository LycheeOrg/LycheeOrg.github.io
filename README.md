# LycheeOrg.github.io

[![Build Status](https://travis-ci.com/LycheeOrg/LycheeOrg.github.io.svg?branch=master)](https://travis-ci.com/LycheeOrg/LycheeOrg.github.io)

## Dependencies

- GNU Make
- Python 3 (because I don't like Python 2.7)
- git

## Setup

- [Install Python 3.x](https://www.python.org/downloads/)
- [Install pip](https://pip.pypa.io/en/stable/installing/)
- Install dependencies

```sh
// Install dependencies
$ pip install -U pytest markdown
```

# Generating

This assumes the current directory structure:
```
<path>/LycheeOrg.github.io
<path>/Lychee
```
The script will look for: `../Lychee/version.md`

If this is the case, just do `make` and commit the changed files. :)
