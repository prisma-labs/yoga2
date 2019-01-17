import { prismaObjectType } from 'yoga'

/**
type Post {
  id: ID!
  title: String!
  content: String!
  comments: [Comment!]!
}
 */
export const Post = prismaObjectType('Post')
