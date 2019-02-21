import { start } from '../../../server'
import { importYogaConfig } from '../../../config'

export default async () => {
  const { yogaConfig } = importYogaConfig()

  return start(yogaConfig)
}
