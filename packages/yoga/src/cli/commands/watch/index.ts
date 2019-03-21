import { watch } from '../../../server'

export default async (args: Record<string, string>) => {
  return watch(args['env'])
}
