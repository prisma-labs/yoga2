import { ApolloServer } from 'apollo-server-express'
import { watch as nativeWatch } from 'chokidar'
import express from 'express'
import { Server } from 'http'
import { makeSchema } from 'nexus'
import { makePrismaSchema } from 'nexus-prisma'
import * as path from 'path'
import PrettyError from 'pretty-error'
import { register } from 'ts-node'
import { importYogaConfig } from './config'
import { findFileByExtension, importFile } from './helpers'
import * as logger from './logger'
import { makeSchemaDefaults } from './nexusDefaults'
import { Config, ConfigWithInfo, Yoga } from './types'

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
  logger.warn('DEV')
  let info = importYogaConfig()
  let filesToWatch = [path.join(info.projectDir, '**', '*.ts')]

  if (info.prismaClientDir && info.datamodelInfoDir) {
    filesToWatch.push(info.prismaClientDir)
    filesToWatch.push(info.datamodelInfoDir)
  }

  let oldServer: any | undefined = await start(info, true)
  let filesToReloadBatched = [] as string[]

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
        filesToReloadBatched.push(fileName)

        if (filesToReloadBatched.length === 2) {
          // TODO: Do not invalidate everything, only the necessary stuff
          info = importYogaConfig({ invalidate: true })
          filesToReloadBatched = []
        } else {
          return Promise.resolve(true)
        }
      }
      logger.clearConsole()
      logger.info('Compiling')

      const { server, startServer, stopServer } = getYogaServer(info)

      if (oldServer !== undefined) {
        await stopServer(oldServer)
      }

      const serverInstance = await server()

      logger.clearConsole()
      logger.done('Compiled succesfully')

      oldServer = await startServer(serverInstance)
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
  info: ConfigWithInfo,
  withLog: boolean = false,
): Promise<any> {
  try {
    const { server, startServer } = getYogaServer(info)
    const serverInstance = await server()

    if (withLog) {
      logger.clearConsole()
      logger.done('Compiled successfully')
    }

    return startServer(serverInstance)
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
 * @param expressPath The `expressPath` property from the `yoga.config.ts` file
 */
function importArtifacts(
  resolversPath: string,
  contextPath: string | undefined,
  expressPath: string | undefined,
): {
  types: Record<string, any>
  context?: any /** Context<any> | ContextFunction<any> */
  expressMiddleware?: (app: Express.Application) => Promise<void> | void
} {
  const types = findFileByExtension(resolversPath, '.ts').map(file =>
    importFile(file),
  )
  let context = undefined
  let express = undefined

  if (contextPath !== undefined) {
    context = importFile(contextPath, 'default')

    if (typeof context !== 'function') {
      throw new Error(`${contextPath} must default export a function`)
    }
  }

  if (expressPath !== undefined) {
    express = importFile(expressPath, 'default')

    if (typeof express !== 'function') {
      throw new Error(`${expressPath} must default export a function`)
    }
  }

  return {
    context,
    expressMiddleware: express,
    types,
  }
}

/**
 *
 * @param config The yoga config object
 */
function getYogaServer(info: ConfigWithInfo): Yoga {
  const { yogaConfig: config } = info

  if (!config.ejectFilePath) {
    return {
      async server() {
        const app = express()
        const { types, context, expressMiddleware } = importArtifacts(
          config.resolversPath,
          config.contextPath,
          config.expressPath,
        )
        const allTypes: any[] = [types]

        const makeSchemaOptions = makeSchemaDefaults(
          config,
          allTypes,
          info.prismaClientDir,
        )
        const schema = config.prisma
          ? makePrismaSchema({
              ...makeSchemaOptions,
              prisma: config.prisma,
            })
          : makeSchema(makeSchemaOptions)
        const server = new ApolloServer({
          schema,
          context,
        })

        if (expressMiddleware) {
          await expressMiddleware(app)
        }

        server.applyMiddleware({ app, path: '/' })

        return app
      },
      async startServer(express) {
        return new Promise<Server>((resolve, reject) => {
          const httpServer = express
            .listen({ port: 4000 }, () => {
              console.log(`🚀  Server ready at http://localhost:4000/`)

              resolve(httpServer)
            })
            .on('error', err => reject(err))
        })
      },
      stopServer(httpServer) {
        return httpServer.close()
      },
    }
  }

  const yogaServer = importFile<Yoga>(config.ejectFilePath, 'default')

  if (yogaServer.server && yogaServer.startServer && yogaServer.stopServer) {
    return yogaServer
  }

  throw new Error("Invalid 'src/server.ts' file")
}
