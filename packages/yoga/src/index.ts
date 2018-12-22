#!/usr/bin/env node

import { ApolloServer } from 'apollo-server'
import { makeSchema } from 'nexus'
import { join, basename } from 'path'
import { existsSync } from 'fs'
import * as glob from 'glob'
import * as ts from 'typescript'

interface Config {
  typesPath: string
  outputSchemaPath: string
  outputTypegenPath: string
  contextPath?: string
  distOutputPath: string
}

main({
  outputSchemaPath: relativePath('./src/generated/nexus.graphql'),
  outputTypegenPath: relativePath('./src/generated/nexus.ts'),
  typesPath: relativePath('./src/graphql'),
  contextPath: relativePath('./src/context.ts'),
  distOutputPath: relativePath('./dist'),
})

async function main(config: Config) {
  if (!existsSync(config.typesPath)) {
    throw new Error('Missing /graphql folder')
  }

  const { types, context } = await importGraphqlTypes(
    config.typesPath,
    config.contextPath,
    config.distOutputPath,
  )

  const schema = makeSchema({
    types,
    outputs: {
      schema: config.outputSchemaPath,
      typegen: config.outputTypegenPath,
    },
  })

  const server = new ApolloServer({
    schema,
    context,
  })

  server.listen().then(({ url }) => console.log(`🚀  Server ready at ${url}`))
}

function relativePath(path: string) {
  return join(process.cwd(), path)
}

async function importGraphqlTypes(
  typesDir: string,
  contextFile: string | undefined,
  outputDir: string,
): Promise<{ types: any[]; context?: any }> {
  const typesFiles: string[] = glob.sync(`${typesDir}/*.ts`)
  const filesToTranspile =
    contextFile === undefined ? typesFiles : [...typesFiles, contextFile]

  ts.createProgram({
    options: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES5,
      outDir: outputDir,
    },
    rootNames: filesToTranspile,
  }).emit()

  const transpiledTypes = typesFiles.map(file =>
    join(outputDir, `${basename(file, '.ts')}.js`),
  )

  let context = undefined

  if (contextFile !== undefined) {
    const transpiledContextPath = join(
      outputDir,
      `${basename(contextFile, '.ts')}.js`,
    )

    context = await import(transpiledContextPath)

    if (context.default && typeof context.default === 'function') {
      context = context.default()
    } else {
      throw new Error('Context must be a default exported function')
    }
  }

  const types = await Promise.all(transpiledTypes.map(file => import(file)))

  return {
    context,
    types,
  }
}
