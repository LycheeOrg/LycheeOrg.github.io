# LycheeOrg.github.io

[![Build Status][build-status-shield]](https://github.com/LycheeOrg/LycheeOrg.github.io/actions)

## Dependencies

- GNU Make
- npm
- Python 3 (because I don't like Python 2.7)
- git

## Setup

- [Install Python 3.x](https://www.python.org/downloads/)
- [Install pip](https://pip.pypa.io/en/stable/installing/)
- [Install npm](https://nodejs.org/en/download/package-manager)
- Install dependencies:

```sh
npm install
pip install -r requirements.txt
```

# Generating

Run `make` to generate the HTML files, which can then be found in `dist/`.

[build-status-shield]: https://img.shields.io/github/actions/workflow/status/LycheeOrg/LycheeOrg.github.io/CI.yml?branch=master