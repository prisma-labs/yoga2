#!/usr/bin/env node
import { ApolloServer } from 'apollo-server'
import * as fs from 'fs'
import { existsSync } from 'fs'
import { makeSchema } from 'nexus'
import { basename, extname, join, dirname } from 'path'
import ts from 'typescript'
import { watchMain } from './compiler'

export interface InputConfig {
  resolversPath?: string
  contextPath?: string
  output: {
    schemaPath: string
    typegenPath: string
    build?: string
  }
}

interface Config {
  resolversPath: string
  contextPath: string
  output: {
    schemaPath: string
    typegenPath: string
    build: string
  }
}

main()

async function main() {
  const tsConfigPath = ts.findConfigFile(
    /*searchPath*/ process.cwd(),
    ts.sys.fileExists,
    'tsconfig.json',
  )

  if (!tsConfigPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.")
  }

  const rootPath = dirname(tsConfigPath)
  const yogaConfigPath = ts.findConfigFile(
    /*searchPath*/ rootPath,
    ts.sys.fileExists,
    'yoga.config.ts',
  )
  if (!yogaConfigPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.")
  }

  const yogaConfig = (await import(yogaConfigPath)).default.default
  const config = normalizeConfig(rootPath, yogaConfig)

  if (!existsSync(config.resolversPath)) {
    throw new Error(`Missing /graphql folder in ${config.resolversPath}`)
  }

  let oldServer: ApolloServer | null = null

  watchMain(tsConfigPath, async () => {
    const { types, context } = await importGraphqlTypesAndContext(
      config.resolversPath,
      config.contextPath,
      config.output.build,
    )

    const schema = makeSchema({
      types,
      outputs: {
        schema: config.output.schemaPath,
        typegen: config.output.typegenPath,
      },
    })

    const server = new ApolloServer({
      schema,
      context,
    })

    if (oldServer) {
      oldServer.stop()
    }

    oldServer = server

    server.listen().then(({ url }) => console.log(`🚀  Server ready at ${url}`))
  })
}

function normalizeConfig(rootPath: string, config: InputConfig): Config {
  config.output.schemaPath = relativeToRootPath(
    rootPath,
    config.output.schemaPath,
  )
  config.output.typegenPath = relativeToRootPath(
    rootPath,
    config.output.typegenPath,
  )

  if (!config.resolversPath) {
    config.resolversPath = relativeToRootPath(rootPath, './src/graphql')
  } else {
    config.resolversPath = relativeToRootPath(rootPath, config.resolversPath)
  }

  if (!config.contextPath) {
    config.contextPath = relativeToRootPath(rootPath, './src/context.ts')
  } else {
    config.contextPath = relativeToRootPath(rootPath, config.contextPath)
  }

  if (config.output && !config.output.build) {
    config.output.build = relativeToRootPath(rootPath, './dist')
  }

  return config as Config
}

function relativeToRootPath(rootPath: string, path: string) {
  return join(rootPath, path)
}

function relativeToCwd(path: string) {
  return join(process.cwd(), path)
}

function findFileByExtension(
  base: string,
  ext: string,
  files?: string[],
  result?: string[],
) {
  files = files || fs.readdirSync(base)
  result = result || []

  files.forEach(file => {
    const newbase = join(base, file)

    if (fs.statSync(newbase).isDirectory()) {
      result = findFileByExtension(
        newbase,
        ext,
        fs.readdirSync(newbase),
        result,
      )
    } else {
      if (extname(file) === ext) {
        result!.push(newbase)
      }
    }
  })
  return result
}

async function importGraphqlTypesAndContext(
  typesDir: string,
  contextFile: string | undefined,
  outputDir: string,
): Promise<{ types: Record<string, any>; context?: any }> {
  const typesFiles: string[] = findFileByExtension(typesDir, '.ts')

  const transpiledTypes = typesFiles.map(file =>
    join(outputDir, 'graphql', `${basename(file, '.ts')}.js`),
  )

  let context = undefined

  if (contextFile !== undefined) {
    if (!existsSync(contextFile)) {
      throw new Error('')
    }

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
    types: types.reduce<Record<string, any>>(
      (acc, type) => ({ ...acc, ...type }),
      {},
    ),
  }
}
