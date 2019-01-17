import { prisma, Prisma } from './generated/prisma-client'

export interface Context {
  prisma: Prisma
}

export default () => ({
  prisma,
})
