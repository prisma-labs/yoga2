import * as fs from 'fs'
import * as inquirer from 'inquirer'
import * as meow from 'meow'
import * as path from 'path'
import { loadYogaStarter } from './loader'
import { availableTemplates, Template, templatesNames } from './templates'
import { error } from '../../../logger';

export function templateFromFlags(cli: meow.Result): Template | void {
  const selectedTemplate = availableTemplates.find(
    t => t.name === cli.flags['template'],
  )

  if (selectedTemplate) {
    return selectedTemplate
  } else {
    console.log(`Unknown template. Available templates: ${templatesNames}`)
    return 
  }
}

async function askTemplate(): Promise<Template | void> {
  const { templateName } = await inquirer.prompt<{ templateName: string }>([
    {
      name: 'templateName',
      message: 'Choose a GraphQL server template?',
      type: 'list',
      choices: availableTemplates.map(t => ({
        name: `${t.name} (${t.description})`,
        value: t.name,
      })),
    },
  ])

  return availableTemplates.find(t => t.name === templateName)
}

export async function bootstrap(
  cli: meow.Result,
  template: Template | void,
) {
  if (!template) {
    template = await askTemplate()
    if(!template) return error("Selected Template Not Found")
  }

  let output = cli.input[1]

  if (!output) {
    const res = await inquirer.prompt<{ path: string }>([
      {
        name: 'path',
        type: 'path',
        message:
          'Where should we scaffold your GraphQL server? (autocomplete with Tab)',
        default: '.',
      },
    ])
    output = res.path
  }

  if (fs.existsSync(output)) {
    const allowedFiles = ['.git', '.gitignore']
    const conflictingFiles = fs
      .readdirSync(output)
      .filter(f => !allowedFiles.includes(f))

    if (conflictingFiles.length > 0 && !cli.flags.force) {
      console.log(`Directory ${output} must be empty.`)
      return
    }
  } else {
    fs.mkdirSync(output)
  }

  return loadYogaStarter(template, path.resolve(output), {
    installDependencies: !cli.flags['no-install'],
  })
}
