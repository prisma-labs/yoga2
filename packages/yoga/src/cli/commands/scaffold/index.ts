import * as fs from 'fs'
import * as inquirer from 'inquirer'
import yaml from 'js-yaml'
import * as path from 'path'
import pluralize from 'pluralize'
import { findPrismaConfigFile, importYogaConfig } from '../../../config'
import { Config } from '../../../types'
import { spawnAsync } from '../../spawnAsync'
import execa = require('execa')

export default async () => {
  const { yogaConfig, projectDir } = await importYogaConfig()
  const hasDb = !!yogaConfig.prisma
  const inputTypeQuestion: inquirer.Question<{ inputTypeName: string }> = {
    name: 'inputTypeName',
    message: 'Input the name of your type',
    type: 'input',
    validate(input: string) {
      if (input === undefined || input.length === 0) {
        return 'Type name should be at least one character'
      }

      if (!/^[_a-zA-Z][_a-zA-Z0-9]*$/.test(input)) {
        return `Type name must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but "${input}" does not`
      }

      return true
    },
  }

  let { inputTypeName } = await inquirer.prompt(inputTypeQuestion)

  const typeName = upperFirst(inputTypeName)

  if (hasDb) {
    let crudOperations: string[] | null = null
    const { datamodelPath, datamodelContent } = getPrismaDatamodel(projectDir)
    const relativeDatamodelPath = path.relative(projectDir, datamodelPath)

    while (isModelNameAlreadyDefined(inputTypeName, datamodelContent)) {
      const { inputTypeName: retry } = await inquirer.prompt([
        {
          ...inputTypeQuestion,
          message:
            'Type name already defined in your datamodel. Please try another one:',
        },
      ])

      inputTypeName = retry
    }

    const { exposeCrudOps } = await inquirer.prompt<{ exposeCrudOps: boolean }>(
      [
        {
          name: 'exposeCrudOps',
          message: 'Do you want to expose CRUD operations ?',
          type: 'confirm',
        },
      ],
    )

    if (exposeCrudOps) {
      const { operations } = await inquirer.prompt<{ operations: string[] }>([
        {
          name: 'operations',
          message: 'Select the operations you would like to expose',
          type: 'checkbox',
          choices: [
            new inquirer.Separator('Queries'),
            `Query.${typeName.toLowerCase()}`,
            `Query.${pluralize(typeName.toLowerCase())}`,
            new inquirer.Separator('Mutations'),
            `Mutation.create${typeName}`,
            `Mutation.delete${typeName}`,
            `Mutation.update${typeName}`,
          ],
        },
      ])

      crudOperations = operations
    }

    updateDatamodel(datamodelPath, typeName)

    console.log(`
We have added a type '${inputTypeName}' in your \`${relativeDatamodelPath}\` file !

Before we continue, please do the following steps:

1. Go to your \`${relativeDatamodelPath}\` file
2. Add the desired fields to your model
3. Confirm with Y once you're done, we'll run \`prisma deploy\` for you
`)

    const { allStepsDone } = await inquirer.prompt<{ allStepsDone: boolean }>([
      {
        name: 'allStepsDone',
        message: 'Did you go through all the steps ?',
        type: 'confirm',
      },
    ])

    if (allStepsDone) {
      await runPrismaDeploy()

      const filePath = scaffoldType(yogaConfig, typeName, hasDb, crudOperations)
      const relativePath = path.relative(projectDir, filePath)

      console.log(`
Scaffolding of ${relativePath} succesfuly done !
  
A few more optional steps:
  
1. Go to ${relativePath}
2. Expose/customize your persisted model using \`t.prismaFields([...])\`
  `)
    } else {
      console.log('Exiting now.')
    }

    process.exit(0)
  }

  scaffoldType(yogaConfig, typeName, hasDb, null)

  console.log(`\
Scaffolded new file at ./src/graphql/${typeName}.ts

Next steps:

- Go to ./src/graphql/${typeName}.ts
- Expose your persisted fields
    `)
}

function scaffoldType(
  config: Config,
  typeName: string,
  hasDb: boolean,
  crudOperations: string[] | null,
): string {
  const typePath = path.join(config.resolversPath, `${typeName}.ts`)

  if (fs.existsSync(typePath)) {
    throw new Error(`Cannot override existing file at ${typePath}.`)
  }

  const content = hasDb
    ? scaffoldTypeWithDb(typeName, crudOperations)
    : scaffoldTypeWithoutDb(typeName)

  try {
    fs.writeFileSync(typePath, content)
  } catch (e) {
    console.error(e)
  }

  return typePath
}

