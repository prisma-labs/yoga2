import * as path from 'path'
import * as fs from 'fs'
import * as ts from 'typescript'
import { Config } from './types'
import { normalizeConfig } from './yogaDefaults'
import { importUncached } from './helpers'
import { tmpdir } from 'os'

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

/**
 * Find `tsconfig.json` file
 */
export function findTsConfigPath(): string {
  const tsConfigPath = ts.findConfigFile(
    /*searchPath*/ process.cwd(),
    ts.sys.fileExists,
    'tsconfig.json',
  )

  if (!tsConfigPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.")
  }

  return tsConfigPath
}

/**
 * Parse a `tsconfig.json` file
 * @param tsConfigPath Path to a `tsconfig.json` file
 */
export function parseTsConfig(tsConfigPath: string): ts.ParsedCommandLine {
  const projectDir = path.dirname(tsConfigPath)
  const tsConfig = ts.parseJsonConfigFileContent(
    require(tsConfigPath),
    ts.sys,
    projectDir,
  )

  if (!tsConfig.options.rootDir || !tsConfig.options.outDir) {
    throw new Error(
      "You must define a `rootDir` and `outDir` property in your 'tsconfig.json' file",
    )
  }

  return tsConfig
}

/**
 * Dynamically import a `yoga.config.ts` file
 */
export async function importYogaConfig(): Promise<{
  yogaConfigPath?: string
  yogaConfig: Config
  projectDir: string
  rootDir: string
}> {
  const tsConfigPath = findTsConfigPath()
  const tsConfig = parseTsConfig(tsConfigPath)
  const yogaConfigOutDir = tmpdir() // Compile the config file in a tmp dir
  const projectDir = path.dirname(tsConfigPath)
  const rootDir = tsConfig.options.rootDir!

  const yogaConfigPath = ts.findConfigFile(
    /*searchPath*/ process.cwd(),
    ts.sys.fileExists,
    'yoga.config.ts',
  )

  // If no config file, just use all defaults
  if (!yogaConfigPath) {
    return {
      yogaConfig: normalizeConfig({}, projectDir, tsConfig.options.outDir),
      projectDir,
      rootDir,
    }
  }

  ts.createProgram([yogaConfigPath], {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES5,
    outDir: yogaConfigOutDir,
  }).emit()

  const config = await importUncached(
    path.join(yogaConfigOutDir, 'yoga.config.js'),
  )

  if (!config.default) {
    throw new Error('`yoga.config.ts` must default export an object')
  }

  const yogaConfig = normalizeConfig(
    config.default,
    projectDir,
    tsConfig.options.outDir!,
  )

  return {
    yogaConfig,
    yogaConfigPath,
    projectDir,
    rootDir,
  }
}
