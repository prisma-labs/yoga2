import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'
import { EOL } from 'os'
import decache from 'decache'

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
  const pathToJsFile = path.join(path.dirname(pathFromRootToFile), jsFileName)

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
export async function transpileAndImportDefault(
  files: { filePath: string; exportName: string }[],
  projectDir: string,
  outDir: string,
): Promise<any[]> {
  const resolvedFilesPath = files.map(file => {
    if (file.filePath.startsWith('/')) {
      return file.filePath
    }

    return path.join(projectDir, file.filePath)
  })

  ts.createProgram(resolvedFilesPath, {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES5,
    outDir,
    rootDir: projectDir, // /!\ rootDir is needed in order to keep to folder structure in outDir
  }).emit()

  const importedFiles = await Promise.all(
    files.map(file => {
      const transpiledPath = getTranspiledPath(
        projectDir,
        file.filePath,
        outDir,
      )

      // Invalidate cache and all dependencies of this file
      decache(transpiledPath)

      return import(transpiledPath)
    }),
  )

  const wrongImports = files.filter(
    (file, i) => importedFiles[i][file.exportName] === undefined,
  )

  if (wrongImports.length > 0) {
    const errorString = wrongImports
      .map(file => `\`${file.filePath}\` must have a ${file.exportName} export`)
      .join(EOL)

    throw new Error(errorString)
  }

  return files.map((file, i) => importedFiles[i][file.exportName])
}
