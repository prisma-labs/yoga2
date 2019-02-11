import { existsSync } from 'fs'
import { PrismaClientInput } from 'nexus-prisma/dist/types'
import { join } from 'path'
import { findPrismaConfigFile } from './config'
import { transpileAndImportDefault as transpileAndImport } from './helpers'
import {
  Config,
  InputConfig,
  InputOutputFilesConfig,
  InputPrismaConfig,
  NexusPrismaSchema,
} from './types'

const DEFAULTS: Config = {
  contextPath: './src/context.ts',
  resolversPath: './src/graphql/',
  ejectFilePath: './src/index.ts',
  output: {
    typegenPath: './yoga/nexus.ts',
    schemaPath: './src/schema.graphql',
    buildPath: './dist',
  },
  prisma: {
    /**
     * Do not use that as a default value, this is just a placeholder
     * When `metaSchema` isn't provided, we're importing it from `DEFAULT_NEXUS_PRISMA_SCHEMA_PATH` defined below
     */
    metaSchema: { schema: { __schema: null }, uniqueFieldsByModel: {} },
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

const DEFAULT_NEXUS_PRISMA_SCHEMA_PATH = './yoga/nexus-prisma/index.ts'
const DEFAULT_PRISMA_CLIENT_PATH = './yoga/prisma-client/index.ts'

/**
 * - Compute paths relative to the root of the project
 * - Set defaults when needed
 */
export async function normalizeConfig(
  config: InputConfig,
  projectDir: string,
  outDir: string | undefined,
): Promise<Config> {
  const outputProperty = output(projectDir, config.output, outDir)
  const outputConfig: Config = {
    contextPath: contextPath(projectDir, config.contextPath),
    resolversPath: resolversPath(projectDir, config.resolversPath),
    ejectFilePath: ejectFilePath(projectDir, config.ejectFilePath),
    output: outputProperty,
    prisma: await prisma(projectDir, config.prisma, outputProperty.buildPath),
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

async function inputOrImportAtDefaultPath(opts: {
  projectDir: string
  outDir: string
  files: {
    input: any | undefined
    defaultPath: string
    errorMessage: string
    exportName: string
  }[]
}): Promise<any[]> {
  const existingInputs = opts.files
    .filter(file => file.input !== undefined)
    .map(file => file.input)
  const filesToTranspile = opts.files.filter(file => file.input === undefined)

  const importedFiles = await transpileAndImport(
    filesToTranspile.map(f => ({
      filePath: requiredPath(f.defaultPath, f.errorMessage),
      exportName: f.exportName,
    })),
    opts.projectDir,
    opts.outDir,
  )

  return [...importedFiles, ...existingInputs]
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
  outDir: string | undefined,
): {
  typegenPath: string
  schemaPath: string
  buildPath: string
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
  /**
   * `outDir` is inputted from `tsconfig.json` It should therefore not be joined with `projectDir`
   * as typescript already resolve the path when parsing it
   */
  const buildPath = inputOrDefaultValue(
    outDir,
    join(projectDir, DEFAULTS.output.buildPath),
  )

  return {
    typegenPath,
    schemaPath,
    buildPath,
  }
}

async function prisma(
  projectDir: string,
  input: InputPrismaConfig | undefined,
  outDir: string,
): Promise<
  | {
      metaSchema: NexusPrismaSchema
      client: PrismaClientInput
    }
  | undefined
> {
  const hasPrisma = !!findPrismaConfigFile(projectDir)

  // If `prisma` undefined and no prisma.yml file, prisma isn't used
  if (input === undefined && !hasPrisma) {
    return Promise.resolve(undefined)
  }

  // If `prisma` === true or `prisma` === undefined but a prisma.yml file is found
  // Use all the defaults
  if (input === true || (input === undefined && hasPrisma)) {
    input = {}
  }

  const [metaSchema, client] = await inputOrImportAtDefaultPath({
    files: [
      {
        input: input!.metaSchema,
        defaultPath: DEFAULT_NEXUS_PRISMA_SCHEMA_PATH,
        errorMessage: `Could not find a valid \`prisma.metaSchema\` at ${DEFAULT_NEXUS_PRISMA_SCHEMA_PATH}`,
        exportName: 'default',
      },
      {
        input: input!.client,
        defaultPath: DEFAULT_PRISMA_CLIENT_PATH,
        errorMessage: `Could not find a valid \`prisma.client\` at ${DEFAULT_PRISMA_CLIENT_PATH}`,
        exportName: 'prisma',
      },
    ],
    outDir,
    projectDir,
  })

  return {
    metaSchema: metaSchema as NexusPrismaSchema,
    client: client as PrismaClientInput,
  }
}
