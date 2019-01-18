import { Config } from './types'
import { Types } from 'nexus/dist/core'

// TODO: shouldGenerateArtifacts should use process.env.NODE_ENV of the app using yoga, and not yoga process itself
export function makeSchemaDefaults(
  config: Config,
  types: any,
): Types.SchemaConfig {
  return {
    types,
    outputs: {
      schema: config.output.schemaPath,
      typegen: config.output.typegenPath,
    },
    nullability: {
      input: false,
      inputList: false,
    },
    // @ts-ignore
    typegenAutoConfig: {
      sources: [
        ...(config.contextPath
          ? [
              {
                module: config.contextPath,
                alias: 'ctx',
              },
            ]
          : []),
      ],
      ...(config.contextPath ? { contextType: 'ctx.Context' } : {}),
    },
  }
}
