import { start } from '../../../server'
import { importYogaConfig } from '../../../config'

export default async () => {
  return start(importYogaConfig())
}
