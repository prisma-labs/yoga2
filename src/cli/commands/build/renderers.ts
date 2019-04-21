import { EOL } from 'os'
import * as path from 'path'
import { findFileByExtension } from '../../../helpers'
import { ConfigWithInfo } from '../../../types'
import { getRelativePath } from '../build'

export function renderPermissionFile(ejectFilePath: string) {
  return `
  import yoga from '${getRelativePath(
    path.dirname(ejectFilePath),
    ejectFilePath,
  )}'

  import { and, or, rule, shield } from 'graphql-shield';
  import { ShieldRule } from 'graphql-shield/dist/types';
  import { NexusGenArgTypes } from './generated/nexus';
  import { UserType } from './generated/prisma-client';

  type NexusPermissions = {
    [T in keyof NexusGenArgTypes]?: {
      [P in keyof NexusGenArgTypes[T]]?: ShieldRule   
    }
  }
  const isAuthenticated = rule('isAuthenticated')(async (parent, args, ctx, info) => {
    return Boolean(ctx.user)
  })

  const isAdmin = rule()(async (parent, args, ctx, info) => {
    return ctx.user.userType === "ADMIN"
  })

  const isEmployee = rule()(async (parent, args, ctx, info) => {
    return ctx.user.userType === "EMPLOYEE"
  })
  const isSameUser = rule()(async (parent, args, ctx, info) => {
    return  ctx.user.id === args.where.id
  })

  const ruleTree: NexusPermissions = {
    
  }

  const permissions = shield(ruleTree)

  export default permissions
  `
}
export function renderIndexFile(ejectFilePath: string) {
  return `
  import yoga from '${getRelativePath(
    path.dirname(ejectFilePath),
    ejectFilePath,
  )}'

  async function main() {
    const serverInstance = await yoga.server()

    return yoga.startServer(serverInstance)
  }

  main()
  `
}
// TODO Fix ConfigWithInfo Types
export function renderPrismaEjectFile(filePath: string, config: ConfigWithInfo) {
  const fileDir = path.dirname(filePath)

  return `
  import * as path from 'path'
  import { ApolloServer, makePrismaSchema, express, yogaEject, applyMiddleware } from '@atto-byte/yoga'
  ${renderImportIf('* as types', fileDir, config.yogaConfig.resolversPath)}
  ${renderImportIf('context', fileDir, config.yogaConfig.contextPath)}
  ${renderImportIf('expressMiddleware', fileDir, config.yogaConfig.expressPath)}
  ${renderImportIf('graphqlMiddleware', fileDir, config.yogaConfig.graphqlMiddlewarePath)}
  ${renderImportIf('datamodelInfo', fileDir, config.datamodelInfoDir)}
  ${renderImportIf('{ prisma }', fileDir, config.prismaClientDir)}

  export default yogaEject({
    async server() {
      let schema = makePrismaSchema({
        types,
        prisma: {
          datamodelInfo,
          client: prisma
        },
        outputs: {
          schema: ${config.yogaConfig.output.schemaPath &&
            renderPathJoin(fileDir, config.yogaConfig.output.schemaPath)},
          typegen: ${renderPathJoin(
            fileDir,
            config.yogaConfig.output.typegenPath || '',
          )}
        },
        nonNullDefaults: {
          input: true,
          output: true,
        },
        typegenAutoConfig: {
          sources: [
            ${
              config.yogaConfig.contextPath
                ? `{
              source: ${renderPathJoin(fileDir, config.yogaConfig.contextPath)},
              alias: 'ctx',
            }`
                : ''
            },
            ${
              config.yogaConfig.prisma
                ? `{
              source: ${renderPathJoin(
                fileDir,
                path.join(
                  config.yogaConfig.prisma.datamodelInfo.clientPath,
                  'index.ts',
                ),
              )},
              alias: 'prisma',
            }`
                : ''
            },
            ${
              config.yogaConfig.typesPath
                ? `{
              source: ${renderPathJoin(fileDir, config.yogaConfig.typesPath)},
              alias: 'types',
            }`
                : ''
            },
          ],
          ${config.yogaConfig.contextPath ? `contextType: 'ctx.Context'` : ''}
        }
      })
      ${config.yogaConfig.graphqlMiddlewarePath ? 'schema = applyMiddleware(schema, ...graphqlMiddleware)' : ''}
      
      const apolloServer = new ApolloServer.ApolloServer({
        schema,
        ${config.yogaConfig.contextPath ? 'context' : ''}
      })
      const app = express()
    
      ${config.yogaConfig.expressPath ? 'await expressMiddleware({app})' : ''}
      apolloServer.applyMiddleware({ app, path: '/' })

      return app
    },
    async startServer(app) {
      return app.listen({ port: 4000 }, () => {
        console.log(
          \`🚀  Server ready at http://localhost:4000/\`,
        )
      })
    },
    async stopServer(http) {
      http.close()
    }
  })
  `
}

