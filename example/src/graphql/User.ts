import { objectType } from 'yoga'

/*
type User {
  id: ID!
  name: String!
}
*/
export const User = objectType('User', t => {
  t.string('name')
  t.string('firstname')
})
