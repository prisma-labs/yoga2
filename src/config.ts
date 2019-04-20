import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { importFile } from './helpers';
import { Config, ConfigWithInfo, InputConfig } from './types';
import { DEFAULT_META_SCHEMA_DIR, normalizeConfig } from './yogaDefaults';

/**
 * Find a `prisma.yml` file if it exists
 */
export function findPrismaConfigFile(projectDir: string): string | null {
  let definitionPath = path.join(projectDir, 'prisma.yml')

  if (fs.existsSync(definitionPath)) {
    return definitionPath
  }

  definitionPath = path.join(process.cwd(), 'prisma', 'prisma.yml')

  if (fs.existsSync(definitionPath)) {
    return definitionPath
  }

  return null
}

export function findConfigFile(
  fileName: string,
  opts: { required: true },
): string
export function findConfigFile(
  fileName: string,
  opts: { required: false },
): string | undefined
/**
 * Find a config file
 */
export function findConfigFile(fileName: string, opts: { required: boolean }) {
  const configPath = ts.findConfigFile(
    /*searchPath*/ process.cwd(),
    ts.sys.fileExists,
    fileName,
  )

  if (!configPath) {
    if (opts.required === true) {
      throw new Error(`Could not find a valid '${fileName}'.`)
    } else {
      return undefined
    }
  }

  return configPath
}

function findYogaConfigFile() {
  const nodeEnv = process.env.NODE_ENV || 'dev'
  let filePath = findConfigFile(`yoga.config.${nodeEnv}.ts`, {
    required: false,
  })

  if (!filePath) {
    filePath = findConfigFile('yoga.config.ts', { required: false })
  }

  return filePath
}

export function injectCustomEnvironmentVariables(env?: string) {
  const nodeEnv = env || process.env.NODE_ENV

  dotenv.config({
    path: path.join(process.cwd(), nodeEnv ? `.env.${nodeEnv}` : '.env'),
  })
}

function getDatamodelInfoDir(
  yogaConfig: Config,
  inputConfig: InputConfig,
  projectDir: string,
): string | undefined {
  if (!yogaConfig.prisma) {
    return undefined
  }

  if (inputConfig.prisma && inputConfig.prisma.datamodelInfoPath) {
    return path.join(projectDir, inputConfig.prisma.datamodelInfoPath)
  }

  return path.join(projectDir, DEFAULT_META_SCHEMA_DIR)
}

function getPrismaClientDir(
  yogaConfig: Config,
  projectDir: string,
): string | undefined {
  if (!yogaConfig.prisma) {
    return undefined
  }

  if (!yogaConfig.prisma.datamodelInfo.clientPath) {
    throw new Error(
      'Missing `clientPath` in generated `datamodelInfo`. Make sure to re-run nexus-prisma-generate@>=0.3.2',
    )
  }

  return path.join(projectDir, yogaConfig.prisma.datamodelInfo.clientPath)
}

/**
 * Dynamically imports a `yoga.config.ts` file
 */
export function importYogaConfig(
  opts: { invalidate?: boolean; env?: string } = {
    invalidate: false,
    env: undefined,
  },
): ConfigWithInfo {
  injectCustomEnvironmentVariables(opts.env)
  const yogaConfigPath = findYogaConfigFile()
  const defaultProjectDir = findConfigFile('package.json', { required: true })
  const projectDir = path.dirname(
    yogaConfigPath
      ? yogaConfigPath
      : defaultProjectDir,
  )
  const inputConfig = yogaConfigPath
    ? importFile<InputConfig>(yogaConfigPath, 'default', opts.invalidate)
    : {}
  const yogaConfig = normalizeConfig(inputConfig, projectDir)

  return {
    yogaConfig,
    yogaConfigPath,
    inputConfig,
    projectDir,
    datamodelInfoDir: getDatamodelInfoDir(yogaConfig, inputConfig, projectDir),
    prismaClientDir: getPrismaClientDir(yogaConfig, projectDir),
  }
}
