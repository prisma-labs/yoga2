import { existsSync } from 'fs'
import { join } from 'path'
import { findPrismaConfigFile } from './helpers'
import { Config, PrismaInputConfig, OutputInputConfig } from './types'

const DEFAULTS: Config = {
  contextPath: './src/context.ts',
  resolversPath: './src/graphql/',
  ejectFilePath: './src/index.ts',
  output: {
    typegenPath: './src/generated/nexus.ts',
    schemaPath: './src/generated/nexus.graphql',
    buildPath: './dist',
  },
  prisma: {
    prismaClientPath: './src/generated/prisma-client/index.ts',
    schemaPath: './src/generated/prisma.graphql',
    contextClientName: 'prisma',
  },
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

export function contextPath(
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

export function resolversPath(
  projectDir: string,
  input: string | undefined,
): string {
  const path = inputOrDefaultPath(projectDir, input, DEFAULTS.resolversPath)

  return requiredPath(path, `Could not find a valid \`resolversPath\` at ${path}`)
}

export function ejectFilePath(
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

export function output(
  projectDir: string,
  input: OutputInputConfig | undefined,
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
  const buildPath = inputOrDefaultPath(
    projectDir,
    outDir,
    DEFAULTS.output.buildPath,
  )

  return {
    typegenPath,
    schemaPath,
    buildPath,
  }
}

export function prisma(
  projectDir: string,
  input: PrismaInputConfig | undefined,
) {
  const hasPrisma = !!findPrismaConfigFile(projectDir)

  // If `prisma` undefined and no prisma.yml file, prisma isn't used
  if (input === undefined && !hasPrisma) {
    return undefined
  }

  // If `prisma` === true or `prisma` === undefined but a prisma.yml file is found
  // Use all the defaults
  if (input === true || (input === undefined && hasPrisma)) {
    input = {}
  }

  const prismaClientPath = inputOrDefaultPath(
    projectDir,
    input!.prismaClientPath,
    DEFAULTS.prisma!.prismaClientPath,
  )
  const schemaPath = inputOrDefaultPath(
    projectDir,
    input!.schemaPath,
    DEFAULTS.prisma!.schemaPath,
  )
  const contextClientName = inputOrDefaultValue(
    input!.contextClientName,
    DEFAULTS.prisma!.contextClientName,
  )

  return {
    prismaClientPath: requiredPath(
      prismaClientPath,
      `Could not find a valid \`prisma.prismaClientPath\` at ${prismaClientPath}`,
    ),
    schemaPath: requiredPath(
      schemaPath,
      `Could not find a valid \`prisma.schemaPath\` at ${schemaPath}`,
    ),
    contextClientName,
  }
}
