# Yoga

A lightweight 'Ruby on Rails'-like framework for GraphQL

> Note: This project is still very WIP

## Features

- Type-safe
- Zero-config
- Scalable
- Conventions over configuration
- Resolver-first GraphQL
- Batteries included (DB, Auth, rate limiting, ...)
- Deploy anywhere

## Motivation

TBD

## Get started

### Start from scratch

Bootstrap a GraphQL server with a ready-made `yoga` setup then
start the server:

_With `npm`_

```bash
npm init yoga my-app
cd my-app
npm start
```

_Note: `npm init` requires npm version >= 6.2.0_

or

_With `yarn`_

```bash
yarn create yoga my-app
cd my-app
yarn start
```

_Note: `yarn create` requires yarn version >= 0.25_

That's it, you're ready to start 🙌

### Add to existing project

#### Install

You can install `yoga` with either of the following commands:

```bash
npm install --save yoga
```

or

```bash
yarn add yoga
```

and add a script to your package.json like this:

```json
{
  "scripts": {
    "dev": "yoga dev"
  }
}
```

You can now run

```bash
npm run dev
```

That's it, you're ready to start 🙌

## Usage

### Basics

The following is the tree structure needed for `yoga` to work

```
src
├── context.ts (optional)
└── graphql
    ├── Query.ts
    └── User.ts
```

The `./src/graphql` folder is the entry point of your GraphQL server.

Every `.ts` file within that directory that exposes some GraphQL types will be processed, and exposed through a GraphQL server

_eg:_

```ts
// ./src/graphql/Query.ts
import { objectType } from "yoga";

export const Query = objectType("Query", t => {
  t.string("hello", {
    resolve: () => " world!"
  });
});
```

Optionally, you can also provide a `./src/context.ts` file to inject anything to the context of your resolvers.

That file needs to default export a function returning an object containing what you want to put within your resolvers' context.

_eg:_

```ts
// ./src/context.ts
import something from "somewhere";

export default () => ({ something });
```

### The CLI

`yoga` ships itself with a CLI.

```
Usage: yoga [cmd] (start/build/dev)

Commands:
  yoga dev  Start the server in dev mode

Options:
  --help         Show help
  -v, --version  Show version number
```

`yoga dev` will run a GraphQL server in watch mode, updating your server whenever a file change.

## Contributing

Install dependencies

```bash
npm install
npm run bootstrap
```

Move onto the `./example` folder at the root of the repository (the example is used to test `yoga` locally)

```bash
cd ./example
```

And run `yoga`

```
npm run yoga
```

The server should start. You're ready to help 🙏
