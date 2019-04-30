// Modified `decache` package
const path = require('path') // if module is locally defined we path.resolve it
const callsite = require('callsite')

const find = function(moduleName: string) {
  if (moduleName[0] === '.') {
    const stack = callsite()
    for (let i in stack) {
      const filename = stack[i].getFileName()
      if (filename !== module.filename) {
        moduleName = path.resolve(path.dirname(filename), moduleName)
        break
      }
    }
  }
  try {
    return require.resolve(moduleName)
  } catch (e) {
    return
  }
}

/**
 * Removes a module from the cache. We need this to re-load our http_request !
 * see: http://stackoverflow.com/a/14801711/1148249
 */
const decache = function(moduleName: string) {
  const foundModuleName = find(moduleName)

  if (!foundModuleName) {
    return
  } else {
    moduleName = foundModuleName
  }

  // Run over the cache looking for the files
  // loaded by the specified module name
  searchCache(moduleName, function(mod: NodeModule) {
    delete require.cache[mod.id]
  })

  // Remove cached paths to the module.
  // Thanks to @bentael for pointing this out.
  Object.keys((module.constructor as any)._pathCache).forEach(function(
    cacheKey,
  ) {
    if (cacheKey.indexOf(moduleName) > -1) {
      delete (module.constructor as any)._pathCache[cacheKey]
    }
  })
}

/**
 * Runs over the cache to search for all the cached
 * files
 */
const searchCache = function(moduleName: string, callback: any) {
  // Resolve the module identified by the specified name
  let mod: any = require.resolve(moduleName)
  let visited: Record<string, boolean> = {}

  // Check if the module has been resolved and found within
  // the cache no else so #ignore else http://git.io/vtgMI
  if (mod && (mod = require.cache[mod]) !== undefined) {
    // Recursively go over the results
    ;(function run(current: NodeModule) {
      visited[current.id] = true
      // Go over each of the module's children and
      // run over it
      current.children.forEach(function(child) {
        // ignore .node files, decachine native modules throws a
        // "module did not self-register" error on second require
        if (
          path.extname(child.filename) !== '.node' &&
          !child.filename.includes('/node_modules/') &&
          !visited[child.id]
        ) {
          run(child)
        }
      })

      // Call the specified callback providing the
      // found module
      callback(current)
    })(mod)
  }
}

export { decache }
