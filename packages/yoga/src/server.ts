import { ApolloServer } from 'apollo-server'
import decache from 'decache'
import { existsSync } from 'fs'
import { makeSchema } from 'nexus'
import { makePrismaSchema } from 'nexus-prisma'
import { dirname } from 'path'
import { CompilerOptions } from 'typescript'
import { watch as watchFiles } from './compiler'
import { importYogaConfig } from './config'
import {
  findFileByExtension,
  getTranspiledPath,
  importUncached,
} from './helpers'
import { makeSchemaDefaults } from './nexusDefaults'
import { Config, Yoga } from './types'

/**
 * - Read config files
 * - Dynamically import and compile GraphQL types
 * - Run a GraphQL Server based on these types
 */
export async function watch(): Promise<void> {
  let {
    yogaConfig,
    rootDir,
    tsConfigPath,
    metaSchemaPath,
  } = await importYogaConfig()

  const compilerOptions: CompilerOptions = {
    noUnusedLocals: false,
    noUnusedParameters: false,
    noEmitOnError: false,
    sourceMap: false,
    esModuleInterop: true,
    outDir: yogaConfig.output.buildPath,
  }

  let oldServer: any | undefined = undefined

  watchFiles(
    tsConfigPath,
    compilerOptions,
    metaSchemaPath,
    async updatedConfig => {
      if (updatedConfig) {
        yogaConfig = updatedConfig
      }

      const yogaServer = await getYogaServer(rootDir, yogaConfig)

      if (oldServer !== undefined) {
        yogaServer.stopServer(oldServer)
      }

      const serverInstance = await yogaServer.server(
        yogaConfig.ejectFilePath
          ? dirname(yogaConfig.ejectFilePath)
          : __dirname,
      )

      oldServer = serverInstance

      yogaServer.startServer(serverInstance)
    },
  )
}

/**
 * Dynamically import GraphQL types from the ./src/graphql folder
 * and also from the context file
 *
 * @param rootDir The `rootDir` property from the `tsconfig.json` file
 * @param resolversPath The `resolversPath` property from the `yoga.config.ts` file
 * @param contextPath The `contextPath` property from the `yoga.config.ts` file
 * @param outDir The `outDir` property from the `tsconfig.json` file
 */
async function importGraphqlTypesAndContext(
  rootDir: string,
  resolversPath: string,
  contextPath: string | undefined,
  outDir: string,
): Promise<{
  types: Record<string, any>
  context?: any /** Context<any> | ContextFunction<any> */
}> {
  const transpiledFiles = findFileByExtension(resolversPath, '.ts').map(file =>
    getTranspiledPath(rootDir, file, outDir),
  )
  let context = undefined

  if (contextPath !== undefined) {
    if (!existsSync(contextPath)) {
      throw new Error("Could not find a valid 'context.ts' file")
    }

    const transpiledContextPath = getTranspiledPath(
      rootDir,
      contextPath,
      outDir,
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

/**
 *
 * @param rootDir The `rootDir` property from a `tsconfig.json` file
 * @param config The yoga config object
 */
async function getYogaServer(rootDir: string, config: Config): Promise<Yoga> {
  if (!config.ejectFilePath) {
    return {
      async server() {
        try {
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
              })
            : makeSchema(makeSchemaOptions)

          return new ApolloServer({
            schema,
            context,
          })
        } catch (e) {
          console.error(e)
        }
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
