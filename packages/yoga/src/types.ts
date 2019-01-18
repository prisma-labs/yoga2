export interface InputConfig {
  /** Path to the directory where your resolvers are defined */
  resolversPath?: string
  /** Path to your context.ts file */
  contextPath?: string
  /**
   * Path to a index.ts file to eject from default configuration file (default: /src/index.ts)
   * When provided, all other configuration properties are ignored and should be configured programatically
   */
  ejectFilePath?: string
  /** Object containing all the properties for the outputted files */
  output?: {
    /** Path to the generated schema */
    schemaPath?: string
    /** Path to the generated typings */
    typegenPath?: string
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
  ejectFilePath?: string
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

export interface Yoga<Server = any> {
  server: (dirname: string) => Server | Promise<Server>
  startServer: (server: Server) => any | Promise<any>
  stopServer: (server: Server) => any | Promise<any>
}
