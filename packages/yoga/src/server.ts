import { ApolloServer } from 'apollo-server'
import { watch as nativeWatch } from 'chokidar'
import * as glob from 'glob'
import { makeSchema } from 'nexus'
import { makePrismaSchema } from 'nexus-prisma'
import * as path from 'path'
import { register } from 'ts-node'
import { importYogaConfig } from './config'
import { findFileByExtension, importFile, importUncached } from './helpers'
import * as logger from './logger'
import { makeSchemaDefaults } from './nexusDefaults'
import { Config, Yoga } from './types'
import PrettyError from 'pretty-error'

const pe = new PrettyError().appendStyle({
  'pretty-error': {
    marginLeft: '0',
  },
  'pretty-error > header > title > kind': {
    background: 'red',
    color: 'bright-white',
    padding: '1',
  },
})

// Provide on-the-fly ts transpilation when requiring .ts files
register({
  transpileOnly: true,
  pretty: true,
})

export async function watch(): Promise<void> {
  logger.clearConsole()
  logger.info('Starting development server...')
  let info = importYogaConfig()
  const filesToWatch = glob.sync(path.join(info.projectDir, '**', '*.ts'), {
    dot: true,
  })

  let oldServer: any | undefined = await start(
    info.yogaConfig,
    info.prismaClientDir,
    true,
  )
  let batchedGeneratedFiles = [] as string[]

  nativeWatch(filesToWatch, {
    usePolling: true, // fsEvents randomly triggers twice on OSX
    ignored: getIgnoredFiles(
      info.projectDir,
      info.yogaConfig,
      info.datamodelInfoDir,
      info.prismaClientDir,
    ),
  }).on('change', async fileName => {
    try {
      if (
        info.yogaConfig.prisma &&
        (fileName === path.join(info.prismaClientDir!, 'index.ts') ||
          fileName === path.join(info.datamodelInfoDir!, 'datamodel-info.ts'))
      ) {
        batchedGeneratedFiles.push(fileName)

        if (batchedGeneratedFiles.length === 2) {
          // TODO: Do not invalidate everything, only the necessary stuff
          info = importYogaConfig({ invalidate: true })
          batchedGeneratedFiles = []
        } else {
          return Promise.resolve(true)
        }
      }
      console.clear()
      logger.info('Compiling')

      const yogaServer = getYogaServer(info.yogaConfig, info.prismaClientDir)

      if (oldServer !== undefined) {
        await yogaServer.stopServer(oldServer)
      }

      const serverInstance = await yogaServer.server(
        info.yogaConfig.ejectFilePath
          ? path.dirname(info.yogaConfig.ejectFilePath)
          : __dirname,
      )

      oldServer = serverInstance

      logger.clearConsole()
      logger.done('Compiled succesfully')

      await yogaServer.startServer(serverInstance)
    } catch (e) {
      console.error(pe.render(e))
    }
  })
}

function getIgnoredFiles(
  projectDir: string,
  yogaConfig: Config,
  datamodelInfoDir: string | undefined,
  prismaClientDir: string | undefined,
) {
  const ignoredFiles = [
    yogaConfig.output.schemaPath,
    yogaConfig.output.typegenPath,
    path.join(projectDir, 'node_modules'),
  ]

  if (datamodelInfoDir) {
    ignoredFiles.push(path.join(datamodelInfoDir, 'nexus-prisma.ts'))
    ignoredFiles.push(path.join(datamodelInfoDir, 'index.ts'))
  }

  if (prismaClientDir) {
    ignoredFiles.push(path.join(prismaClientDir, 'prisma-schema.ts'))
  }

  return ignoredFiles
}

export async function start(
  yogaConfig: Config,
  prismaClientDir: string | undefined,
  withLog: boolean = false,
): Promise<any> {
  try {
    const yogaServer = await getYogaServer(yogaConfig, prismaClientDir)
    const serverInstance = await yogaServer.server(
      yogaConfig.ejectFilePath
        ? path.dirname(yogaConfig.ejectFilePath)
        : __dirname,
    )

    if (withLog) {
      logger.clearConsole()
      logger.done('Compiled successfully')
    }

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
 * @param resolversPath The `resolversPath` property from the `yoga.config.ts` file
 * @param contextPath The `contextPath` property from the `yoga.config.ts` file
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
 * @param config The yoga config object
 */
function getYogaServer(
  config: Config,
  prismaClientDir: string | undefined,
): Yoga {
  if (!config.ejectFilePath) {
    return {
      async server() {
        const { types, context } = importGraphqlTypesAndContext(
          config.resolversPath,
          config.contextPath,
        )
        const makeSchemaOptions = makeSchemaDefaults(
          config,
          types,
          prismaClientDir,
        )
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

  throw new Error("Invalid 'src/server.ts' file")
}
