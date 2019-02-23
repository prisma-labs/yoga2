import { existsSync, writeFileSync } from 'fs'
import { EOL } from 'os'
import * as path from 'path'
import * as ts from 'typescript'
import { findConfigFile, importYogaConfig } from '../../../config'
import { findFileByExtension } from '../../../helpers'
import { Config, ConfigWithInfo } from '../../../types'
import { DEFAULTS } from '../../../yogaDefaults'

const diagnosticHost: ts.FormatDiagnosticsHost = {
  getNewLine: () => ts.sys.newLine,
  getCurrentDirectory: () => process.cwd(),
  getCanonicalFileName: path => path,
}

export default () => {
  const info = importYogaConfig()
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
  const config = fixConfig(inputConfig, info.projectDir)
  const rootNames = getRootNames(info)

  compile(rootNames, config.options)

  if (!info.yogaConfig.ejectFilePath) {
    const ejectFilePath = path.join(
      info.projectDir,
      path.dirname(DEFAULTS.ejectFilePath!),
      'index.ts',
    )

    writeEntryPoint(info, ejectFilePath!, config)
  } else {
    useEntryPoint(info, info.yogaConfig.ejectFilePath, config)
  }
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

function getRootNames(info: ConfigWithInfo) {
  const rootNames = findFileByExtension(info.yogaConfig.resolversPath, '.ts')

  if (info.yogaConfig.contextPath) {
    rootNames.push(info.yogaConfig.contextPath)
  }

  if (info.yogaConfig.ejectFilePath) {
    rootNames.push(info.yogaConfig.ejectFilePath)
  }

  if (info.yogaConfig.prisma) {
    rootNames.push(...findFileByExtension(info.prismaClientDir!, '.ts'))
    rootNames.push(...findFileByExtension(info.datamodelInfoDir!, '.ts'))
  }

  return rootNames
}

/**
 * Do post-processing on config options to support `ts-node`.
 */
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

function useEntryPoint(
  info: ConfigWithInfo,
  ejectFilePath: string,
  config: ts.ParsedCommandLine,
) {
  const indexFile = `
  import yogaServer from '${getRelativePath(
    path.dirname(ejectFilePath),
    ejectFilePath,
  )}'

  const serverInstance = yogaServer.server(__dirname)

  yogaServer.startServer(serverInstance)
  `
  const indexFilePath = path.join(path.dirname(ejectFilePath), 'index.ts')

  outputFile(indexFile, indexFilePath, config.options, info)
}

function writeEntryPoint(
  info: ConfigWithInfo,
  ejectFilePath: string,
  config: ts.ParsedCommandLine,
) {
  const ejectFile = info.yogaConfig.prisma
    ? prismaIndexFile(path.dirname(ejectFilePath), info)
    : simpleIndexfile(path.dirname(ejectFilePath), info.yogaConfig)

  outputFile(ejectFile, ejectFilePath, config.options, info)

  const resolverIndexPath = path.join(info.yogaConfig.resolversPath, 'index.ts')

  if (!existsSync(resolverIndexPath)) {
    writeResolversIndexFile(info, resolverIndexPath, config)
  }
}

function prismaIndexFile(filePath: string, info: ConfigWithInfo) {
  return `
  import { ApolloServer, makePrismaSchema } from 'yoga'
  import datamodelInfo from '${getRelativePath(
    filePath,
    info.datamodelInfoDir!,
  )}'
  import { prisma } from '${getRelativePath(filePath, info.prismaClientDir!)}'
  ${
    info.yogaConfig.contextPath
      ? `import context from '${getRelativePath(
          filePath,
          info.yogaConfig.contextPath,
        )}'`
      : ''
  }
  import * as types from '${getRelativePath(
    filePath,
    info.yogaConfig.resolversPath,
  )}'

  const schema = makePrismaSchema({
    types,
    prisma: {
      datamodelInfo,
      client: prisma
    },
    outputs: false
  })

  new ApolloServer({
    schema,
    ${info.yogaConfig.contextPath ? 'context' : ''}
  }).listen().then(s => console.log(\`🚀  Server listening at \${s.url}\`))
  `
}

function simpleIndexfile(filePath: string, yogaConfig: Config) {
  return `\
import { ApolloServer, makeSchema } from 'yoga'
${
  yogaConfig.contextPath
    ? `import context from '${getRelativePath(
        filePath,
        yogaConfig.contextPath,
      )}'`
    : ''
}
import * as types from '${getRelativePath(filePath, yogaConfig.resolversPath)}'

const schema = makeSchema({
  types,
  outputs: false
})

new ApolloServer({
  schema,
  context,
}).listen().then(s => console.log(\`🚀  Server listening at \${s.url}\`)),
`
}

function writeResolversIndexFile(
  info: ConfigWithInfo,
  resolverIndexPath: string,
  config: ts.ParsedCommandLine,
) {
  const resolversFile = findFileByExtension(
    info.yogaConfig.resolversPath,
    '.ts',
  )
  const resolverIndexFile = `\
    ${resolversFile
      .map(
        filePath =>
          `export * from '${getRelativePath(
            info.yogaConfig.resolversPath,
            filePath,
          )}'`,
      )
      .join(EOL)}
    `
  outputFile(resolverIndexFile, resolverIndexPath, config.options, info)
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

export function getRelativePath(dir: string, filePath: string): string {
  let relativePath = path.relative(dir, filePath)

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
  fileContent: string,
  filePath: string,
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
