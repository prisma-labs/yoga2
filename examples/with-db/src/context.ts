import { prisma, Prisma } from '../yoga/prisma-client'

export interface Context {
  prisma: Prisma
}

export default () => ({
  prisma,
})
