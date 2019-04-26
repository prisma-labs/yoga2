import { EOL } from 'os'
import * as path from 'path'
import { getRelativePath } from '.'
import { findFileByExtension } from '../../../helpers'
import { ConfigWithInfo } from '../../../types'

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

export function renderPrismaEjectFile(filePath: string, info: ConfigWithInfo) {
  const fileDir = path.dirname(filePath)

  return `
  import * as path from 'path'
  import { ApolloServer, makePrismaSchema, express, yogaEject } from 'yoga'
  ${renderImportIf('* as types', fileDir, info.yogaConfig.resolversPath)}
  ${renderImportIf('context', fileDir, info.yogaConfig.contextPath)}
  ${renderImportIf('expressMiddleware', fileDir, info.yogaConfig.expressPath)}
  ${renderImportIf('datamodelInfo', fileDir, info.datamodelInfoDir)}
  ${renderImportIf('{ prisma }', fileDir, info.prismaClientDir)}

  export default yogaEject({
    async server() {
      const schema = makePrismaSchema({
        types,
        prisma: {
          datamodelInfo,
          client: prisma
        },
        outputs: {
          schema: ${renderPathJoin(fileDir, info.yogaConfig.output.schemaPath)},
          typegen: ${renderPathJoin(
            fileDir,
            info.yogaConfig.output.typegenPath,
          )}
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
            },`
                : ''
            }
            ${
              info.yogaConfig.prisma
                ? `{
              source: ${renderPathJoin(
                fileDir,
                path.join(
                  info.yogaConfig.prisma.datamodelInfo.clientPath,
                  'index.ts',
                ),
              )},
              alias: 'prisma',
            },`
                : ''
            }
            ${
              info.yogaConfig.typesPath
                ? `{
              source: ${renderPathJoin(fileDir, info.yogaConfig.typesPath)},
              alias: 'types',
            }`
                : ''
            },
          ],
          ${info.yogaConfig.contextPath ? `contextType: 'ctx.Context'` : ''}
        }
      })   
      const apolloServer = new ApolloServer.ApolloServer({
        schema,
        ${info.yogaConfig.contextPath ? 'context' : ''}
      })
      const app = express()
    
      ${info.yogaConfig.expressPath ? 'await expressMiddleware(app)' : ''}
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
import { ApolloServer, makeSchema, express, yogaEject } from 'yoga'
${renderImportIf('* as types', fileDir, info.yogaConfig.resolversPath)}
${renderImportIf('context', fileDir, info.yogaConfig.contextPath)}
${renderImportIf('expressMiddleware', fileDir, info.yogaConfig.expressPath)}

export default yogaEject({
  async server() {
    const schema = makeSchema({
      types,
      outputs: {
        schema: ${renderPathJoin(fileDir, info.yogaConfig.output.schemaPath)},
        typegen: ${renderPathJoin(fileDir, info.yogaConfig.output.typegenPath)}
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
          },`
              : ''
          }
          ${
            info.yogaConfig.typesPath
              ? `{
            source: ${renderPathJoin(fileDir, info.yogaConfig.typesPath)},
            alias: 'types',
          },`
              : ''
          }
        ],
        contextType: 'ctx.Context'
      }
    })
    const apolloServer = new ApolloServer.ApolloServer({
      schema,
      ${info.yogaConfig.contextPath ? 'context' : ''}
    })
    const app = express()
    
    ${info.yogaConfig.expressPath ? 'await expressMiddleware(app)' : ''}
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

  return `path.join(__dirname, '${relativePath}')`
}

export function renderResolversIndex(info: ConfigWithInfo) {
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
