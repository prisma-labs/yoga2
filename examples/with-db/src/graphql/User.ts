import { prismaObjectType } from 'yoga'

/*
type User {
  id: ID!
  name: String!
}
*/
export const User = prismaObjectType({
  name: 'User',
  definition(t) {
    t.prismaFields(['id', 'name'])
  },
})
