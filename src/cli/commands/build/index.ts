import { existsSync, writeFileSync } from 'fs'
import * as path from 'path'
import * as ts from 'typescript'
import { findConfigFile, importYogaConfig } from '../../../config'
import { ConfigWithInfo } from '../../../types'
import { DEFAULTS } from '../../../yogaDefaults'
import {
  renderIndexFile,
  renderPrismaEjectFile,
  renderSimpleIndexFile,
  renderResolversIndex,
} from './renderers'

const diagnosticHost: ts.FormatDiagnosticsHost = {
  getNewLine: () => ts.sys.newLine,
  getCurrentDirectory: () => process.cwd(),
  getCanonicalFileName: path => path,
}

export default (argv: Record<string, string>) => {
  const info = importYogaConfig({ env: argv.env })
  const config = readConfigFromTsConfig(info)

  compile(config.fileNames, config.options)

  const ejectedFilePath = writeEjectFiles(info, (filePath, content) => {
    outputFile(filePath, content, config.options, info)
  })

  useEntryPoint(info, ejectedFilePath, config)
}

function compile(rootNames: string[], options: ts.CompilerOptions) {
  const program = ts.createProgram({
    rootNames,
    options,
  })
  const emitResult = program.emit()
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics)

  if (allDiagnostics.length > 0) {
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext(allDiagnostics, diagnosticHost),
    )
  }
}

function useEntryPoint(
  info: ConfigWithInfo,
  ejectedFilePath: string,
  config: ts.ParsedCommandLine,
) {
  const indexFile = renderIndexFile(ejectedFilePath)
  const indexFilePath = path.join(path.dirname(ejectedFilePath), 'index.ts')

  outputFile(indexFilePath, indexFile, config.options, info)
}

export function writeEjectFiles(
  config: ConfigWithInfo,
  writeFile: (filePath: string, content: string) => void,
) {
  if (config.yogaConfig.ejectedFilePath) {
    return config.yogaConfig.ejectedFilePath
  }

  const ejectedFilePath = path.join(
    config.projectDir,
    DEFAULTS.ejectedFilePath!,
  )
  const ejectFile = config.yogaConfig.prisma
    ? renderPrismaEjectFile(ejectedFilePath, config)
    : renderSimpleIndexFile(ejectedFilePath, config)

  writeFile(ejectedFilePath, ejectFile)

  const resolverIndexPath = path.join(
    config.yogaConfig.resolversPath || '',
    'index.ts',
  )

  if (!existsSync(resolverIndexPath)) {
    const resolverIndexFile = renderResolversIndex(config)

    resolverIndexFile && writeFile(resolverIndexPath, resolverIndexFile)
  }

  return ejectedFilePath
}

export function getTranspiledPath(
  projectDir: string,
  filePath: string,
  outDir: string,
) {
  const pathFromRootToFile = path.relative(projectDir, filePath)
  const jsFileName = path.basename(pathFromRootToFile, '.ts') + '.js'
  const pathToJsFile = path.join(path.dirname(pathFromRootToFile), jsFileName)

  return path.join(outDir, pathToJsFile)
}

export function getRelativePath(sourceDir: string, targetPath: string): string {
  let relativePath = path.relative(sourceDir, targetPath)

  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath
  }

  // remove .ts or .js file extension
  relativePath = relativePath.replace(/\.(ts|js)$/, '')

  // remove /index
  relativePath = relativePath.replace(/\/index$/, '')

  // replace \ with /
  relativePath = relativePath.replace(/\\/g, '/')

  return relativePath
}

function transpileModule(
  input: string,
  compilerOptions: ts.CompilerOptions,
): string {
  return ts.transpileModule(input, { compilerOptions }).outputText
}

function outputFile(
  filePath: string,
  fileContent: string,
  compilerOptions: ts.CompilerOptions,
  info: ConfigWithInfo,
) {
  const transpiled = transpileModule(fileContent, compilerOptions)
  const outFilePath = getTranspiledPath(
    info.projectDir,
    filePath,
    compilerOptions.outDir!,
  )

  writeFileSync(outFilePath, transpiled)
}

function fixConfig(config: ts.ParsedCommandLine, projectDir: string) {
  // Target ES5 output by default (instead of ES3).
  if (config.options.target === undefined) {
    config.options.target = ts.ScriptTarget.ES5
  }

  // Target CommonJS modules by default (instead of magically switching to ES6 when the target is ES6).
  if (config.options.module === undefined) {
    config.options.module = ts.ModuleKind.CommonJS
  }

  if (config.options.outDir === undefined) {
    config.options.outDir = 'dist'
  }

  config.options.rootDir = projectDir

  return config
}

export function readConfigFromTsConfig(info: ConfigWithInfo) {
  const tsConfigPath = findConfigFile('tsconfig.json', { required: true })
  const tsConfigContent = ts.readConfigFile(tsConfigPath, ts.sys.readFile)

  if (tsConfigContent.error) {
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext(
        [tsConfigContent.error],
        diagnosticHost,
      ),
    )
  }

  const inputConfig = ts.parseJsonConfigFileContent(
    tsConfigContent.config,
    ts.sys,
    info.projectDir,
    undefined,
    tsConfigPath,
  )
  return fixConfig(inputConfig, info.projectDir)
}
