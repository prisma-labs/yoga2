import { objectType } from 'yoga'

/*
type Query {
  hello: String!
}
*/
export const Query = objectType('Query', t => {
  t.field('hello', 'String')
})
