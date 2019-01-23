export interface Template {
  name: string
  description: string
  repo: TemplateRepository
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
    uri: 'https://github.com/prisma/yoga2',
    branch: 'master',
    path: '/examples/minimal',
  },
}

export const availableTemplates: Template[] = [
  defaultTemplate,
  {
    name: 'db-yoga',
    description: 'Template with Prisma database support',
    repo: {
      uri: 'https://github.com/prisma/yoga2',
      branch: 'master',
      path: '/examples/with-db',
    },
  },
]

export const templatesNames = availableTemplates
  .map(t => `\`${t.name}\``)
  .join(', ')
