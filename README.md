# Yoga 2 - Forked

![npm](https://img.shields.io/npm/v/@atto-byte/yoga.svg?style=flat-square)
![npm](https://img.shields.io/npm/dm/@atto-byte/yoga.svg?style=flat-square)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/atto-byte/yoga2/master.svg?style=flat-square)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Build Status](https://travis-ci.org/atto-byte/yoga2.svg?branch=master)](https://travis-ci.org/atto-byte/yoga2)

Help Wanted

## Install

```bash
  npm install -g @atto-byte/yoga
```

## CLI - Commands

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

### Passing ENVs

If you have to following env file `.env.staging` then you can pass it to Yoga using the commands below

- **dev**: `yoga dev -e staging`
- **start**: `yoga start -e staging`

## Roadmap

- [ ] Remove Unnecessary Abstraction
- [x] Add GraphQL Shield Integration
- [ ] Add Examples
  - [ ] GraphQL Shield
  - [ ] Express Middleware
- [ ] Add Tests **Help Wanted**
- [ ] Serverless?

## Local Development

- **Warning** Any changes to `./examples` will not work as these are pulled from the master repo on github when running `yoga new`

```bash
git clone https://github.com/atto-byte/yoga2.git
npm install
npm link
```
