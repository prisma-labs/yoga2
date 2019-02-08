import { objectType, stringArg } from 'yoga'
import { User } from './User'

/*
type Query {
  hello(name: String!): String!
  user(name: String!): User!
}
*/
export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.string('hello', {
      args: {
        name: stringArg(),
      },
      resolve: (root, { name }) => `Hello ${name}`,
    })

    t.list.field('users', {
      type: User,
      resolve: (root, args, ctx) => {
        return ctx.users
      },
    })
  },
})
