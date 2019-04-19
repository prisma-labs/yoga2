# Yoga 2

![npm](https://img.shields.io/npm/v/@atto-byte/yoga.svg?style=flat-square)
![npm](https://img.shields.io/npm/dm/@atto-byte/yoga.svg?style=flat-square)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/atto-byte/yoga2/master.svg?style=flat-square)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Install

```bash
  npm install -g @atto-byte/yoga
```

## Usage

```
Commands:
  yoga new       Create new yoga project from template
  yoga start     Start the server
  yoga dev       Start the server in dev mode
  yoga scaffold  Scaffold a new GraphQL type
  yoga build     Build a yoga server
  yoga eject     Eject your project

Options:
  --env, -e  Pass a custom NODE_ENV variable
  --help     Show help
  --version  Show version number
```

## Local Development

- **Warning** Any changes to `./examples` will not work as these are pulled from the master repo on github when running `yoga new`

```bash
git clone https://github.com/atto-byte/yoga2.git
npm install
npm link
```
