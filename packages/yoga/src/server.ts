import { ApolloServer } from 'apollo-server'
import decache from 'decache'
import { existsSync } from 'fs'
import { makeSchema } from 'nexus'
import { makePrismaSchema } from 'nexus-prisma'
import { tmpdir } from 'os'
import { dirname, join } from 'path'
import ts, { CompilerOptions } from 'typescript'
import { watch as watchFiles } from './compiler'
import {
  findFileByExtension,
  getTranspiledPath,
  importUncached,
} from './helpers'
import { makeSchemaDefaults } from './nexusDefaults'
import { Config, InputConfig, Yoga } from './types'
import * as YogaDefaults from './yogaDefaults'

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

  const tsConfig = ts.parseJsonConfigFileContent(
    require(tsConfigPath),
    ts.sys,
    dirname(tsConfigPath),
  )
  const yogaConfig: InputConfig = await importYogaConfig(yogaConfigPath)
  const projectDir = dirname(tsConfigPath)
  const config = normalizeConfig(
    yogaConfig,
    projectDir,
    tsConfig.options.outDir,
  )
  const rootDir = tsConfig.options.rootDir

  if (!rootDir) {
    throw new Error(
      "You must define a `rootDir` and `outDir` property in your 'tsconfig.json' file",
    )
  }

  const compilerOptions: CompilerOptions = {
    noUnusedLocals: false,
    noUnusedParameters: false,
    noEmitOnError: false,
    sourceMap: false,
    esModuleInterop: true,
    outDir: config.output.buildPath,
  }

  let oldServer: any | undefined = undefined

  watchFiles(tsConfigPath, compilerOptions, async () => {
    const yogaServer = await getYogaServer(rootDir, config)

    if (oldServer !== undefined) {
      yogaServer.stopServer(oldServer)
    }

    const serverInstance = await yogaServer.server(
      config.ejectFilePath ? dirname(config.ejectFilePath) : __dirname,
    )

    oldServer = serverInstance

    yogaServer.startServer(serverInstance)
  })
}

/**
 * - Compute paths relative to the root of the project
 * - Set defaults when needed
 */
function normalizeConfig(
  config: InputConfig,
  projectDir: string,
  outDir: string | undefined,
): Config {
  const outputConfig: Config = {
    contextPath: YogaDefaults.contextPath(projectDir, config.contextPath),
    resolversPath: YogaDefaults.resolversPath(projectDir, config.resolversPath),
    ejectFilePath: YogaDefaults.ejectFilePath(projectDir, config.ejectFilePath),
    output: YogaDefaults.output(projectDir, config.output, outDir),
    prisma: YogaDefaults.prisma(projectDir, config.prisma),
  }

  return outputConfig
}

/**
 * Dynamically import GraphQL types from the ./src/graphql folder
 * and also from the context file
 */
async function importGraphqlTypesAndContext(
  projectDir: string,
  resolversPath: string,
  contextFile: string | undefined,
  outputDir: string,
): Promise<{
  types: Record<string, any>
  context?: any /** Context<any> | ContextFunction<any> */
}> {
  const transpiledFiles = findFileByExtension(resolversPath, '.ts').map(file =>
    getTranspiledPath(projectDir, file, outputDir),
  )
  let context = undefined

  if (contextFile !== undefined) {
    if (!existsSync(contextFile)) {
      throw new Error("Could not find a valid 'context.ts' file")
    }

    const transpiledContextPath = getTranspiledPath(
      projectDir,
      contextFile,
      outputDir,
    )

    context = await importUncached(transpiledContextPath)

    if (context.default && typeof context.default === 'function') {
      context = context.default
    } else {
      throw new Error('Context must be a default exported function')
    }
  }

  const types = await Promise.all(
    transpiledFiles.map(file => importUncached(file)),
  )

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

  const config = await importUncached(join(outDir, 'yoga.config.js'))

  return config.default as InputConfig
}

async function getYogaServer(rootDir: string, config: Config): Promise<Yoga> {
  if (!config.ejectFilePath) {
    return {
      async server() {
        const { types, context } = await importGraphqlTypesAndContext(
          rootDir,
          config.resolversPath,
          config.contextPath,
          config.output.buildPath,
        )

        const makeSchemaOptions = makeSchemaDefaults(config, types)

        const schema = config.prisma
          ? makePrismaSchema({
              ...makeSchemaOptions,
              prisma: config.prisma,
              // @ts-ignore
              typegenAutoConfig: {
                ...makeSchemaOptions.typegenAutoConfig,
                sources: [
                  ...makeSchemaOptions.typegenAutoConfig!.sources,
                  {
                    module: config.prisma.prismaClientPath,
                    alias: 'prisma',
                  },
                ],
              },
            })
          : makeSchema(makeSchemaOptions)

        return new ApolloServer({
          schema,
          context,
        })
      },
      startServer(server) {
        return server
          .listen()
          .then(({ url }) => console.log(`🚀  Server ready at ${url}`))
      },
      stopServer(server) {
        return server.stop()
      },
    } as Yoga<ApolloServer>
  }

  const ejectFileTranspiledPath = getTranspiledPath(
    rootDir,
    config.ejectFilePath,
    config.output.buildPath,
  )

  // Invalidate module and all imports from this module
  decache(ejectFileTranspiledPath)

  const ejectFileImport = await import(ejectFileTranspiledPath)

  if (ejectFileImport.default) {
    const yogaServer = ejectFileImport.default as Yoga

    if (yogaServer.server && yogaServer.startServer && yogaServer.stopServer) {
      return yogaServer
    }
  }

  throw new Error("Invalid 'src/index.ts' file")
}
