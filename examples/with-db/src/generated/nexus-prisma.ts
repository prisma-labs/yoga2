// GENERATED TYPES FOR PRISMA PLUGIN. /!\ DO NOT EDIT MANUALLY

import {
  ArgDefinition,
  ContextValue,
  RootValue,
} from 'nexus/dist/types'
import { GraphQLResolveInfo } from 'graphql'

import * as prisma from './prisma-client'

// Types for Query

type QueryObject =
  | QueryFields
  | { name: 'user', args?: QueryUserArgs[] | false, alias?: string  } 
  | { name: 'users', args?: QueryUsersArgs[] | false, alias?: string  } 
  | { name: 'usersConnection', args?: QueryUsersConnectionArgs[] | false, alias?: string  } 
  | { name: 'node', args?: QueryNodeArgs[] | false, alias?: string  } 

type QueryFields =
  | 'user'
  | 'users'
  | 'usersConnection'
  | 'node'


type QueryUserArgs =
  | 'where'
type QueryUsersArgs =
  | 'where'
  | 'orderBy'
  | 'skip'
  | 'after'
  | 'before'
  | 'first'
  | 'last'
type QueryUsersConnectionArgs =
  | 'where'
  | 'orderBy'
  | 'skip'
  | 'after'
  | 'before'
  | 'first'
  | 'last'
type QueryNodeArgs =
  | 'id'
  

export interface QueryFieldDetails<GenTypes = GraphQLNexusGen> {
  user: {
    args: Record<QueryUserArgs, ArgDefinition>
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "Query">,
      args: { where: UserWhereUniqueInput }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.User | null> | prisma.User | null;
  }
  users: {
    args: Record<QueryUsersArgs, ArgDefinition>
    description: string
    list: true
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Query">,
      args: { where?: UserWhereInput | null, orderBy?: prisma.UserOrderByInput | null, skip?: number | null, after?: string | null, before?: string | null, first?: number | null, last?: number | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.User[]> | prisma.User[];
  }
  usersConnection: {
    args: Record<QueryUsersConnectionArgs, ArgDefinition>
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Query">,
      args: { where?: UserWhereInput | null, orderBy?: prisma.UserOrderByInput | null, skip?: number | null, after?: string | null, before?: string | null, first?: number | null, last?: number | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.UserConnection> | prisma.UserConnection;
  }
  node: {
    args: Record<QueryNodeArgs, ArgDefinition>
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "Query">,
      args: { id: string }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Node | null> | prisma.Node | null;
  }
}
  

// Types for User

type UserObject =
  | UserFields
  | { name: 'id', args?: [] | false, alias?: string  } 
  | { name: 'name', args?: [] | false, alias?: string  } 

type UserFields =
  | 'id'
  | 'name'



  

export interface UserFieldDetails<GenTypes = GraphQLNexusGen> {
  id: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "User">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
  }
  name: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "User">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
  }
}
  

// Types for UserConnection

type UserConnectionObject =
  | UserConnectionFields
  | { name: 'pageInfo', args?: [] | false, alias?: string  } 
  | { name: 'edges', args?: [] | false, alias?: string  } 
  | { name: 'aggregate', args?: [] | false, alias?: string  } 

type UserConnectionFields =
  | 'pageInfo'
  | 'edges'
  | 'aggregate'



  

export interface UserConnectionFieldDetails<GenTypes = GraphQLNexusGen> {
  pageInfo: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "UserConnection">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.PageInfo> | prisma.PageInfo;
  }
  edges: {
    args: {}
    description: string
    list: true
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "UserConnection">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.UserEdge[]> | prisma.UserEdge[];
  }
  aggregate: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "UserConnection">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.AggregateUser> | prisma.AggregateUser;
  }
}
  

// Types for PageInfo

type PageInfoObject =
  | PageInfoFields
  | { name: 'hasNextPage', args?: [] | false, alias?: string  } 
  | { name: 'hasPreviousPage', args?: [] | false, alias?: string  } 
  | { name: 'startCursor', args?: [] | false, alias?: string  } 
  | { name: 'endCursor', args?: [] | false, alias?: string  } 

type PageInfoFields =
  | 'hasNextPage'
  | 'hasPreviousPage'
  | 'startCursor'
  | 'endCursor'



  

export interface PageInfoFieldDetails<GenTypes = GraphQLNexusGen> {
  hasNextPage: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "PageInfo">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<boolean> | boolean;
  }
  hasPreviousPage: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "PageInfo">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<boolean> | boolean;
  }
  startCursor: {
    args: {}
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "PageInfo">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string | null> | string | null;
  }
  endCursor: {
    args: {}
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "PageInfo">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string | null> | string | null;
  }
}
  

