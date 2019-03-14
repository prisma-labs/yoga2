import { prisma, Prisma } from '../.yoga/prisma-client'
import { yogaContext } from 'yoga'

export interface Context {
  prisma: Prisma
}

export default yogaContext(({ req }) => ({
  req,
  prisma,
}))
