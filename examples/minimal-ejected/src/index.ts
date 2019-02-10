import * as path from 'path'
import { ApolloServer, makeSchema, Yoga } from 'yoga'
import context from './context'
import * as types from './graphql'

export default {
  server: dirname => {
    const schema = makeSchema({
      types,
      outputs: {
        schema: path.join(dirname, './schema.graphql'),
        typegen: path.join(dirname, '../yoga/nexus.ts'),
      },
      typegenAutoConfig: {
        sources: [
          {
            source: path.join(dirname, './context.ts'),
            alias: 'ctx',
          },
        ],
        contextType: 'ctx.Context',
      },
    })

    return new ApolloServer({
      schema,
      context,
    })
  },
  startServer: server =>
    server.listen().then(s => console.log(`Server listening at ${s.url}`)),
  stopServer: server => server.stop(),
} as Yoga<ApolloServer>
