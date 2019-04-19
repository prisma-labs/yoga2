import chalk from 'chalk'

export interface Template {
  name: string
  description: string
  repo: TemplateRepository
  postIntallMessage: string
}

export interface TemplateRepository {
  uri: string
  branch: string
  path: string
}

export const defaultTemplate: Template = {
  name: 'minimal-yoga',
  description: 'Basic starter template ',
  repo: {
    uri: 'https://github.com/atto-byte/yoga2',
    branch: 'master',
    path: '/examples/minimal',
  },
  postIntallMessage: `
Your template has been successfully set up!
  
Here are the next steps to get you started:
  1. Run ${chalk.yellow(`yarn dev`)} (Starts the GraphQL server)
  2. That's it !
  `,
}

export const availableTemplates: Template[] = [
  defaultTemplate,
  {
    name: 'with-prisma',
    description: 'Template with Prisma database support',
    repo: {
      uri: 'https://github.com/atto-byte/yoga2',
      branch: 'master',
      path: '/examples/with-prisma',
    },
    postIntallMessage: `
Your template has been successfully set up!
  
Here are the next steps to get you started:
  1. Run ${chalk.yellow(
    `yarn prisma deploy`,
  )} (choose a Demo server for a quicker startup)
  2. Run ${chalk.yellow(`yarn dev`)} (Starts the GraphQL server)
  3. That's it !
  `,
  },
  {
    name: 'with-prisma-ejected',
    description: 'Template with Prisma database support',
    repo: {
      uri: 'https://github.com/atto-byte/yoga2',
      branch: 'master',
      path: '/examples/with-prisma-ejected',
    },
    postIntallMessage: `
Your template has been successfully set up!
  
Here are the next steps to get you started:
  1. Run ${chalk.yellow(
    `yarn prisma deploy`,
  )} (choose a Demo server for a quicker startup)
  2. Run ${chalk.yellow(`yarn dev`)} (Starts the GraphQL server)
  3. That's it !
  `,
  },
]

export const templatesNames = availableTemplates
  .map(t => `\`${t.name}\``)
  .join(', ')
