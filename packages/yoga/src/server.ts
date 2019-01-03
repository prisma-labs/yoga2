#!/usr/bin/env node
import { ApolloServer } from 'apollo-server'
import * as fs from 'fs'
import { existsSync } from 'fs'
import { makeSchema } from 'nexus'
import { basename, extname, join } from 'path'
import ts from 'typescript'

export interface InputConfig {
  resolversPath?: string
  contextPath?: string
  output: {
    schemaPath: string
    typegenPath: string
    build?: string
  }
}

interface Config {
  resolversPath: string
  contextPath: string
  output: {
    schemaPath: string
    typegenPath: string
    build: string
  }
}

main()

async function main() {
  const inputConfigPath = relativeToCwd('yoga.config.ts')

  if (!existsSync(inputConfigPath)) {
    throw new Error('Missing yoga.config.ts file')
  }

  const inputConfig = (await import(inputConfigPath)).default.default
  const config = normalizeConfig(inputConfig)

  if (!existsSync(config.resolversPath)) {
    throw new Error('Missing /graphql folder')
  }

  const { types, context } = await importGraphqlTypesAndContext(
    config.resolversPath,
    config.contextPath,
    config.output.build,
  )

  const schema = makeSchema({
    types,
    outputs: {
      schema: config.output.schemaPath,
      typegen: config.output.typegenPath,
    },
  })

  const server = new ApolloServer({
    schema,
    context,
  })

  server.listen().then(({ url }) => console.log(`🚀  Server ready at ${url}`))
}

function normalizeConfig(config: InputConfig): Config {
  config.output.schemaPath = relativeToCwd(config.output.schemaPath)
  config.output.typegenPath = relativeToCwd(config.output.typegenPath)

  if (!config.resolversPath) {
    config.resolversPath = relativeToCwd('./src/graphql')
  } else {
    config.resolversPath = relativeToCwd(config.resolversPath)
  }

  if (!config.contextPath) {
    config.contextPath = relativeToCwd('./src/context.ts')
  } else {
    config.contextPath = relativeToCwd(config.contextPath)
  }

  if (config.output && !config.output.build) {
    config.output.build = relativeToCwd('./dist')
  }

  return config as Config
}

function relativeToCwd(path: string) {
  return join(process.cwd(), path)
}

function compile(fileNames: string[], options: ts.CompilerOptions): void {
  let program = ts.createProgram(fileNames, options)
  let emitResult = program.emit()

  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics)

  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start!,
      )
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n',
      )
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character +
          1}): ${message}`,
      )
    } else {
      console.log(
        `${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`,
      )
    }
  })
}

function findFileByExtension(
  base: string,
  ext: string,
  files?: string[],
  result?: string[],
) {
  files = files || fs.readdirSync(base)
  result = result || []

  files.forEach(file => {
    const newbase = join(base, file)

    if (fs.statSync(newbase).isDirectory()) {
      result = findFileByExtension(
        newbase,
        ext,
        fs.readdirSync(newbase),
        result,
      )
    } else {
      if (extname(file) === ext) {
        result!.push(newbase)
      }
    }
  })
  return result
}

async function importGraphqlTypesAndContext(
  typesDir: string,
  contextFile: string | undefined,
  outputDir: string,
): Promise<{ types: any[]; context?: any }> {
  const typesFiles: string[] = findFileByExtension(typesDir, '.ts')
  const filesToCompile =
    contextFile === undefined ? typesFiles : [...typesFiles, contextFile]

  compile(filesToCompile, {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES5,
    outDir: outputDir,
    noEmitOnError: true,
    lib: [
      'lib.es2015.d.ts',
      'lib.es2017.d.ts',
      'lib.esnext.d.ts',
      'lib.esnext.asynciterable.d.ts',
    ],
    skipLibCheck: true,
    sourceMap: false,
  })

  const transpiledTypes = typesFiles.map(file =>
    join(outputDir, 'graphql', `${basename(file, '.ts')}.js`),
  )

  let context = undefined

  if (contextFile !== undefined) {
    if (!existsSync(contextFile)) {
      throw new Error('')
    }

    const transpiledContextPath = join(
      outputDir,
      `${basename(contextFile, '.ts')}.js`,
    )

    context = await import(transpiledContextPath)

    if (context.default && typeof context.default === 'function') {
      context = context.default()
    } else {
      throw new Error('Context must be a default exported function')
    }
  }

  const types = await Promise.all(transpiledTypes.map(file => import(file)))

  return {
    context,
    types,
  }
}
