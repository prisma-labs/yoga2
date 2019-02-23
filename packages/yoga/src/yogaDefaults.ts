import { existsSync } from 'fs'
import { PrismaClientInput } from 'nexus-prisma/dist/types'
import { join } from 'path'
import { findPrismaConfigFile } from './config'
import { importFile } from './helpers'
import {
  Config,
  DatamodelInfo,
  InputConfig,
  InputOutputFilesConfig,
  InputPrismaConfig,
} from './types'

export const DEFAULTS: Config = {
  contextPath: './src/context.ts',
  resolversPath: './src/graphql/',
  ejectFilePath: './src/server.ts',
  output: {
    typegenPath: './.yoga/nexus.ts',
    schemaPath: './src/schema.graphql',
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
    },
    /**
     * Do not use that as a default value, this is just a placeholder
     * When `client` isn't provided, we're importing it from `DEFAULT_NEXUS_PRISMA_SCHEMA_PATH` defined below
     */
    client: {
      $exists: null,
      $graphql: null as any, // FIXME
    },
  },
}

export const DEFAULT_META_SCHEMA_DIR = './.yoga/nexus-prisma/'

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
    ejectFilePath: ejectFilePath(projectDir, config.ejectFilePath),
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
      throw new Error(errorMessage)
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
    throw new Error(errorMessage)
  }

  return path
}

function contextPath(
  projectDir: string,
  input: string | undefined,
): string | undefined {
  const path = inputOrDefaultPath(projectDir, input, DEFAULTS.contextPath!)

  return optional(
    path,
    input,
    `Could not find a valid \`contextPath\` at ${path}`,
  )
}

function resolversPath(projectDir: string, input: string | undefined): string {
  const path = inputOrDefaultPath(projectDir, input, DEFAULTS.resolversPath)

  return requiredPath(
    path,
    `Could not find a valid \`resolversPath\` at ${path}`,
  )
}

function ejectFilePath(
  projectDir: string,
  input: string | undefined,
): string | undefined {
  const path = inputOrDefaultPath(projectDir, input, DEFAULTS.ejectFilePath!)

  return optional(
    path,
    input,
    `Could not find a valid \`ejectFilePath\` at ${path}`,
  )
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
      join(projectDir, datamodelInfo.clientPath),
      `Could not find a valid \`prisma.client\` at ${datamodelInfo.clientPath}`,
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
      `Could not find a valid \`prisma.datamodelInfoPath\ at ${datamodelInfoPath}`,
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
