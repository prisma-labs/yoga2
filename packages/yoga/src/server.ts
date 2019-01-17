import { ApolloServer } from 'apollo-server'
import { existsSync } from 'fs'
import { makeSchema } from 'nexus'
import { buildPrismaSchema } from 'nexus-prisma'
import { basename, dirname, join } from 'path'
import ts, { CompilerOptions } from 'typescript'
import { watch as watchFiles } from './compiler'
import {
  findFileByExtension,
  relativeToRootPath,
  invalidateImportCache,
} from './helpers'
import { InputConfig, Config } from './types'
import { tmpdir } from 'os'

/**
 * - Read config files
 * - Dynamically import and compile GraphQL types
 * - Run a GraphQL Server based on these types
 */
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

  const yogaConfig: InputConfig = await importYogaConfig(yogaConfigPath)
  const rootPath = dirname(tsConfigPath)
  const config = normalizeConfig(rootPath, yogaConfig)

  if (!existsSync(config.resolversPath)) {
    throw new Error(`Missing /graphql folder in ${config.resolversPath}`)
  }

  const compilerOptions: CompilerOptions = {
    noUnusedLocals: false,
    noUnusedParameters: false,
    noEmitOnError: false,
    sourceMap: false,
  }

  let oldServer: ApolloServer | null = null

  watchFiles(tsConfigPath, compilerOptions, async () => {
    const { types, context } = await importGraphqlTypesAndContext(
      config.resolversPath,
      config.contextPath,
      config.output.buildPath,
    )

    const nexusSchemaOptions = {
      types,
      outputs: {
        schema: config.output.schemaPath,
        typegen: config.output.typegenPath,
      },
      nullability: {
        input: false,
        inputList: false,
      },
    }

    const schema = config.prisma
      ? buildPrismaSchema({
          ...nexusSchemaOptions,
          prisma: config.prisma,
          typegenAutoConfig: {
            sources: [
              {
                module: config.prisma.prismaClientPath,
                alias: 'prisma',
              },
              ...(config.contextPath
                ? [
                    {
                      module: config.contextPath,
                      alias: 'ctx',
                    },
                  ]
                : []),
            ],
            contextType: 'ctx.Context',
          },
        })
      : makeSchema(nexusSchemaOptions)

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

/**
 * - Compute paths relative to the root of the project
 * - Set defaults if some options are missing
 */
function normalizeConfig(rootPath: string, config: InputConfig): Config {
  if (config.resolversPath) {
    config.resolversPath = relativeToRootPath(rootPath, config.resolversPath)
  } else {
    config.resolversPath = relativeToRootPath(rootPath, './src/graphql')
  }

  // Context path is optional and should remain undefined if none is provided or if the default path doesn't exist
  if (config.contextPath) {
    config.contextPath = relativeToRootPath(rootPath, config.contextPath)
  } else {
    const contextPath = relativeToRootPath(rootPath, './src/context.ts')
    if (existsSync(contextPath)) {
      config.contextPath = contextPath
    }
  }

  if (!config.output) {
    config.output = {}
  }

  if (config.output.typegenPath) {
    config.output.typegenPath = relativeToRootPath(
      rootPath,
      config.output.typegenPath,
    )
  } else {
    config.output.typegenPath = relativeToRootPath(
      rootPath,
      './src/generated/nexus.ts',
    )
  }

  if (config.output.schemaPath) {
    config.output.schemaPath = relativeToRootPath(
      rootPath,
      config.output.schemaPath,
    )
  } else {
    config.output.schemaPath = relativeToRootPath(
      rootPath,
      './src/generated/nexus.graphql',
    )
  }

  if (config.output.buildPath) {
    config.output.buildPath = relativeToRootPath(
      rootPath,
      config.output.buildPath,
    )
  } else {
    config.output.buildPath = relativeToRootPath(rootPath, './dist')
  }

  if (!config.prisma || config.prisma === true) {
    config.prisma = {}
  }

  if (config.prisma.prismaClientPath) {
    config.prisma.prismaClientPath = relativeToRootPath(
      rootPath,
      config.prisma.prismaClientPath,
    )
  } else {
    config.prisma.prismaClientPath = relativeToRootPath(
      rootPath,
      './src/generated/prisma-client/index.ts',
    )

    if (!existsSync(config.prisma.prismaClientPath)) {
      throw new Error(
        "Could not find a valid 'src/generated/prisma-client/index.ts' file.",
      )
    }
  }

  if (config.prisma.schemaPath) {
    config.prisma.schemaPath = relativeToRootPath(
      rootPath,
      config.prisma.schemaPath,
    )
  } else {
    config.prisma.schemaPath = relativeToRootPath(
      rootPath,
      './src/generated/prisma.graphql',
    )

    if (!existsSync(config.prisma.prismaClientPath)) {
      throw new Error(
        "Could not find a valid 'src/generated/prisma.graphql' file.",
      )
    }
  }

  if (!config.prisma.contextClientName) {
    config.prisma.contextClientName = 'prisma'
  }

  return config as Config
}

/**
 * Dynamically import GraphQL types from the ./src/graphql folder
 * and also from the context file
 */
async function importGraphqlTypesAndContext(
  resolversPath: string,
  contextFile: string | undefined,
  outputDir: string,
): Promise<{
  types: Record<string, any>
  context?: any /** Context<any> | ContextFunction<any> */
}> {
  const transpiledFiles = findFileByExtension(resolversPath, '.ts').map(file =>
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
      context = context.default
    } else {
      throw new Error('Context must be a default exported function')
    }
  }

  invalidateImportCache(transpiledFiles)

  const types = await Promise.all(transpiledFiles.map(file => import(file)))

  return {
    context,
    types: types.reduce((a, b) => ({ ...a, ...b }), {}),
  }
}

async function importYogaConfig(configPath: string): Promise<InputConfig> {
  const outDir = tmpdir()

  ts.createProgram([configPath], {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES5,
    outDir,
  }).emit()

  const config = await import(join(outDir, 'yoga.config.js'))

  return config.default as InputConfig
}
