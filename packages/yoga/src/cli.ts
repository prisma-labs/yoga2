#!/usr/bin/env node
import * as yargs from 'yargs'
import { watch } from './server'

function run() {
  yargs
    .usage('Usage: yoga [cmd] (start/build/dev)')
    .command(
      ['dev', '$0'],
      'Start the server in dev mode',
      // @ts-ignore
      () => {},
      () => watch(),
    )
    .alias('v', 'version')
    .describe('v', 'Print the version of yoga')
    .version()
    .strict().argv
}

// Only call run when running from CLI, not when included for tests
if (require.main === module) {
  run()
}
