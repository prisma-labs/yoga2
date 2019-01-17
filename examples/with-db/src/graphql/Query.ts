import { objectType, stringArg } from 'yoga'

/*
type Query {
  hello(name: String!): String!
  user(name: String!): User!
}
*/
export const Query = objectType('Query', t => {
  t.field('hello', 'String', {
    args: {
      name: stringArg(),
    },
    resolve: (root, { name }) => `Hello ${name}`,
  })

  t.field('users', 'User', {
    list: true,
    resolve: (root, args, ctx) => ctx.prisma.users(),
  })
})