// Types for UserEdge

type UserEdgeObject =
  | UserEdgeFields
  | { name: 'node', args?: [] | false, alias?: string  } 
  | { name: 'cursor', args?: [] | false, alias?: string  } 

type UserEdgeFields =
  | 'node'
  | 'cursor'



  

export interface UserEdgeFieldDetails<GenTypes = GraphQLNexusGen> {
  node: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "UserEdge">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.User> | prisma.User;
  }
  cursor: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "UserEdge">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
  }
}
  

// Types for AggregateUser

type AggregateUserObject =
  | AggregateUserFields
  | { name: 'count', args?: [] | false, alias?: string  } 

type AggregateUserFields =
  | 'count'



  

export interface AggregateUserFieldDetails<GenTypes = GraphQLNexusGen> {
  count: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "AggregateUser">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<number> | number;
  }
}
  

// Types for Mutation

type MutationObject =
  | MutationFields
  | { name: 'createUser', args?: MutationCreateUserArgs[] | false, alias?: string  } 
  | { name: 'updateUser', args?: MutationUpdateUserArgs[] | false, alias?: string  } 
  | { name: 'updateManyUsers', args?: MutationUpdateManyUsersArgs[] | false, alias?: string  } 
  | { name: 'upsertUser', args?: MutationUpsertUserArgs[] | false, alias?: string  } 
  | { name: 'deleteUser', args?: MutationDeleteUserArgs[] | false, alias?: string  } 
  | { name: 'deleteManyUsers', args?: MutationDeleteManyUsersArgs[] | false, alias?: string  } 

type MutationFields =
  | 'createUser'
  | 'updateUser'
  | 'updateManyUsers'
  | 'upsertUser'
  | 'deleteUser'
  | 'deleteManyUsers'


type MutationCreateUserArgs =
  | 'data'
type MutationUpdateUserArgs =
  | 'data'
  | 'where'
type MutationUpdateManyUsersArgs =
  | 'data'
  | 'where'
type MutationUpsertUserArgs =
  | 'where'
  | 'create'
  | 'update'
type MutationDeleteUserArgs =
  | 'where'
type MutationDeleteManyUsersArgs =
  | 'where'
  

export interface MutationFieldDetails<GenTypes = GraphQLNexusGen> {
  createUser: {
    args: Record<MutationCreateUserArgs, ArgDefinition>
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { data: UserCreateInput }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.User> | prisma.User;
  }
  updateUser: {
    args: Record<MutationUpdateUserArgs, ArgDefinition>
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { data: UserUpdateInput, where: UserWhereUniqueInput }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.User | null> | prisma.User | null;
  }
  updateManyUsers: {
    args: Record<MutationUpdateManyUsersArgs, ArgDefinition>
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { data: UserUpdateManyMutationInput, where?: UserWhereInput | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.BatchPayload> | prisma.BatchPayload;
  }
  upsertUser: {
    args: Record<MutationUpsertUserArgs, ArgDefinition>
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { where: UserWhereUniqueInput, create: UserCreateInput, update: UserUpdateInput }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.User> | prisma.User;
  }
  deleteUser: {
    args: Record<MutationDeleteUserArgs, ArgDefinition>
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { where: UserWhereUniqueInput }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.User | null> | prisma.User | null;
  }
  deleteManyUsers: {
    args: Record<MutationDeleteManyUsersArgs, ArgDefinition>
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { where?: UserWhereInput | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.BatchPayload> | prisma.BatchPayload;
  }
}
  

// Types for BatchPayload

type BatchPayloadObject =
  | BatchPayloadFields
  | { name: 'count', args?: [] | false, alias?: string  } 

type BatchPayloadFields =
  | 'count'



  

export interface BatchPayloadFieldDetails<GenTypes = GraphQLNexusGen> {
  count: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "BatchPayload">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<undefined> | undefined;
  }
}
  

// Types for Subscription

type SubscriptionObject =
  | SubscriptionFields
  | { name: 'user', args?: SubscriptionUserArgs[] | false, alias?: string  } 

type SubscriptionFields =
  | 'user'


type SubscriptionUserArgs =
  | 'where'
  

export interface SubscriptionFieldDetails<GenTypes = GraphQLNexusGen> {
  user: {
    args: Record<SubscriptionUserArgs, ArgDefinition>
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "Subscription">,
      args: { where?: UserSubscriptionWhereInput | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.UserSubscriptionPayload | null> | prisma.UserSubscriptionPayload | null;
  }
}
  

// Types for UserSubscriptionPayload

type UserSubscriptionPayloadObject =
  | UserSubscriptionPayloadFields
  | { name: 'mutation', args?: [] | false, alias?: string  } 
  | { name: 'node', args?: [] | false, alias?: string  } 
  | { name: 'updatedFields', args?: [] | false, alias?: string  } 
  | { name: 'previousValues', args?: [] | false, alias?: string  } 

type UserSubscriptionPayloadFields =
  | 'mutation'
  | 'node'
  | 'updatedFields'
  | 'previousValues'



  

export interface UserSubscriptionPayloadFieldDetails<GenTypes = GraphQLNexusGen> {
  mutation: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "UserSubscriptionPayload">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.MutationType> | prisma.MutationType;
  }
  node: {
    args: {}
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "UserSubscriptionPayload">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.User | null> | prisma.User | null;
  }
  updatedFields: {
    args: {}
    description: string
    list: true
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "UserSubscriptionPayload">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string[]> | string[];
  }
  previousValues: {
    args: {}
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "UserSubscriptionPayload">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.UserPreviousValues | null> | prisma.UserPreviousValues | null;
  }
}
  

// Types for UserPreviousValues

type UserPreviousValuesObject =
  | UserPreviousValuesFields
  | { name: 'id', args?: [] | false, alias?: string  } 
  | { name: 'name', args?: [] | false, alias?: string  } 

type UserPreviousValuesFields =
  | 'id'
  | 'name'



  

export interface UserPreviousValuesFieldDetails<GenTypes = GraphQLNexusGen> {
  id: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "UserPreviousValues">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
  }
  name: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "UserPreviousValues">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
  }
}
  


