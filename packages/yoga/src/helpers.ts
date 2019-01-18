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

export function relativeToProjectDir(projectDir: string, filePath: string) {
  return path.join(projectDir, filePath)
}

export function relativeOrDefault(
  projectDir: string,
  filePath: string | undefined,
  defaultRelativePath: string,
  propertyName: string,
  optionalField: boolean = false,
): string | undefined {
  const actualFilePath = filePath ? filePath : defaultRelativePath
  const relativePath = relativeToProjectDir(projectDir, actualFilePath)
  const fileExists = fs.existsSync(relativePath)

  if (!fileExists && !optionalField) {
    throw new Error(
      `Could not find a file for \`${propertyName}\` at ${relativePath}`,
    )
  }

  if (!fileExists && optionalField) {
    return undefined
  }

  return relativePath
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
 * Find a prisma.yml file if it exists
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
