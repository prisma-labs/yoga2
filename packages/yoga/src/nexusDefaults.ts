import { Config } from './types'
import { core } from 'nexus'

// TODO: shouldGenerateArtifacts should use process.env.NODE_ENV of the app using yoga, and not yoga process itself
export function makeSchemaDefaults(
  config: Config,
  types: any,
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
      ],
      ...(config.contextPath ? { contextType: 'ctx.Context' } : {}),
    },
  }
}
