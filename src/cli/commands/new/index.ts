import * as inquirer from 'inquirer'
import meow from 'meow';
import { bootstrap, templateFromFlags } from './bootstrap'
import { initScaffold } from './scaffold'
import { Template, templatesNames } from './templates'
import chalk from 'chalk';

inquirer.registerPrompt('path', require('inquirer-path').PathPrompt)

const cli = meow(
  `
    yoga new [dir]

    > Scaffolds the initial files of your project.

    Options:
      -t, --template  Select a template. (${templatesNames})
      --no-install    Skips dependency installation.
      --force (-f)    Overwrites existing files.
`,
  {
    flags: {
      'no-install': {
        type: 'boolean',
        default: false,
      },
      template: {
        type: 'string',
        alias: 't',
        default: false,
      },
      force: {
        type: 'boolean',
        default: false,
        alias: 'f',
      },
    },
  },
)

// Main
async function main(cli: meow.Result): Promise<void> {
  let template: Template | void = undefined
  let newOrExisting = null

  if (cli.flags['template']) {
    template = templateFromFlags(cli)

    template && console.log(chalk.red("Error Template Not Found"))
  } else {
    const result = await inquirer.prompt<{
      newOrExisting: 'new' | 'database'
    }>([
      {
        name: 'newOrExisting',
        message: 'Start from scratch or from an existing database?',
        type: 'list',
        choices: [
          { name: 'Start from scratch', value: 'new' },
          { name: 'Start from an existing database', value: 'database' },
        ],
      },
    ])

    newOrExisting = result.newOrExisting
  }

  if (newOrExisting === 'new') {
    return bootstrap(cli, template)
  } else {
    return initScaffold()
  }
}

/**
 * Imports one of the preconfigured yoga templates
 */
async function createTemplate(): Promise<void> {
  return main(cli)
}
export default createTemplate