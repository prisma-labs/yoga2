import { objectType } from 'yoga'

/*
type User {
  name: String!
}
*/
export const User = objectType('User', t => {
  t.string('name')
})
