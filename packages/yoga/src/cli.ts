#!/usr/bin/env node
import * as yargs from 'yargs'
import { watch } from './server'

function run() {
  yargs
    .usage('Usage: yoga [cmd] (start/build/dev)')
    // @ts-ignore
    .command('start', 'Start the server', () => {}, () => watch())
    .alias('v', 'version')
    .describe('v', 'Print the version of graphqlgen')
    .version()
    .strict().argv
}

// Only call run when running from CLI, not when included for tests
if (require.main === module) {
  run()
}
