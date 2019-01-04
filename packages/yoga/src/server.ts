import { ApolloServer } from 'apollo-server'
import { existsSync } from 'fs'
import { makeSchema } from 'nexus'
import { basename, dirname, join } from 'path'
import ts, { CompilerOptions } from 'typescript'
import { watch as watchFiles } from './compiler'
import { findFileByExtension, relativeToRootPath } from './helpers'

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

export async function watch(): Promise<void> {
  const tsConfigPath = ts.findConfigFile(
    /*searchPath*/ process.cwd(),
    ts.sys.fileExists,
    'tsconfig.json',
  )

  if (!tsConfigPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.")
  }

  const yogaConfigPath = ts.findConfigFile(
    /*searchPath*/ process.cwd(),
    ts.sys.fileExists,
    'yoga.config.ts',
  )

  if (!yogaConfigPath) {
    throw new Error("Could not find a valid 'yoga.config.ts'.")
  }

  const rootPath = dirname(tsConfigPath)
  const yogaConfig = (await import(yogaConfigPath)).default.default
  const config = normalizeConfig(rootPath, yogaConfig)

  if (!existsSync(config.resolversPath)) {
    throw new Error(`Missing /graphql folder in ${config.resolversPath}`)
  }

  const compilerOptions: CompilerOptions = {
    noUnusedLocals: false,
    noUnusedParameters: false,
    noEmitOnError: false,
  }

  let oldServer: ApolloServer | null = null

  watchFiles(tsConfigPath, compilerOptions, async () => {
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
      nullability: {
        input: false,
        inputList: false,
      },
    })

    if (oldServer) {
      oldServer.stop()
    }

    const server = new ApolloServer({
      schema,
      context,
    })

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

  if (config.resolversPath) {
    config.resolversPath = relativeToRootPath(rootPath, config.resolversPath)
  } else {
    config.resolversPath = relativeToRootPath(rootPath, './src/graphql')
  }

  if (config.contextPath) {
    config.contextPath = relativeToRootPath(rootPath, config.contextPath)
  } else {
    config.contextPath = relativeToRootPath(rootPath, './src/context.ts')
  }

  if (config.output && !config.output.build) {
    config.output.build = relativeToRootPath(rootPath, './dist')
  }

  return config as Config
}

async function importGraphqlTypesAndContext(
  typesDir: string,
  contextFile: string | undefined,
  outputDir: string,
): Promise<{ types: Record<string, any>; context?: any }> {
  const transpiledTypes = findFileByExtension(typesDir, '.ts').map(file =>
    join(outputDir, 'graphql', `${basename(file, '.ts')}.js`),
  )
  let context = undefined

  if (contextFile !== undefined) {
    if (!existsSync(contextFile)) {
      throw new Error("Could not find a valid 'context.ts' file")
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

  // Invalidate import cache
  transpiledTypes.forEach(id => {
    if (require.cache[id]) {
      delete require.cache[id]
    }
  })

  const types = await Promise.all(transpiledTypes.map(file => import(file)))

  return {
    context,
    types: types.reduce<Record<string, any>>(
      (acc, type) => ({ ...acc, ...type }),
      {},
    ),
  }
}
