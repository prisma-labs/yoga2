# Yoga

A lightweight 'Ruby on Rails'-like framework for GraphQL

> Note: This project is still very WIP

## What is Yoga?

Yoga is a GraphQL framework built with _conventions over configurations_ in mind.
Its goal is to help you get setup as quick as possible and to boost your daily productivity while allowing you to eject at any moment so that you're not locked when more flexibility is needed.

We take care of the boilerplate, you focus on the business logic.

## Features

- Type-safe
- Zero-config
- Scalable
- Conventions over configuration
- Resolver-first GraphQL
- Batteries included (DB, Auth, rate limiting, ...)
- Deploy anywhere

### What sort of abstraction does Yoga provide ?

Yoga is shipped with several technologies embedded such as a **GraphQL server**, a **database** to persist your data, and a **[library](https://graphql-nexus.com/)** to easily maintain and scale your server.

Thanks to _opinionated conventions_, Yoga offers built-in integration tools to better your daily workflows when crafting your GraphQL server:

- Speed-up your productivity with the **interactive scaffolding commands**.
- **Deploy anywhere** with the build command to deploy to any plateform
- Solve the usual **N+1 problem with ease** thanks to the integrated built-in dataloading helpers
- Optimized typescript **live reload**
- Easily **handle authentication and permissions**
- **Bootstrap** a customised, fully ready-to-use GraphQL server based on a datamodel

## Get started

### Start from scratch

Bootstrap a GraphQL server with a ready-made `yoga` setup then
start the server:

```bash
npm init yoga my-app
cd my-app
npm start
```

That's it, you're ready to start 🙌

### Add to existing project

#### Install

You can install `yoga` with either of the following commands:

```bash
npm install --save yoga
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
Usage: yoga <command> [options]

Commands:
  yoga new       Create new yoga project from template
  yoga start     Start the server
  yoga dev       Start the server in dev mode
  yoga scaffold  Scaffold a new GraphQL type
  yoga build     Build a yoga server

Options:
  --version   Show version number                                      [boolean]
  -h, --help  Show help                                                [boolean]
```

`yoga dev` will run a GraphQL server in watch mode, updating your server whenever a file change.

### Configuration

`yoga` comes with a default set of options (convention over configuration), but if you need to change them you can do so in the `yoga.config.ts`. Below is a table of all options, their types, and short descriptions.

| Key                         | Type                                                            | Default | Note                                                                                                                                                                                                                                              |
| --------------------------- | --------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `resolversPath`                  | `string` | `./src/graphql/`  | Path to the directory where your resolvers are defined. **If provided, path has to exist.** |
| `contextPath` | `string` | `./src/context.ts` | Path to your `context.ts` file. **If provided, path has to exist.** |
| `ejectFilePath` | `string` | `./src/server.ts` | Path to an `server.ts` file to eject from default configuration `yoga.config.ts`. When provided, all other configuration properties are ignored and should be configured programatically. **If provided, path has to exist.** |
| `output` | [`InputOutputFilesConfig`](/packages/yoga/src/types.ts#L25) | See below. | Configuration for the outputted files (schema, typings, etc). |
| `prisma` | [`InputPrismaConfig`](/packages/yoga/src/types.ts#L9) | See below. | Configuration for the Prisma integration. |

#### InputOutputFilesConfig

| Key                         | Type                                                            | Default | Note                                                                                                                                                                                                                                              |
| --------------------------- | --------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `typegenPath` | `string` | `./.yoga/nexus.ts`  | Path to the generated typings. |
| `schemaPath` | `string` | `./src/schema.graphql` | Path to the generated schema. |

#### InputPrismaConfig

| Key                         | Type                                                            | Default | Note                                                                                                                                                                                                                                              |
| --------------------------- | --------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `datamodelInfoPath` | `string` | `null`  | The default exported object generated by `nexus-prisma-generate`. Import it from the output directory generated by `nexus-prisma-generate` |
| `client` | [`PrismaClientInput`](https://github.com/prisma/nexus-prisma/blob/04a24271ae3b7d3cbee3318bc15c4b07cb70cd65/packages/nexus-prisma/src/types.ts#L99) | `./.yoga/prisma-client/index.ts` | Instance of the `prisma-client`, either passed statically or returned from the context defined in your GraphQL server. |


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
