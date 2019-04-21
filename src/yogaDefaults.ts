import { existsSync } from 'fs'
import { PrismaClientInput } from 'nexus-prisma/dist/types'
import { join, relative } from 'path'
import { findPrismaConfigFile } from './config'
import { importFile } from './helpers'
import {
  Config,
  DatamodelInfo,
  InputConfig,
  InputOutputFilesConfig,
  InputPrismaConfig,
  DefaultConfig,
} from './types'
import chalk from 'chalk'
import * as logger from './logger'

export const DEFAULTS: DefaultConfig = {
  contextPath: './src/context.ts',
  resolversPath: './src/graphql/',
  typesPath: './src/types.ts',
  ejectedFilePath: './src/server.ts',
  output: {
    typegenPath: './src/generated/nexus.ts',
    schemaPath: './src/generated/schema.graphql',
  },
  prisma: {
    /**
     * Do not use that as a default value, this is just a placeholder
     * When `datamodelInfo` isn't provided, we're importing it from `DEFAULT_NEXUS_PRISMA_SCHEMA_PATH` defined below
     */
    datamodelInfo: {
      schema: { __schema: null },
      uniqueFieldsByModel: {},
      clientPath: '',
      embeddedTypes: [],
    },
    /**
     * Do not use that as a default value, this is just a placeholder
     * When `client` isn't provided, we're importing it from `datamodel.clientPath`
     */
    client: {
      $exists: null,
      $graphql: null as any, // FIXME
    },
  },
  expressPath: './src/express.ts',
  graphqlMiddlewarePath: './src/graphqlMiddleware.ts'
}

export const DEFAULT_META_SCHEMA_DIR = './src/generated/nexus-prisma/'

/**
 * - Compute paths relative to the root of the project
 * - Set defaults when needed
 */
export function normalizeConfig(
  config: InputConfig,
  projectDir: string,
): Config {
  const outputConfig: Config = {
    contextPath: contextPath(projectDir, config.contextPath),
    resolversPath: resolversPath(projectDir, config.resolversPath),
    typesPath: typesPath(projectDir, config.typesPath),
    ejectedFilePath: ejectFilePath(projectDir, config.ejectedFilePath),
    expressPath: expressPath(projectDir, config.expressPath),
    graphqlMiddlewarePath: graphqlMiddlewarePath(projectDir, config.graphqlMiddlewarePath),
    output: output(projectDir, config.output),
    prisma: prisma(projectDir, config.prisma),
  }

  return outputConfig
}

/**
 * Returns either a value from yoga.config.ts or from the defaults
 */
function inputOrDefaultValue(input: string | undefined, defaultValue: string) {
  return input ? input : defaultValue
}

/**
 * Returns either a user inputted path, or the default one
 * Join the path with the root project dir
 */
function inputOrDefaultPath(
  projectDir: string,
  input: string | undefined,
  defaultValue: string,
): string {
  const path = inputOrDefaultValue(input, defaultValue)

  return join(projectDir, path)
}

/**
 * Optional input path
 * If @input is provided, @path has to exists
 */
function optional(
  path: string,
  input: string | undefined,
  errorMessage: string,
) {
  if (!existsSync(path)) {
    if (input) {
      logger.error(errorMessage)
      process.exit(1)
    }

    return undefined
  }

  return path
}

/**
 * Optional required path
 * @path has to exists (from @input or @default)
 */
function requiredPath(path: string, errorMessage: string) {
  if (!existsSync(path)) {
    logger.error(errorMessage)
    process.exit(1)
  }

  return path
}

function buildError(
  projectDir: string,
  filePath: string,
  propertyName: string,
) {
  const resolvedPath = filePath.startsWith('.')
    ? filePath
    : relative(projectDir, filePath)

  return `Could not a find a valid \`${chalk.yellow(
    propertyName,
  )}\` at \`${chalk.yellow(resolvedPath)}\``
}

function contextPath(
  projectDir: string,
  input: string | undefined,
): string | undefined {
  const path = inputOrDefaultPath(projectDir, input, DEFAULTS.contextPath!)

  return optional(path, input, buildError(projectDir, path, 'contextPath'))
}

