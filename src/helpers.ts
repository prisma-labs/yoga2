import * as fs from 'fs'
import * as path from 'path'
import decache from 'decache'
import * as prettier from 'prettier'

/**
 * Find all files recursively in a directory based on an extension
 */
export function findFileByExtension(
  basePath: string,
  ext: string,
  files?: string[],
  result?: string[],
): string[] {
  files = files || fs.readdirSync(basePath)
  result = result || []

  files.forEach(file => {
    const newbase = path.join(basePath, file)

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
 * Un-cache a module and import it
 */
export function importUncached<T extends any = any>(
  mod: string,
  invalidateModule: boolean = false,
): T {
  if (invalidateModule) {
    decache(mod)
  } else {
    delete require.cache[require.resolve(mod)]
  }

  return require(mod)
}

/**
 * Import a file (transpiled on-the-fly thanks to ts-node)
 */
export function importFile<T extends any = any>(
  filePath: string,
  exportName?: string,
  invalidateModule: boolean = false,
): T {
  const importedModule = importUncached<T>(filePath, invalidateModule)

  if (exportName && importedModule[exportName] === undefined) {
    throw new Error(`\`${filePath}\` must have a '${exportName}' export`)
  }

  return exportName ? importedModule[exportName] : importedModule
}

export async function resolvePrettierOptions(
  path: string,
): Promise<prettier.Options> {
  const options = (await prettier.resolveConfig(path)) || {}

  return options
}

export function prettify(
  code: string,
  options: prettier.Options = {},
  parser: prettier.BuiltInParserName = 'typescript',
) {
  try {
    return prettier.format(code, {
      ...options,
      parser,
    })
  } catch (e) {
    console.log(
      `There is a syntax error in generated code, unformatted code printed, error: ${JSON.stringify(
        e,
      )}`,
    )
    return code
  }
}
export function prettyPath(filePath: string): string{
  return(path.relative(process.cwd(), filePath))
}
