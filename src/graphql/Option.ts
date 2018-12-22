import { prismaObjectType } from 'graphql-yoga'

/*
type Option {
  id: ID!
  name: String!
  values(...): [OptionValue!]
}
*/
export const Option = prismaObjectType('Option')