function resolversPath(projectDir: string, input: string | undefined): string {
  const path = inputOrDefaultPath(projectDir, input, DEFAULTS.resolversPath)

  return requiredPath(path, buildError(projectDir, path, 'resolversPath'))
}

function typesPath(
  projectDir: string,
  input: string | undefined,
): string | undefined {
  const path = inputOrDefaultPath(projectDir, input, DEFAULTS.typesPath!)

  return optional(path, input, buildError(projectDir, path, 'typesPath'))
}

function ejectFilePath(
  projectDir: string,
  input: string | undefined,
): string | undefined {
  const path = inputOrDefaultPath(projectDir, input, DEFAULTS.ejectedFilePath!)

  return optional(path, input, buildError(projectDir, path, 'ejectFilePath'))
}

function expressPath(
  projectDir: string,
  input: string | undefined,
): string | undefined {
  const path = inputOrDefaultPath(projectDir, input, DEFAULTS.expressPath!)

  return optional(path, input, buildError(projectDir, path, 'expressPath'))
}
function graphqlMiddlewarePath(
  projectDir: string,
  input: string | undefined,
): string | undefined {
  const path = inputOrDefaultPath(projectDir, input, DEFAULTS.graphqlMiddlewarePath!)

  return optional(path, input, buildError(projectDir, path, 'graphqlMiddleware'))
}
function output(
  projectDir: string,
  input: InputOutputFilesConfig | undefined,
): {
  typegenPath: string
  schemaPath: string
} {
  if (!input) {
    input = {}
  }

  const typegenPath = inputOrDefaultPath(
    projectDir,
    input.typegenPath,
    DEFAULTS.output.typegenPath,
  )
  const schemaPath = inputOrDefaultPath(
    projectDir,
    input.schemaPath,
    DEFAULTS.output.schemaPath,
  )

  return {
    typegenPath,
    schemaPath,
  }
}

export function client(
  projectDir: string,
  input: PrismaClientInput | undefined,
  datamodelInfo: DatamodelInfo,
): PrismaClientInput {
  if (input === undefined) {
    const clientPath = requiredPath(
      join(projectDir, datamodelInfo.clientPath, 'index.ts'),
      `${buildError(
        projectDir,
        datamodelInfo.clientPath,
        'prisma.client',
      )}. Try running ${chalk.yellow(
        'prisma deploy',
      )} to generate the needed files.`,
    )

    return importFile<PrismaClientInput>(clientPath, 'prisma', true)
  }

  return input
}

export function datamodelInfo(
  projectDir: string,
  input: string | undefined,
): DatamodelInfo {
  const datamodelInfoPath = inputOrDefaultPath(
    projectDir,
    input,
    join(DEFAULT_META_SCHEMA_DIR, 'datamodel-info.ts'),
  )
  return importFile<DatamodelInfo>(
    requiredPath(
      datamodelInfoPath,
      `${buildError(
        projectDir,
        datamodelInfoPath,
        'prisma.datamodelInfoPath',
      )}. Try running ${chalk.yellow(
        'prisma deploy',
      )} to generate the needed files.`,
    ),
    'default',
  )
}

function prisma(
  projectDir: string,
  input: InputPrismaConfig | undefined,
):
  | {
      datamodelInfo: DatamodelInfo
      client: PrismaClientInput
    }
  | undefined {
  const hasPrisma = !!findPrismaConfigFile(projectDir)

  // If `prisma` undefined and no prisma.yml file, prisma isn't used
  if (input === undefined && !hasPrisma) {
    return undefined
  }

  // If `prisma` === true or `prisma` === undefined but a prisma.yml file is found
  // Use all the defaults
  if (input === undefined && hasPrisma) {
    input = {}
  }

  const importedDatamodelInfo = datamodelInfo(
    projectDir,
    input!.datamodelInfoPath,
  )
  const importedClient = client(
    projectDir,
    input!.client,
    importedDatamodelInfo,
  )

  return {
    datamodelInfo: importedDatamodelInfo,
    client: importedClient,
  }
}
