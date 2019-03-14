import * as inquirer from 'inquirer'
import * as meow from 'meow'
import { bootstrap, templateFromFlags } from './bootstrap'
import { initScaffold } from './scaffold'
import { defaultTemplate, Template, templatesNames } from './templates'

inquirer.registerPrompt('path', require('inquirer-path').PathPrompt)

const cli = meow(
  `
    create-yoga [dir]

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
  let template: Template = defaultTemplate
  let newOrExisting = null

  if (cli.flags['template']) {
    template = templateFromFlags(cli)
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
export async function createTemplate(): Promise<void> {
  return main(cli)
}
