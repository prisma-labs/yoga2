#!/usr/bin/env node

import { createTemplate } from 'create-yoga'
import * as yargs from 'yargs'
import build from './commands/build'
import scaffold from './commands/scaffold'
import start from './commands/start'
import watch from './commands/watch'

function run() {
  yargs
    .usage('Usage: $0 <command> [options]')
    .command('new', 'Create new yoga project from template', {}, createTemplate)
    .command('start', 'Start the server', {}, start)
    .command('dev', 'Start the server in dev mode', {}, watch)
    .command('scaffold', 'Scaffold a new GraphQL type', {}, scaffold)
    .command('build', 'Build a yoga server', {}, build)
    .alias('h', 'help')
    .help('help')
    .showHelpOnFail(true, 'Specify --help for available options')
    .version().argv
}

// Only call run when running from CLI, not when included for tests
if (require.main === module) {
  run()
}
