import { start } from '../../../server'
import { importYogaConfig } from '../../../config'

export default async () => {
  const { yogaConfig, prismaClientDir } = importYogaConfig()

  return start(yogaConfig, prismaClientDir)
}