export function renderSimpleIndexFile(filePath: string, info: ConfigWithInfo) {
  const fileDir = path.dirname(filePath)

  return `\
import * as path from 'path'
import { ApolloServer, makeSchema, express, yogaEject, applyMiddleware } from '@atto-byte/yoga'
${renderImportIf('* as types', fileDir, info.yogaConfig.resolversPath)}
${renderImportIf('context', fileDir, info.yogaConfig.contextPath)}
${renderImportIf('expressMiddleware', fileDir, info.yogaConfig.expressPath)}
${renderImportIf('graphqlMiddleware', fileDir, info.yogaConfig.graphqlMiddlewarePath)}

export default yogaEject({
  async server() {
    const schema = makeSchema({
      types,
      outputs: {
        schema: ${info.yogaConfig.output.schemaPath &&
          renderPathJoin(fileDir, info.yogaConfig.output.schemaPath)},
        typegen: ${info.yogaConfig.output.typegenPath &&
          renderPathJoin(fileDir, info.yogaConfig.output.typegenPath)}
      },
      nonNullDefaults: {
        input: true,
        output: true,
      },
      typegenAutoConfig: {
        sources: [
          ${
            info.yogaConfig.contextPath
              ? `{
            source: ${renderPathJoin(fileDir, info.yogaConfig.contextPath)},
            alias: 'ctx',
          }`
              : ''
          },
          ${
            info.yogaConfig.typesPath
              ? `{
            source: ${renderPathJoin(fileDir, info.yogaConfig.typesPath)},
            alias: 'types',
          }`
              : ''
          },
        ],
        contextType: 'ctx.Context'
      }
    })
    ${info.yogaConfig.graphqlMiddlewarePath ? 'schema = applyMiddleware(schema, ...graphqlMiddleware)' : ''}
    const apolloServer = new ApolloServer.ApolloServer({
      schema,
      ${info.yogaConfig.contextPath ? 'context' : ''}
    })
    const app = express()
    
    ${info.yogaConfig.expressPath ? 'await expressMiddleware({app})' : ''}
    apolloServer.applyMiddleware({ app, path: '/' })

    return app
  },
  async startServer(app) {
    return app.listen({ port: 4000 }, () => {
      console.log(
        \`🚀  Server ready at http://localhost:4000/\`,
      )
    })
  },
  async stopServer(http) {
    http.close()
  }
})
`
}

function renderPathJoin(sourceDir: string, targetPath: string) {
  let relativePath = path.relative(sourceDir, targetPath)

  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath
  }
  return `path.join(__dirname, '${relativePath.replace(/\\/g,"/")}')`
}

export function renderResolversIndex(info: ConfigWithInfo) {
  if (info.yogaConfig.resolversPath) {
    const resolversFile = findFileByExtension(
      info.yogaConfig.resolversPath,
      '.ts',
    )
    return `\
      ${resolversFile
        .map(
          filePath =>
            `export * from '${getRelativePath(
              info.yogaConfig.resolversPath,
              filePath,
            )}'`,
        )
        .join(EOL)}
            `
  } else {
    console.warn('There is no resolver path defined')
    return ''
  }
}

export function renderImportIf(
  importName: string,
  sourceDir: string,
  targetPath: string | undefined,
) {
  if (!targetPath) {
    return ''
  }

  return `import ${importName} from '${getRelativePath(sourceDir, targetPath)}'`
}
