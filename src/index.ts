import { GraphQLServer } from 'graphql-yoga'
import { prisma } from './generated/prisma-client'

const server = new GraphQLServer({ context: { prisma } })

const port = process.env['PORT'] || 4000

server.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}`),
)
