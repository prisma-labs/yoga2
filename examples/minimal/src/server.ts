import * as path from 'path'
import { ApolloServer, makeSchema, express, yogaEject } from 'yoga'
import * as types from './graphql'
import context from './context'

export default yogaEject({
  async server() {
    const schema = makeSchema({
      types,
      outputs: {
        schema: path.join(__dirname, './schema.graphql'),
        typegen: path.join(__dirname, '../.yoga/nexus.ts'),
      },
      nonNullDefaults: {
        input: true,
        output: true,
      },
      typegenAutoConfig: {
        sources: [
          {
            source: path.join(__dirname, './context.ts'),
            alias: 'ctx',
          },
        ],
        contextType: 'ctx.Context',
      },
    })
    const apolloServer = new ApolloServer.ApolloServer({
      schema,
      context,
    })
    const app = express()

    apolloServer.applyMiddleware({ app, path: '/' })

    return app
  },
  async startServer(app) {
    return app.listen({ port: 4000 }, () => {
      console.log(`🚀  Server ready at http://localhost:4000/`)
    })
  },
  async stopServer(http) {
    http.close()
  },
})
