import { prismaObjectType } from 'graphql-yoga'

/*
type Option {
  id: ID!
  name: String!
  values(
    where: OptionValueWhereInput
    orderBy: OptionValueOrderByInput
    skip: Int
    after: String
    before: String
    first: Int
    last: Int
  ): [OptionValue!]
}
*/
export const Option = prismaObjectType('Option')
