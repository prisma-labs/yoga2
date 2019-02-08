import { queryType, stringArg } from 'yoga'

/*
type Query {
  hello(name: String!): String!
  users: [User!]!
  posts: [Post!]!
}
*/
export const Query = queryType({
  definition(t) {
    t.string('hello', {
      args: {
        name: stringArg(),
      },
      resolve: (root, { name }) => `Hello ${name}`,
    })

    t.list.field('users', {
      type: 'User',
      resolve: (root, args, ctx) => ctx.prisma.users(),
    })

    t.list.field('posts', {
      type: 'Post',
      resolve: (root, args, ctx) => [],
    })
  },
})