function scaffoldTypeWithDb(
  typeName: string,
  crudOperations: string[] | null,
): string {
  let content = `\
import { prismaObjectType${
    crudOperations && crudOperations.length > 0 ? ', prismaExtendType' : ''
  } } from 'yoga'
  
export const ${typeName} = prismaObjectType({
  name: '${typeName}',
  definition(t) {
    // All fields exposed thanks the to wildcard operator
    // Expose, hide or customize specific fields with t.prismaFields(['id', 'otherField', ...])
    t.prismaFields(['*'])
  }
})
`

  if (crudOperations && crudOperations.length > 0) {
    const queryOperations = crudOperations
      .filter(op => op.startsWith('Query'))
      .map(op => `'${op.replace('Query.', '')}'`)

    const mutationOperations = crudOperations
      .filter(op => op.startsWith('Mutation'))
      .map(op => `'${op.replace('Mutation.', '')}'`)

    if (queryOperations.length > 0) {
      content += `
export const ${typeName}Query = prismaExtendType({
  type: 'Query',
  definition(t) {
    t.prismaFields([${queryOperations.join(', ')}])
  }
})
`
    }

    if (mutationOperations.length > 0) {
      content += `
export const ${typeName}Mutation = prismaExtendType({
  type: 'Mutation',
  definition(t) {
    t.prismaFields([${mutationOperations.join(', ')}])
  }
})
`
    }
  }

  return content
}

function scaffoldTypeWithoutDb(typeName: string) {
  return `\
import { objectType } from 'yoga'

export const ${typeName} = objectType({
  name: '${typeName}',
  definition(t) {
    // Expose your fields using t.field()/string()/boolean().. here
  }
})
  `
}

function getPrismaDatamodel(
  projectDir: string,
): { datamodelPath: string; datamodelContent: string } {
  const configPath = findPrismaConfigFile(projectDir)

  if (!configPath) {
    throw new Error('Could not find `prisma.yml` file')
  }

  let definition: null | any = null

  try {
    const file = fs.readFileSync(configPath, 'utf-8')
    definition = yaml.safeLoad(file)
  } catch (e) {
    throw new Error(`Yaml parsing error in ${configPath}: ${e.message}`)
  }

  if (!definition.datamodel) {
    throw new Error('Missing `datamodel` property in prisma.yml file')
  }

  const unresolvedTypesPath = Array.isArray(definition.datamodel)
    ? definition.datamodel[0]
    : definition.datamodel
  const datamodelPath = path.join(path.dirname(configPath), unresolvedTypesPath)

  return {
    datamodelPath,
    datamodelContent: fs.readFileSync(datamodelPath).toString(),
  }
}

function updateDatamodel(datamodelPath: string, typeName: string): void {
  const typeToAdd = `\n
type ${typeName} {
  # Add your fields here
  id: ID! @unique
}`

  try {
    fs.appendFileSync(datamodelPath, typeToAdd)
  } catch (e) {
    console.error(e)
  }
}

/**
 * Uppercase the first letter of a string. Useful when generating type names.
 */
function upperFirst(s: string): string {
  return s.replace(/^\w/, c => c.toUpperCase())
}

function isModelNameAlreadyDefined(modelName: string, datamodelString: string) {
  return datamodelString.includes(`type ${modelName}`)
}

async function runPrismaDeploy(): Promise<any> {
  try {
    if (isYarnInstalled()) {
      if (isPrismaInstalledLocally()) {
        return runCommand('yarn prisma deploy')
      }
      if (isPrismaInstalledGlobally()) {
        return runCommand('prisma deploy')
      }
    } else {
      if (isPrismaInstalledLocally()) {
        return runCommand('npm run prisma deploy')
      }
      if (isPrismaInstalledGlobally()) {
        await runCommand(`prisma deploy`)
      }
    }
  } catch (e) {
    console.error(e)
  }
}

async function isPrismaInstalledGlobally(): Promise<boolean> {
  try {
    await execa.shell(`prisma --version`, { stdio: `ignore` })
    return true
  } catch (err) {
    return false
  }
}

async function isPrismaInstalledLocally(): Promise<boolean> {
  try {
    await execa.shell(`yarn prisma --version`, { stdio: `ignore` })
    return true
  } catch (err) {
    return false
  }
}

async function isYarnInstalled(): Promise<boolean> {
  try {
    await execa.shell(`yarnpkg --version`, { stdio: `ignore` })
    return true
  } catch (err) {
    return false
  }
}

async function runCommand(command: string) {
  const [cmd, ...rest] = command.split(' ')

  const childProcess = spawnAsync(cmd, rest, { stdio: 'inherit' })

  return childProcess
}
