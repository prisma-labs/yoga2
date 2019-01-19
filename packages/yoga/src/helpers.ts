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
