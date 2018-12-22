import { ApolloServer } from 'apollo-server'
import { makeSchema } from 'nexus'
import { join } from 'path'
import { existsSync } from 'fs'

interface Config {
  typesPath: string
  outputSchemaPath: string
  outputTypegenPath: string
  contextPath?: string
}

main({
  outputSchemaPath: relativePath('./src/generated/nexus.graphql'),
  outputTypegenPath: relativePath('./src/generated/nexus.ts'),
  typesPath: relativePath('./src/graphql/index.ts'),
  contextPath: relativePath('./src/context.ts'),
})

function main(config: Config) {
  if (!existsSync(config.typesPath)) {
    throw new Error('Missing index.ts file in /graphql folder')
  }

  const schema = makeSchema({
    types: config.typesPath,
    outputs: {
      schema: config.outputSchemaPath,
      typegen: config.outputTypegenPath,
    },
  })

  let context =
    config.contextPath && existsSync(config.contextPath)
      ? import(config.contextPath)
      : {}

  if (typeof context === 'function') {
    context = context()
  }

  const server = new ApolloServer({
    schema,
    context,
  })

  server.listen().then(({ url }) => console.log(`🚀  Server ready at ${url}`))
}

function relativePath(path: string) {
  return join(process.cwd(), path)
}
