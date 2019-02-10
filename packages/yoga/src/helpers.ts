import * as fs from 'fs'
import { tmpdir } from 'os'
import * as path from 'path'
import * as ts from 'typescript'

/**
 * Find all files recursively in a directory based on an extension
 */
export function findFileByExtension(
  base: string,
  ext: string,
  files?: string[],
  result?: string[],
) {
  files = files || fs.readdirSync(base)
  result = result || []

  files.forEach(file => {
    const newbase = path.join(base, file)

    if (fs.statSync(newbase).isDirectory()) {
      result = findFileByExtension(
        newbase,
        ext,
        fs.readdirSync(newbase),
        result,
      )
    } else {
      if (path.extname(file) === ext) {
        result!.push(newbase)
      }
    }
  })
  return result
}

/**
 * Returns the path to a transpiled file
 */
export function getTranspiledPath(
  projectDir: string,
  filePath: string,
  outDir: string,
) {
  const pathFromRootToFile = path.relative(projectDir, filePath)
  const jsFileName = path.basename(pathFromRootToFile, '.ts') + '.js'
  const pathToJsFile = `${path.dirname(pathFromRootToFile)}/${jsFileName}`

  return path.join(outDir, pathToJsFile)
}

/**
 * Un-cache a module and import it
 */
export function importUncached(mod: string): Promise<any> {
  delete require.cache[require.resolve(mod)]

  return import(mod)
}

/**
 * Transpile a single file and return the default exported item
 */
export async function transpileAndImportDefault<T>(
  projectDir: string,
  filePath: string,
): Promise<T> {
  const outDir = tmpdir()

  ts.createProgram([filePath], {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES5,
    outDir,
    noEmitOnError: false,
  }).emit()

  const config = await importUncached(
    getTranspiledPath(projectDir, filePath, outDir),
  )

  if (!config.default) {
    throw new Error(`\`${filePath}\` must have default export`)
  }

  return config.default
}
