// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#writing-an-incremental-program-watcher
// Slightly modified version
import ts from 'typescript'

export function watch(
  configPath: string,
  optionsToExtend: ts.CompilerOptions,
  callback: () => void,
) {
  // TypeScript can use several different program creation "strategies":
  //  * ts.createEmitAndSemanticDiagnosticsBuilderProgram,
  //  * ts.createSemanticDiagnosticsBuilderProgram,
  //  * ts.createAbstractBuilder
  // The first two produce "builder programs". These use an incremental strategy
  // to only re-check and emit files whose contents may have changed, or whose
  // dependencies may have changes which may impact change the result of prior
  // type-check and emit.
  // The last uses an ordinary program which does a full type check after every
  // change.
  // Between `createEmitAndSemanticDiagnosticsBuilderProgram` and
  // `createSemanticDiagnosticsBuilderProgram`, the only difference is emit.
  // For pure type-checking scenarios, or when another tool/process handles emit,
  // using `createSemanticDiagnosticsBuilderProgram` may be more desirable.
  const createProgram = ts.createSemanticDiagnosticsBuilderProgram

  // Note that there is another overload for `createWatchCompilerHost` that takes
  // a set of root files.
  const host = ts.createWatchCompilerHost(
    configPath,
    optionsToExtend,
    ts.sys,
    createProgram,
    reportDiagnostic,
    () => {},
  )

  let firstStart = true

  // You can technically override any given hook on the host, though you probably
  // don't need to.
  // Note that we're assuming `origCreateProgram` and `origPostProgramCreate`
  // doesn't use `this` at all.
  const origCreateProgram = host.createProgram
  host.createProgram = (
    rootNames: ReadonlyArray<string> | undefined,
    options,
    host,
    oldProgram,
  ) => {
    if (firstStart) {
      console.log('** Starting ... **')
      firstStart = false
    } else {
      console.log('** Restarting ... **')
    }
    return origCreateProgram(rootNames, options, host, oldProgram)
  }
  const origPostProgramCreate = host.afterProgramCreate

  host.afterProgramCreate = program => {
    // console.log('** We finished making the program! **')
    origPostProgramCreate!(program)
    callback()
  }

  // `createWatchProgram` creates an initial program, watches files, and updates
  // the program over time.
  ts.createWatchProgram(host)
}

function reportDiagnostic(diagnostic: ts.Diagnostic) {
  if (diagnostic.file) {
    let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
      diagnostic.start!,
    )
    let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    console.error(
      `${diagnostic.file.fileName} (${line + 1},${character +
        1}):\n ${message}`,
    )
  } else {
    console.error(
      `${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`,
    )
  }
}