export interface UserWhereUniqueInput {
  id?: string | null
}
  
export interface UserWhereInput {
  id?: string | null
  id_not?: string | null
  id_in: string[]
  id_not_in: string[]
  id_lt?: string | null
  id_lte?: string | null
  id_gt?: string | null
  id_gte?: string | null
  id_contains?: string | null
  id_not_contains?: string | null
  id_starts_with?: string | null
  id_not_starts_with?: string | null
  id_ends_with?: string | null
  id_not_ends_with?: string | null
  name?: string | null
  name_not?: string | null
  name_in: string[]
  name_not_in: string[]
  name_lt?: string | null
  name_lte?: string | null
  name_gt?: string | null
  name_gte?: string | null
  name_contains?: string | null
  name_not_contains?: string | null
  name_starts_with?: string | null
  name_not_starts_with?: string | null
  name_ends_with?: string | null
  name_not_ends_with?: string | null
  AND: UserWhereInput[]
  OR: UserWhereInput[]
  NOT: UserWhereInput[]
}
  
export interface UserCreateInput {
  name: string
}
  
export interface UserUpdateInput {
  name?: string | null
}
  
export interface UserUpdateManyMutationInput {
  name?: string | null
}
  
export interface UserSubscriptionWhereInput {
  mutation_in: prisma.MutationType[]
  updatedFields_contains?: string | null
  updatedFields_contains_every: string[]
  updatedFields_contains_some: string[]
  node?: UserWhereInput | null
  AND: UserSubscriptionWhereInput[]
  OR: UserSubscriptionWhereInput[]
  NOT: UserSubscriptionWhereInput[]
}
  

export type enumTypesNames =
  | 'UserOrderByInput'
  | 'MutationType'
  

export interface PluginTypes {
  fields: {
    Query: QueryObject
    User: UserObject
    UserConnection: UserConnectionObject
    PageInfo: PageInfoObject
    UserEdge: UserEdgeObject
    AggregateUser: AggregateUserObject
    Mutation: MutationObject
    BatchPayload: BatchPayloadObject
    Subscription: SubscriptionObject
    UserSubscriptionPayload: UserSubscriptionPayloadObject
    UserPreviousValues: UserPreviousValuesObject
  }
  fieldsDetails: {
    Query: QueryFieldDetails
    User: UserFieldDetails
    UserConnection: UserConnectionFieldDetails
    PageInfo: PageInfoFieldDetails
    UserEdge: UserEdgeFieldDetails
    AggregateUser: AggregateUserFieldDetails
    Mutation: MutationFieldDetails
    BatchPayload: BatchPayloadFieldDetails
    Subscription: SubscriptionFieldDetails
    UserSubscriptionPayload: UserSubscriptionPayloadFieldDetails
    UserPreviousValues: UserPreviousValuesFieldDetails
  }
  enumTypesNames: enumTypesNames
}

declare global {
  interface GraphQLNexusGen extends PluginTypes {}
}
  