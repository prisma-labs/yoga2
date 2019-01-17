import { InputConfig } from 'yoga'

export default {
  output: {
    schemaPath: './src/generated/nexus.graphql',
    typegenPath: './src/generated/nexus.ts',
  },
  prisma: true,
} as InputConfig
