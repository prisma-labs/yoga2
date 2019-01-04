import { objectType } from 'yoga'

/*
type Query {
  hello: String!
  user: User!
}
*/
export const Query = objectType('Query', t => {
  t.field('hello', 'String')
  t.field('user', 'User')
})
