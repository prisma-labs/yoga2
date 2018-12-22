import { objectType } from 'nexus'

/*
type Option {
  id: ID!
  name: String!
  values(...): [OptionValue!]
}
*/
export const Option = objectType('Option', t => {
  t.string('hello')
})
