import * as inquirer from 'inquirer'
import pluralize from 'pluralize'
import { importYogaConfig } from '../../../helpers'
import * as path from 'path'
import * as fs from 'fs'
import yaml from 'js-yaml'
import { Config } from '../../../types'

export default async () => {
  const config = await importYogaConfig()
  const { inputTypeName } = await inquirer.prompt<{ inputTypeName: string }>([
    {
      name: 'inputTypeName',
      message: 'Input the name of your type',
      type: 'input',
    },
  ])
  const typeName = upperFirst(inputTypeName)
  const hasDb = !!config.prisma
  let crudOperations: string[] | null = null

  if (hasDb) {
    const { answer } = await inquirer.prompt<{ answer: boolean }>([
      {
        name: 'answer',
        message: 'Do you want to expose CRUD operations ?',
        type: 'confirm',
      },
    ])

    if (answer) {
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
  }

  if (hasDb) {
    updateDatamodel(typeName)
  }

  scaffoldType(config, typeName, hasDb, crudOperations)

  if (hasDb) {
    console.log(`\
- Updated datamodel.prisma
- Scaffolded new file at ./src/graphql/${typeName}.ts

Next steps:
1/
- Go to your datamodel.prisma file
- Add desired fields to your model
- Run \`prisma deloy\`

2/
- Go to ./src/graphql/${typeName}.ts
- Expose/customize your persisted model using \`t.prismaFields([...])\`
`)
  } else {
    console.log(`\
Scaffolded new file at ./src/graphql/${typeName}.ts

Next steps:

- Go to ./src/graphql/${typeName}.ts
- Expose your persisted fields
    `)
  }
}

function scaffoldType(
  config: Config,
  typeName: string,
  hasDb: boolean,
  crudOperations: string[] | null,
) {
  const typePath = path.join(config.resolversPath, `${typeName}.ts`)
  const content = hasDb
    ? scaffoldTypeWithDb(typeName, crudOperations)
    : scaffoldTypeWithoutDb(typeName)

  if (fs.existsSync(typePath)) {
    throw new Error(`Cannot override existing file at ${typePath}.`)
  }

  try {
    fs.writeFileSync(typePath, content)
  } catch (e) {
    console.error(e)
  }
}

function scaffoldTypeWithDb(
  typeName: string,
  crudOperations: string[] | null,
): string {
  let content = `\
import { prismaObjectType ${
    crudOperations && crudOperations.length > 0 ? ', prismaExtendType' : ''
  } } from 'yoga'
  
export const User = prismaObjectType('${typeName}'/*, t => {
  // To expose your fields, call t.prismaFields([‘fieldName’, …])
}*/)
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
export const ${typeName}Query = prismaExtendType('Query', t => {
  t.prismaFields([${queryOperations.join(', ')}])
})
`
    }

    if (mutationOperations.length > 0) {
      content += `
export const ${typeName}Mutation = prismaExtendType('Mutation', t => {
  t.prismaFields([${mutationOperations.join(', ')}])
})
`
    }
  }

  return content
}

function scaffoldTypeWithoutDb(typeName: string) {
  return `\
import { objectType } from 'yoga'

export const ${typeName} = prismaObjectType('${typeName}'/*,  t => {
  // Expose your fields using t.field()/string()/boolean().. here
}*/)
  `
}

function findPrismaConfigFile(): string | null {
  let definitionPath: string | null = path.join(process.cwd(), 'prisma.yml')

  if (fs.existsSync(definitionPath)) {
    return definitionPath
  }

  definitionPath = path.join(process.cwd(), 'prisma', 'prisma.yml')

  if (fs.existsSync(definitionPath)) {
    return definitionPath
  }

  return null
}

function updateDatamodel(typeName: string): void {
  const configPath = findPrismaConfigFile()

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
  const datamodelContent = fs.readFileSync(datamodelPath).toString()

  if (datamodelContent.includes(`type ${typeName}`)) {
    throw new Error(`Type ${typeName} is already defined in your datamodel.`)
  }

  const typeToAdd = `\n
type ${typeName} {
  # Add your fields here
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
