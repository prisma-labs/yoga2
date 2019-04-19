import { start } from '../../../server'
import { importYogaConfig } from '../../../config'

export default async (argv: Record<string, string>) => {
  return start(importYogaConfig({ env: argv.env }))
}
