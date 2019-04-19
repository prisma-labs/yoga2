import { DefaultConfig } from './types'
import { core } from 'nexus'
import { join } from 'path'

// TODO: shouldGenerateArtifacts should use process.env.NODE_ENV of the app using yoga, and not yoga process itself
export function makeSchemaDefaults(
  config: DefaultConfig,
  types: any,
  prismaClientDir: string | undefined,
): core.SchemaConfig {
  return {
    types,
    outputs: {
      schema: config.output.schemaPath,
      typegen: config.output.typegenPath,
    },
    nonNullDefaults: {
      input: true,
      output: true,
    },
    // @ts-ignore
    typegenAutoConfig: {
      sources: [
        ...(config.contextPath
          ? [
              {
                source: config.contextPath,
                alias: 'ctx',
              },
            ]
          : []),
        ...(prismaClientDir
          ? [
              {
                source: join(prismaClientDir, 'index.ts'),
                alias: 'prisma',
              },
            ]
          : []),
        ...(config.typesPath
          ? [
              {
                source: config.typesPath,
                alias: 'types',
              },
            ]
          : []),
      ],
      ...(config.contextPath ? { contextType: 'ctx.Context' } : {}),
    },
  }
}
