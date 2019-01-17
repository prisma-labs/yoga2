import { prismaObjectType } from 'yoga'

/**
type Comment {
  id: ID!
  author: User!
  content: String!
}
 */
export const Comment = prismaObjectType('Comment')
