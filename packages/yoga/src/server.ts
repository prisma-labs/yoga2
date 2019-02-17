import { ApolloServer } from 'apollo-server'
import { watch as nativeWatch } from 'chokidar'
import { existsSync } from 'fs'
import { makeSchema } from 'nexus'
import { makePrismaSchema } from 'nexus-prisma'
import { dirname, join } from 'path'
import PrettyError from 'pretty-error'
import { register } from 'ts-node'
import { importYogaConfig } from './config'
import { findFileByExtension, importFile, importUncached } from './helpers'
import { makeSchemaDefaults } from './nexusDefaults'
import { Config, Yoga, InputConfig } from './types'
import { datamodelInfo } from './yogaDefaults'

const pe = new PrettyError()

// Provide on-the-fly ts transpilation when requiring .ts files
register({
  transpileOnly: true,
  pretty: true,
})

export async function watch(): Promise<void> {
  console.clear()
  console.log('LOCAL')
  console.log('Starting server in watch mode...')
  let { yogaConfig, projectDir, inputConfig } = importYogaConfig()
  let oldServer: any | undefined = await start(yogaConfig)

  const filesToWatch = join(projectDir, '**', '*.ts')

  nativeWatch(filesToWatch, {
    ignored: [
      yogaConfig.output.schemaPath,
      yogaConfig.output.typegenPath,
      join(projectDir, 'node_modules'),
    ],
    usePolling: true,
  }).on('change', async () => {
    console.clear()
    console.log('** Restarting ***')
    try {
      yogaConfig = withFreshDatamodel(projectDir, inputConfig, yogaConfig)
      const yogaServer = getYogaServer(yogaConfig)

      if (oldServer !== undefined) {
        await yogaServer.stopServer(oldServer)
      }

      const serverInstance = await yogaServer.server(
        yogaConfig.ejectFilePath
          ? dirname(yogaConfig.ejectFilePath)
          : __dirname,
      )

      oldServer = serverInstance

      yogaServer.startServer(serverInstance)
    } catch (e) {
      console.error(pe.render(e))
    }
  })
}

function withFreshDatamodel(
  projectDir: string,
  inputConfig: InputConfig,
  yogaConfig: Config,
) {
  const datamodelInfoConfig =
    inputConfig.prisma !== undefined
      ? inputConfig.prisma.datamodelInfoPath
      : undefined
  const freshDatamodelInfo = datamodelInfo(projectDir, datamodelInfoConfig)
  if (yogaConfig.prisma) {
    yogaConfig.prisma.datamodelInfo = freshDatamodelInfo
  }

  return yogaConfig
}

export async function start(yogaConfig: Config): Promise<any> {
  try {
    const yogaServer = await getYogaServer(yogaConfig)
    const serverInstance = await yogaServer.server(
      yogaConfig.ejectFilePath ? dirname(yogaConfig.ejectFilePath) : __dirname,
    )

    await yogaServer.startServer(serverInstance)

    return serverInstance
  } catch (e) {
    console.error(pe.render(e))
  }
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
function importGraphqlTypesAndContext(
  resolversPath: string,
  contextPath: string | undefined,
): {
  types: Record<string, any>
  context?: any /** Context<any> | ContextFunction<any> */
} {
  const tsFiles = findFileByExtension(resolversPath, '.ts')
  let context = undefined

  if (contextPath !== undefined) {
    if (!existsSync(contextPath)) {
      throw new Error("Could not find a valid 'context.ts' file")
    }

    context = importFile(contextPath, 'default')

    if (typeof context !== 'function') {
      throw new Error('Context must be a default exported function')
    }
  }

  const types = tsFiles.map(file => importUncached(file))

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
function getYogaServer(config: Config): Yoga {
  if (!config.ejectFilePath) {
    return {
      async server() {
        const { types, context } = importGraphqlTypesAndContext(
          config.resolversPath,
          config.contextPath,
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

  const yogaServer = importFile<Yoga>(config.ejectFilePath, 'default')

  if (yogaServer.server && yogaServer.startServer && yogaServer.stopServer) {
    return yogaServer
  }

  throw new Error("Invalid 'src/index.ts' file")
}
