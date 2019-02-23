import { PrismaClientInput } from 'nexus-prisma/dist/types'

export interface DatamodelInfo {
  uniqueFieldsByModel: Record<string, string[]>
  clientPath: string
  schema: { __schema: any }
}

export type InputPrismaConfig = {
  /**
   * The default exported object generated by `nexus-prisma-generate`
   *
   * Import it from the output directory generated by `nexus-prisma-generate`
   */
  datamodelInfoPath?: string
  /**
   * Instance of the prisma-client, either passed statically
   * or returned from the context defined in your GraphQL server
   *
   * @default ./.yoga/prisma-client/index.ts
   */
  client?: PrismaClientInput
}

export type InputOutputFilesConfig = {
  /**
   * Path to the generated typings
   * @default ./.yoga/nexus.ts
   */
  typegenPath?: string
  /**
   * Path to the generated schema
   * @default ./src/schema.graphql
   */
  schemaPath?: string
}

export type InputConfig = {
  /**
   * Path to the directory where your resolvers are defined.
   * **Path has to exist**
   * @default ./src/graphql/
   */
  resolversPath?: string
  /**
   * Path to your context.ts file. **If provided, path has to exist**
   * @default ./src/context.ts
   */
  contextPath?: string
  /**
   * Path to an `server.ts` file to eject from default configuration file `yoga.config.ts`.
   * When provided, all other configuration properties are ignored and should be configured programatically.
   * **If provided, path has to exist**
   * @default ./src/server.ts
   */
  ejectFilePath?: string
  /**
   * Config for the outputted files (schema, typings ..)
   */
  output?: InputOutputFilesConfig
  /**
   * Config for the prisma integration
   */
  prisma?: InputPrismaConfig
}

type RequiredProperty<T extends keyof InputConfig> = Exclude<
  Required<InputConfig[T]>,
  undefined
>

export type Config = {
  resolversPath: RequiredProperty<'resolversPath'>
  contextPath?: RequiredProperty<'contextPath'>
  ejectFilePath?: RequiredProperty<'ejectFilePath'>
  output: RequiredProperty<'output'>
  prisma?: {
    datamodelInfo: DatamodelInfo
    client: PrismaClientInput
  }
}

export type ConfigWithInfo = {
  yogaConfigPath?: string
  yogaConfig: Config
  projectDir: string
  inputConfig: InputConfig
  datamodelInfoDir?: string
  prismaClientDir?: string
}

export interface Yoga<Server = any> {
  server: (dirname: string) => Server | Promise<Server>
  startServer: (server: Server) => any | Promise<any>
  stopServer: (server: Server) => any | Promise<any>
}
