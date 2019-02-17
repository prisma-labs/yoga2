import * as fs from 'fs'
import * as path from 'path'

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
export function importUncached<T extends any = any>(mod: string): T {
  delete require.cache[require.resolve(mod)]

  return require(mod)
}

/**
 * Import a file (transpiled on-the-fly thanks to ts-node)
 */
export function importFile<T extends any = any>(
  filePath: string,
  exportName: string,
): T {
  const importedModule = importUncached(filePath)

  if (importedModule[exportName] === undefined) {
    throw new Error(`\`${filePath}\` must have a '${exportName}' export`)
  }

  return importedModule[exportName]
}
