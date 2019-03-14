import chalk from 'chalk'
import * as fs from 'fs'
import { GraphQLObjectType, GraphQLSchema, isObjectType } from 'graphql'
import * as inquirer from 'inquirer'
import * as yaml from 'js-yaml'
import { join } from 'path'
import * as prettier from 'prettier'
import { DatabaseType, DefaultParser, ISDL } from 'prisma-datamodel'
import { generateCRUDSchemaFromInternalISDL } from 'prisma-generate-schema'
import { PrismaDefinition } from 'prisma-json-schema'
import * as rimraf from 'rimraf'
import { promisify } from 'util'
import { installYogaStarter } from './loader'

const writeFileAsync = promisify(fs.writeFile)
const mkdirAsync = promisify(fs.mkdir)
const renameAsync = promisify(fs.rename)

const PACKAGE_JSON = `\
{
  "scripts": {
    "dev": "yoga dev",
    "build": "yoga build",
    "start": "yoga start",
    "scaffold": "yoga scaffold"
  },
  "dependencies": {
    "yoga": "${require('../../yoga/package.json').version}"
  },
  "devDependencies": {
    "@types/graphql": "^14.0.4",
    "@types/node": "^10.12.11",
    "@types/ws": "^6.0.1",
    "prisma": "^1.26.4",
    "typescript": "^3.3.3"
  },
  "prettier": {
    "semi": false,
    "singleQuote": true,
    "trailingComma": "all"
  }
}
`

const TSCONFIG_JSON = `\
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "target": "es5",
    "rootDir": "./",
    "outDir": "dist",
    "sourceMap": true,
    "lib": ["es2015", "esnext.asynciterable", "es2017", "dom"],
    "noUnusedLocals": true,
    "noUnusedParameters": false,
    "strict": false,
    "skipLibCheck": true
  },
  "include": ["./**/*.ts", ".yoga/**/*"],
  "exclude": ["node_modules"]
} 
`

const FILES_REQUIRED = ['datamodel.prisma', 'docker-compose.yml', 'prisma.yml']
const FILES_TO_IGNORE = [
  '.git',
  '.gitignore',
  'package.json',
  'tsconfig.json',
  'README.md',
  'generated',
  '.yoga',
]
const ALL_FILES = [...FILES_REQUIRED, ...FILES_TO_IGNORE]

const RESOLVERS_PATH = './src/graphql'
const PRISMA_FILES_PATH = './prisma'

