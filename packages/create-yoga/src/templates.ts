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
  name: 'default-yoga',
  description: 'Default Yoga template ',
  repo: {
    uri: 'https://github.com/prisma/yoga2',
    branch: 'master',
    path: '/example',
  },
}

export const availableTemplates: Template[] = [
  defaultTemplate,
]

export const templatesNames = availableTemplates
  .map(t => `\`${t.name}\``)
  .join(', ')
