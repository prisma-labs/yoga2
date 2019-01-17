import { prismaObjectType } from 'yoga'

/*
type User {
  id: ID!
  name: String!
}
*/
export const User = prismaObjectType('User', t => {
  t.prismaFields(['id', 'name'])
})