export async function initScaffold() {
  const outputPath = process.cwd()
  const { datamodelPath, prismaYmlPath } = findPrismaPaths(outputPath)
  const prismaYml = readPrismaYml(prismaYmlPath)
  const databaseType = getDatabaseType(prismaYml)
  const { datamodel } = computeISDL(datamodelPath, databaseType)
  const schema = generateCRUDSchemaFromInternalISDL(datamodel, databaseType)
  const exposableTypes = [schema.getType('Query'), schema.getType('Mutation')]
  const choices = choicesFromGraphQLTypes(exposableTypes as GraphQLObjectType[])
  const { fieldsIdentifiers: fields } = await inquirer.prompt<{
    fieldsIdentifiers: string[]
  }>([
    {
      name: 'fieldsIdentifiers',
      message: 'Select the types and fields you would like to expose',
      type: 'checkbox',
      choices,
      validate(input) {
        if (!input.some(t => t.split('.')[0] === 'Query')) {
          return 'At least one field from the Query type must be selected'
        }

        return true
      },
    },
  ])
  const fieldsByType = processFieldsIdentifiers(fields)

  try {
    await writeFileAsync(join(outputPath, 'package.json'), PACKAGE_JSON)

    const prettierOptions = await resolvePrettierOptions(outputPath)

    await Promise.all([
      mkdir(join(outputPath, RESOLVERS_PATH)),
      mkdir(join(outputPath, PRISMA_FILES_PATH)),
    ])

    await Promise.all([
      installYogaStarter(outputPath),
      scaffoldGraphQLTypes(
        outputPath,
        fieldsByType,
        datamodel,
        schema,
        prettierOptions,
      ),
      scaffoldContext(outputPath, prettierOptions),
      scaffoldPrismaYml(
        outputPath,
        prismaYml.endpoint,
        prismaYmlPath,
        prettierOptions,
      ),
      writeFileAsync(join(outputPath, 'tsconfig.json'), TSCONFIG_JSON),
      renameAsync(
        datamodelPath,
        join(outputPath, PRISMA_FILES_PATH, 'datamodel.prisma'),
      ),
    ])

    const clientPath = join(outputPath, 'generated')

    if (fs.existsSync(clientPath)) {
      rimraf.sync(clientPath)
    }

    console.log(`
GraphQL server successfully bootstrapped! 🚀

Here are the next steps to get you started:
  1. Run ${chalk.yellow(`yarn prisma deploy`)}
  2. Run ${chalk.yellow(`yarn dev`)}
  3. That's it!
`)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

function processFieldsIdentifiers(fields: string[]): Record<string, string[]> {
  return fields.reduce<Record<string, string[]>>((acc, operation) => {
    const [typeName, fieldName] = operation.split('.')

    if (!acc[typeName]) {
      acc[typeName] = []
    }

    acc[typeName].push(fieldName)

    return acc
  }, {})
}

function findPrismaPaths(outputPath: string) {
  const dirFiles = fs.readdirSync(outputPath)
  const forbiddenFiles = dirFiles.filter(
    fileName => !ALL_FILES.includes(fileName),
  )

  if (forbiddenFiles.length > 0) {
    console.log(
      `❌  Directory must not contain anything else than the output of \`prisma init\`. Please, remove ${forbiddenFiles
        .map(f => `'${f}'`)
        .join(', ')}`,
    )
    process.exit(1)
  }

  const presentFiles = dirFiles.filter(fileName =>
    FILES_REQUIRED.includes(fileName),
  )
  const missingFiles = FILES_REQUIRED.filter(
    fileName => !presentFiles.includes(fileName),
  )
    .map(fileName => chalk.yellow(fileName))
    .join(',')

  if (missingFiles.length > 0) {
    console.log(`\
❌  We could not find the following files: ${missingFiles}
  - If you don't have these files, run ${chalk.yellow(
    'prisma init',
  )} to generate one
  - If you have them, just run the command from within the folder in which they're contained
This is a temporary workflow until we open up the prisma-cli API
      `)
    process.exit(1)
  }

  return {
    datamodelPath: join(outputPath, 'datamodel.prisma'),
    dockerComposePath: join(outputPath, 'docker-compose.yml'),
    prismaYmlPath: join(outputPath, 'prisma.yml'),
  }
}

function choicesFromGraphQLTypes(
  types: GraphQLObjectType[],
): inquirer.ChoiceType[] {
  const choices: inquirer.ChoiceType[] = []

  // if (typeName === 'Query' && f === 'node')
  // typeName !== Query || f !== 'node'

  types.forEach(t => {
    choices.push(
      ...[
        new inquirer.Separator(t.name),
        ...Object.keys(t.getFields())
          .filter(f => !(t.name === 'Query' && f === 'node'))
          .map(f => ({
            name: f,
            value: `${t.name}.${f}`,
          })),
      ],
    )
  })

  return choices
}

async function scaffoldGraphQLTypes(
  outputPath: string,
  fieldsByType: Record<string, string[]>,
  datamodel: ISDL,
  schema: GraphQLSchema,
  prettierOptions: prettier.Options,
): Promise<void> {
  const objectTypes = datamodel.types
    .filter(t => isObjectType(schema.getType(t.name)))
    .reduce<Record<string, string[]>>((acc, t) => {
      const type = schema.getType(t.name) as GraphQLObjectType

      if (!acc[type.name]) {
        acc[type.name] = Object.keys(type.getFields())
      }

      return acc
    }, {})

  const filePromises = Object.entries({ ...fieldsByType, ...objectTypes }).map(
    ([typeName, fields]) => {
      const renderedType = renderType(typeName, fields)
      const filePath = join(outputPath, RESOLVERS_PATH, `${typeName}.ts`)

      return writeFileAsync(filePath, format(renderedType, prettierOptions))
    },
  )

  await Promise.all(filePromises)
}

function renderType(typeName: string, fields: string[]) {
  return `\
import { prismaObjectType } from 'yoga'

export const ${typeName} = prismaObjectType({
  name: '${typeName}',
  definition(t) {
    t.prismaFields([${fields.map(f => `'${f}'`).join(', ')}])
  }
})
  `
}

async function scaffoldContext(
  outputPath: string,
  prettierOptions: prettier.Options,
): Promise<void> {
  const contextFile = `\
import { prisma } from '../.yoga/prisma-client'

export default () => ({ prisma })
  `
  const contextPath = join(outputPath, 'src', 'context.ts')

  await writeFileAsync(contextPath, format(contextFile, prettierOptions))
}

async function scaffoldPrismaYml(
  outputPath: string,
  endpoint: string,
  existingPrismaYmlPath: string,
  prettierOptions: prettier.Options,
): Promise<void> {
  const prismaYmlFile = `\
  # Defines your models, each model is mapped to the database as a table.
  datamodel: datamodel.prisma
  
  # Specifies the language and directory for the generated Prisma client.
  generate:
    - generator: typescript-client
      output: ../.yoga/prisma-client/
  
  # Ensures Prisma client is re-generated after a datamodel change.
  hooks:
    post-deploy:
      - prisma generate
      - npx nexus-prisma-generate --output ./.yoga/nexus-prisma
  endpoint: ${endpoint}
  `
  const prismaYmlPath = join(outputPath, PRISMA_FILES_PATH, 'prisma.yml')

  await writeFileAsync(
    prismaYmlPath,
    format(prismaYmlFile, prettierOptions, 'yaml'),
  )
  rimraf.sync(existingPrismaYmlPath)
}

async function mkdir(path: string): Promise<void> {
  try {
    await mkdirAsync(path, { recursive: true })
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
}

export function getDatabaseType(definition: PrismaDefinition): DatabaseType {
  if (!definition.databaseType) {
    return DatabaseType.postgres
  }

  return definition.databaseType === 'document'
    ? DatabaseType.mongo
    : DatabaseType.postgres
}

export function readPrismaYml(configPath: string): any {
  try {
    const file = fs.readFileSync(configPath, 'utf-8')
    const config = yaml.safeLoad(file) as PrismaDefinition

    if (!config.datamodel) {
      throw new Error('Invalid prisma.yml file: Missing `datamodel` property')
    }

    if (!config.endpoint) {
      throw new Error('Invalid prisma.yml file: Missing `endpoint` property')
    }

    return config
  } catch (e) {
    throw new Error(`Yaml parsing error in ${configPath}: ${e.message}`)
  }
}

function computeISDL(
  datamodelPath: string,
  databaseType: DatabaseType,
): {
  datamodel: ISDL
  databaseType: DatabaseType
} {
  const typeDefs = fs.readFileSync(datamodelPath).toString()
  const ParserInstance = DefaultParser.create(databaseType)

  return {
    datamodel: ParserInstance.parseFromSchemaString(typeDefs),
    databaseType,
  }
}

export function format(
  code: string,
  options: prettier.Options = {},
  parser: prettier.BuiltInParserName = 'typescript',
) {
  try {
    return prettier.format(code, {
      ...options,
      parser,
    })
  } catch (e) {
    console.log(
      `There is a syntax error in generated code, unformatted code printed, error: ${JSON.stringify(
        e,
      )}`,
    )
    return code
  }
}

async function resolvePrettierOptions(path: string): Promise<prettier.Options> {
  const options = (await prettier.resolveConfig(path)) || {}

  return options
}
