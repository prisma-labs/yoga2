import { TypegenAutoConfigOptions } from 'nexus/dist/types'

export interface InputConfig {
  /** Path to the directory where your resolvers are defined */
  resolversPath?: string
  /** Path to your context.ts file */
  contextPath?: string
  /** Object containing all the properties for the outputted files */
  output?: {
    /** Path to the generated schema */
    schemaPath?: string
    /** Path to the generated typings */
    typegenPath?: string
    /** Path to the directory where the GraphQL server will be compiled */
    buildPath?: string
  }
  /** Enable prisma */
  prisma?:
    | true
    | {
        /** Path to the prisma.graphql file (default: /src/generated/prisma.graphql) */
        schemaPath?: string
        /** Variable name of the Prisma Client instance (default: prisma) */
        contextClientName?: string
        /** Path to the prisma-client/index.ts file (default: /src/generated/prisma-client/index.ts) */
        prismaClientPath?: string
      }
}

export interface Config {
  resolversPath: string
  contextPath?: string
  output: {
    schemaPath: string
    typegenPath: string
    buildPath: string
  }
  prisma?: {
    schemaPath: string
    contextClientName: string
    prismaClientPath: string
  }
}
