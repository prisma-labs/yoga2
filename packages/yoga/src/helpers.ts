import * as fs from 'fs'
import { extname, join } from 'path'

export function findFileByExtension(
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

export function relativeToRootPath(rootPath: string, path: string) {
  return join(rootPath, path)
}

export function invalidateImportCache(files: string[]) {
  files.forEach(id => {
    if (require.cache[id]) {
      delete require.cache[id]
    }
  })
}
