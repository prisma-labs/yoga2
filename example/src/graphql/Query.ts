import { objectType } from 'nexus'

/*
type Query {
  products: [Product!]!
  options: [Option!]!
  brands: [Brand!]!
}
*/
export const Query = objectType('Query', t => {
  t.field('hello', 'String')
})
