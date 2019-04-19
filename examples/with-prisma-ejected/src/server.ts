import { ApolloServer, express, makeSchema, yogaEject } from '@atto-byte/yoga';
import { Server } from 'http';
import * as path from 'path';
import context from './context';
import * as types from './graphql';

export default yogaEject({
  async server() {
    const app = express()

    const schema = makeSchema({
      types,
      outputs: {
        schema: path.join(__dirname, './schema.graphql'),
        typegen: path.join(__dirname, '../.yoga/nexus.ts'),
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

    apolloServer.applyMiddleware({ app, path: '/' })

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
  async stopServer(httpServer) {
    return httpServer.close()
  },
})
