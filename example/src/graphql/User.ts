import { objectType } from 'yoga'

/*
type Query {
  hello: String!
}
*/
const User = objectType('User', t => {
  t.field('name', 'String')
})
