import { yogaContext } from '@atto-byte/yoga';
import { prisma, Prisma } from '../.yoga/prisma-client';

export interface Context {
  prisma: Prisma
}

export default yogaContext(({ req }) => ({
  req,
  prisma,
}))
