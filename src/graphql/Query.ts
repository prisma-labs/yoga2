import { prismaObjectType } from 'graphql-yoga'

/*
type Query {
  products: [Product!]!
  options: [Option!]!
  brands: [Brand!]!
}
*/
export const Query = prismaObjectType('Query', t => {
  t.prismaFields(['products', 'options', 'brands'])
})
