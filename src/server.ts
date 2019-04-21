import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { existsSync } from 'fs';
import { GraphQLSchema } from 'graphql';
import { applyMiddleware } from 'graphql-middleware';
import { Server } from 'http';
import { makeSchema } from 'nexus';
import { makePrismaSchema } from 'nexus-prisma';
import nodeWatch from 'node-watch';
import * as path from 'path';
import PrettyError from 'pretty-error';
import { register } from 'ts-node';
import { importYogaConfig } from './config';
import { findFileByExtension, importFile } from './helpers';
import * as logger from './logger';
import { makeSchemaDefaults } from './nexusDefaults';
import { ConfigWithInfo, GraphqlMiddleware, Yoga } from './types';

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

export async function watch(env?: string): Promise<void> {
  logger.clearConsole()
  logger.info('Starting development server...')
  let info = importYogaConfig({ env })

  let filesToWatch = [path.join(info.projectDir, 'src', '*.ts')]
  logger.info(`Watching ${JSON.stringify(filesToWatch)}`)

  if (info.prismaClientDir && info.datamodelInfoDir) {
    filesToWatch.push(info.prismaClientDir)
    filesToWatch.push(info.datamodelInfoDir)
  }

  let oldServer: any | undefined = await start(info, true)
  let filesToReloadBatched = [] as string[]
  const options = {
    delay: 1000,
  }
  const watcherCallback = async (
    _evt: 'update' | 'remove',
    fileName: string | Buffer,
  ) => {
    logger.info(`Detected Change in ${fileName}`)
    try {
      if (
        info.yogaConfig.prisma &&
        (fileName === path.join(info.prismaClientDir!, 'index.ts') ||
          fileName === path.join(info.datamodelInfoDir!, 'datamodel-info.ts'))
      ) {
        filesToReloadBatched.push(fileName)

        if (filesToReloadBatched.length === 2) {
          // TODO: Do not invalidate everything, only the necessary stuff
          info = importYogaConfig({ invalidate: true, env })
          filesToReloadBatched = []
        } else {
          return Promise.resolve(true)
        }
      }
      // logger.clearConsole()
      logger.info('Compiling')

      const { server, startServer, stopServer } = getYogaServer(info)

      if (oldServer !== undefined) {
        await stopServer(oldServer)
      }

      const serverInstance = await server()

      // logger.clearConsole()
      logger.done('Compiled successfully')

      oldServer = await startServer(serverInstance)
    } catch (e) {
      logger.error(pe.render(e))
    }
  }
  const watcher = nodeWatch('./src/', options, watcherCallback)
  watcher.on('error', logger.error)
}

// function getIgnoredFiles(
//   projectDir: string,
//   yogaConfig: Config,
//   datamodelInfoDir: string | undefined,
//   prismaClientDir: string | undefined,
// ) {
//   const ignoredFiles = [
//     yogaConfig.output.schemaPath,
//     yogaConfig.output.typegenPath,
//     path.join(projectDir, 'node_modules'),
//   ]

//   if (datamodelInfoDir) {
//     ignoredFiles.push(path.join(datamodelInfoDir, 'nexus-prisma.ts'))
//     ignoredFiles.push(path.join(datamodelInfoDir, 'index.ts'))
//   }

//   if (prismaClientDir) {
//     ignoredFiles.push(path.join(prismaClientDir, 'prisma-schema.ts'))
//   }

//   return ignoredFiles
// }

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
    logger.error(pe.render(e))
  }
}

/**
 * Dynamically import GraphQL types from the ./src/graphql folder
 * and also from the context file
 *
 * @param resolversPath The `resolversPath` property from the `yoga.config.ts` file
 * @param contextPath The `contextPath` property from the `yoga.config.ts` file
 * @param expressPath The `expressPath` property from the `yoga.config.ts` file
 * @param graphqlMiddlewarePath The `graphqlMiddlewarePath` property from the `yoga.config.ts` file
 */

function importArtifacts(
  resolversPath: string,
  contextPath: string | undefined,
  expressPath: string | undefined,
  graphqlMiddlewarePath: string | undefined,
): {
  types: Record<string, any>
  context?: any /** Context<any> | ContextFunction<any> */
  expressMiddleware?: (app: express.Application) => Promise<void> | void
  graphqlMiddleware?: GraphqlMiddleware
} {
  const resolversIndexPath = path.join(resolversPath, 'index.ts')
  let types: any = null

  if (existsSync(resolversIndexPath)) {
    types = importFile(resolversIndexPath)
  } else {
    types = findFileByExtension(resolversPath, '.ts').map(file =>
      importFile(file),
    )
  }

  let context: (() => void) | undefined = undefined
  let express: (() => void) | undefined = undefined
  let graphqlMiddleware: GraphqlMiddleware | undefined = undefined

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
  if (graphqlMiddlewarePath !== undefined) {
    graphqlMiddleware = importFile(graphqlMiddlewarePath, 'default')

    if (!graphqlMiddleware) {
      throw new Error(`Unable to import graphqlMiddleware from ${graphqlMiddlewarePath}`)
    }
  }
  
  return {
    context,
    expressMiddleware: express,
    graphqlMiddleware: graphqlMiddleware,
    types,
  }
}

/**
 *
 * @param config The yoga config object
 */
function getYogaServer(info: ConfigWithInfo): Yoga {
  const { yogaConfig: config } = info

  if (!config.ejectedFilePath) {
    return {
      async server() {
        const app = express()
        const { types, context, expressMiddleware, graphqlMiddleware } = importArtifacts(
          config.resolversPath,
          config.contextPath,
          config.expressPath,
          config.graphqlMiddlewarePath
        )
        const makeSchemaOptions = makeSchemaDefaults(
          config as any,
          types,
          info.prismaClientDir,
        )
        let schema: GraphQLSchema;
        if(config.prisma){
          logger.info("Using MakePrismaSchema")
          schema = makePrismaSchema({
            ...makeSchemaOptions,
            prisma: config.prisma,
          })
          logger.done("Prisma Schema Generated")
        } else {
          schema = makeSchema(makeSchemaOptions)
        }
        

        if(graphqlMiddleware){
          schema = applyMiddleware(schema, ...graphqlMiddleware)
        }
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
              logger.info(`🚀  Server ready at http://localhost:4000/`)

              resolve(httpServer)
            })
            .on('error', (err: any) => reject(err))
        })
      },
      stopServer(httpServer) {
        return httpServer.close()
      },
    }
  }

  const yogaServer = importFile<Yoga>(config.ejectedFilePath, 'default')

  if (yogaServer.server && yogaServer.startServer && yogaServer.stopServer) {
    return yogaServer
  }

  throw new Error("Invalid 'src/server.ts' file")
}
