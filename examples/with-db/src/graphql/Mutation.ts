import { idArg, prismaObjectType, stringArg } from 'yoga';

/**
type Mutation {
  deletePost(id: ID!): Post
  signupUser(name: String!, email: String!): User!
  createDraft(title: String!, content: String!, authorEmail: String!): Post!
  publish(id: ID!): Post!
}
 */
export const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    // Call t.primaFields to expose, hide, or customize fields
    // t.prismaFields(['createUser', 'deleteUser'])

    t.field('deletePost', {
      type: 'Post',
      nullable: true,
      args: {
        id: idArg(),
      },
      resolve: (parent, args, ctx) => {
        return ctx.prisma.deletePost({ id: args.id })
      },
    })

    t.field('signupUser', {
      type: 'User',
      args: {
        name: stringArg(),
        email: stringArg(),
      },
      resolve: (parent, { name, email }, ctx) => {
        return ctx.prisma.createUser({ name, email })
      },
    })

    t.field('createDraft', {
      type: 'Post',
      args: {
        title: stringArg(),
        content: stringArg(),
        authorEmail: stringArg(),
      },
      resolve: (parent, { title, content, authorEmail }, ctx) => {
        return ctx.prisma.createPost({
          title,
          content,
          author: { connect: { email: authorEmail } },
        })
      },
    })

    t.field('publish', {
      type: 'Post',
      args: {
        id: idArg(),
      },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.updatePost({
          where: { id },
          data: { published: true },
        })
      },
    })
  },
})
