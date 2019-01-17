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
  | { name: 'comment', args?: QueryCommentArgs[] | false, alias?: string  } 
  | { name: 'comments', args?: QueryCommentsArgs[] | false, alias?: string  } 
  | { name: 'commentsConnection', args?: QueryCommentsConnectionArgs[] | false, alias?: string  } 
  | { name: 'post', args?: QueryPostArgs[] | false, alias?: string  } 
  | { name: 'posts', args?: QueryPostsArgs[] | false, alias?: string  } 
  | { name: 'postsConnection', args?: QueryPostsConnectionArgs[] | false, alias?: string  } 
  | { name: 'user', args?: QueryUserArgs[] | false, alias?: string  } 
  | { name: 'users', args?: QueryUsersArgs[] | false, alias?: string  } 
  | { name: 'usersConnection', args?: QueryUsersConnectionArgs[] | false, alias?: string  } 
  | { name: 'node', args?: QueryNodeArgs[] | false, alias?: string  } 

type QueryFields =
  | 'comment'
  | 'comments'
  | 'commentsConnection'
  | 'post'
  | 'posts'
  | 'postsConnection'
  | 'user'
  | 'users'
  | 'usersConnection'
  | 'node'


type QueryCommentArgs =
  | 'where'
type QueryCommentsArgs =
  | 'where'
  | 'orderBy'
  | 'skip'
  | 'after'
  | 'before'
  | 'first'
  | 'last'
type QueryCommentsConnectionArgs =
  | 'where'
  | 'orderBy'
  | 'skip'
  | 'after'
  | 'before'
  | 'first'
  | 'last'
type QueryPostArgs =
  | 'where'
type QueryPostsArgs =
  | 'where'
  | 'orderBy'
  | 'skip'
  | 'after'
  | 'before'
  | 'first'
  | 'last'
type QueryPostsConnectionArgs =
  | 'where'
  | 'orderBy'
  | 'skip'
  | 'after'
  | 'before'
  | 'first'
  | 'last'
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
  comment: {
    args: Record<QueryCommentArgs, ArgDefinition>
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "Query">,
      args: { where: CommentWhereUniqueInput }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Comment | null> | prisma.Comment | null;
  }
  comments: {
    args: Record<QueryCommentsArgs, ArgDefinition>
    description: string
    list: true
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Query">,
      args: { where?: CommentWhereInput | null, orderBy?: prisma.CommentOrderByInput | null, skip?: number | null, after?: string | null, before?: string | null, first?: number | null, last?: number | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Comment[]> | prisma.Comment[];
  }
  commentsConnection: {
    args: Record<QueryCommentsConnectionArgs, ArgDefinition>
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Query">,
      args: { where?: CommentWhereInput | null, orderBy?: prisma.CommentOrderByInput | null, skip?: number | null, after?: string | null, before?: string | null, first?: number | null, last?: number | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.CommentConnection> | prisma.CommentConnection;
  }
  post: {
    args: Record<QueryPostArgs, ArgDefinition>
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "Query">,
      args: { where: PostWhereUniqueInput }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Post | null> | prisma.Post | null;
  }
  posts: {
    args: Record<QueryPostsArgs, ArgDefinition>
    description: string
    list: true
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Query">,
      args: { where?: PostWhereInput | null, orderBy?: prisma.PostOrderByInput | null, skip?: number | null, after?: string | null, before?: string | null, first?: number | null, last?: number | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Post[]> | prisma.Post[];
  }
  postsConnection: {
    args: Record<QueryPostsConnectionArgs, ArgDefinition>
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Query">,
      args: { where?: PostWhereInput | null, orderBy?: prisma.PostOrderByInput | null, skip?: number | null, after?: string | null, before?: string | null, first?: number | null, last?: number | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.PostConnection> | prisma.PostConnection;
  }
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
  

// Types for Comment

type CommentObject =
  | CommentFields
  | { name: 'id', args?: [] | false, alias?: string  } 
  | { name: 'author', args?: [] | false, alias?: string  } 
  | { name: 'content', args?: [] | false, alias?: string  } 

type CommentFields =
  | 'id'
  | 'author'
  | 'content'



  

export interface CommentFieldDetails<GenTypes = GraphQLNexusGen> {
  id: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Comment">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
  }
  author: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Comment">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.User> | prisma.User;
  }
  content: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Comment">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
  }
}
  

// Types for User

type UserObject =
  | UserFields
  | { name: 'id', args?: [] | false, alias?: string  } 
  | { name: 'name', args?: [] | false, alias?: string  } 
  | { name: 'posts', args?: UserPostsArgs[] | false, alias?: string  } 

type UserFields =
  | 'id'
  | 'name'
  | 'posts'


type UserPostsArgs =
  | 'where'
  | 'orderBy'
  | 'skip'
  | 'after'
  | 'before'
  | 'first'
  | 'last'
  

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
  posts: {
    args: Record<UserPostsArgs, ArgDefinition>
    description: string
    list: true
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "User">,
      args: { where?: PostWhereInput | null, orderBy?: prisma.PostOrderByInput | null, skip?: number | null, after?: string | null, before?: string | null, first?: number | null, last?: number | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Post[]> | prisma.Post[];
  }
}
  

// Types for Post

type PostObject =
  | PostFields
  | { name: 'id', args?: [] | false, alias?: string  } 
  | { name: 'title', args?: [] | false, alias?: string  } 
  | { name: 'content', args?: [] | false, alias?: string  } 
  | { name: 'comments', args?: PostCommentsArgs[] | false, alias?: string  } 

type PostFields =
  | 'id'
  | 'title'
  | 'content'
  | 'comments'


type PostCommentsArgs =
  | 'where'
  | 'orderBy'
  | 'skip'
  | 'after'
  | 'before'
  | 'first'
  | 'last'
  

export interface PostFieldDetails<GenTypes = GraphQLNexusGen> {
  id: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Post">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
  }
  title: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Post">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
  }
  content: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Post">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
  }
  comments: {
    args: Record<PostCommentsArgs, ArgDefinition>
    description: string
    list: true
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Post">,
      args: { where?: CommentWhereInput | null, orderBy?: prisma.CommentOrderByInput | null, skip?: number | null, after?: string | null, before?: string | null, first?: number | null, last?: number | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Comment[]> | prisma.Comment[];
  }
}
  

// Types for CommentConnection

type CommentConnectionObject =
  | CommentConnectionFields
  | { name: 'pageInfo', args?: [] | false, alias?: string  } 
  | { name: 'edges', args?: [] | false, alias?: string  } 
  | { name: 'aggregate', args?: [] | false, alias?: string  } 

type CommentConnectionFields =
  | 'pageInfo'
  | 'edges'
  | 'aggregate'



  

export interface CommentConnectionFieldDetails<GenTypes = GraphQLNexusGen> {
  pageInfo: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "CommentConnection">,
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
      root: RootValue<GenTypes, "CommentConnection">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.CommentEdge[]> | prisma.CommentEdge[];
  }
  aggregate: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "CommentConnection">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.AggregateComment> | prisma.AggregateComment;
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
  

// Types for CommentEdge

type CommentEdgeObject =
  | CommentEdgeFields
  | { name: 'node', args?: [] | false, alias?: string  } 
  | { name: 'cursor', args?: [] | false, alias?: string  } 

type CommentEdgeFields =
  | 'node'
  | 'cursor'



  

export interface CommentEdgeFieldDetails<GenTypes = GraphQLNexusGen> {
  node: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "CommentEdge">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Comment> | prisma.Comment;
  }
  cursor: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "CommentEdge">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
  }
}
  

// Types for AggregateComment

type AggregateCommentObject =
  | AggregateCommentFields
  | { name: 'count', args?: [] | false, alias?: string  } 

type AggregateCommentFields =
  | 'count'



  

export interface AggregateCommentFieldDetails<GenTypes = GraphQLNexusGen> {
  count: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "AggregateComment">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<number> | number;
  }
}
  

// Types for PostConnection

type PostConnectionObject =
  | PostConnectionFields
  | { name: 'pageInfo', args?: [] | false, alias?: string  } 
  | { name: 'edges', args?: [] | false, alias?: string  } 
  | { name: 'aggregate', args?: [] | false, alias?: string  } 

type PostConnectionFields =
  | 'pageInfo'
  | 'edges'
  | 'aggregate'



  

export interface PostConnectionFieldDetails<GenTypes = GraphQLNexusGen> {
  pageInfo: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "PostConnection">,
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
      root: RootValue<GenTypes, "PostConnection">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.PostEdge[]> | prisma.PostEdge[];
  }
  aggregate: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "PostConnection">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.AggregatePost> | prisma.AggregatePost;
  }
}
  

// Types for PostEdge

type PostEdgeObject =
  | PostEdgeFields
  | { name: 'node', args?: [] | false, alias?: string  } 
  | { name: 'cursor', args?: [] | false, alias?: string  } 

type PostEdgeFields =
  | 'node'
  | 'cursor'



  

export interface PostEdgeFieldDetails<GenTypes = GraphQLNexusGen> {
  node: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "PostEdge">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Post> | prisma.Post;
  }
  cursor: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "PostEdge">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
  }
}
  

// Types for AggregatePost

type AggregatePostObject =
  | AggregatePostFields
  | { name: 'count', args?: [] | false, alias?: string  } 

type AggregatePostFields =
  | 'count'



  

export interface AggregatePostFieldDetails<GenTypes = GraphQLNexusGen> {
  count: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "AggregatePost">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<number> | number;
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
  | { name: 'createComment', args?: MutationCreateCommentArgs[] | false, alias?: string  } 
  | { name: 'updateComment', args?: MutationUpdateCommentArgs[] | false, alias?: string  } 
  | { name: 'updateManyComments', args?: MutationUpdateManyCommentsArgs[] | false, alias?: string  } 
  | { name: 'upsertComment', args?: MutationUpsertCommentArgs[] | false, alias?: string  } 
  | { name: 'deleteComment', args?: MutationDeleteCommentArgs[] | false, alias?: string  } 
  | { name: 'deleteManyComments', args?: MutationDeleteManyCommentsArgs[] | false, alias?: string  } 
  | { name: 'createPost', args?: MutationCreatePostArgs[] | false, alias?: string  } 
  | { name: 'updatePost', args?: MutationUpdatePostArgs[] | false, alias?: string  } 
  | { name: 'updateManyPosts', args?: MutationUpdateManyPostsArgs[] | false, alias?: string  } 
  | { name: 'upsertPost', args?: MutationUpsertPostArgs[] | false, alias?: string  } 
  | { name: 'deletePost', args?: MutationDeletePostArgs[] | false, alias?: string  } 
  | { name: 'deleteManyPosts', args?: MutationDeleteManyPostsArgs[] | false, alias?: string  } 
  | { name: 'createUser', args?: MutationCreateUserArgs[] | false, alias?: string  } 
  | { name: 'updateUser', args?: MutationUpdateUserArgs[] | false, alias?: string  } 
  | { name: 'updateManyUsers', args?: MutationUpdateManyUsersArgs[] | false, alias?: string  } 
  | { name: 'upsertUser', args?: MutationUpsertUserArgs[] | false, alias?: string  } 
  | { name: 'deleteUser', args?: MutationDeleteUserArgs[] | false, alias?: string  } 
  | { name: 'deleteManyUsers', args?: MutationDeleteManyUsersArgs[] | false, alias?: string  } 

type MutationFields =
  | 'createComment'
  | 'updateComment'
  | 'updateManyComments'
  | 'upsertComment'
  | 'deleteComment'
  | 'deleteManyComments'
  | 'createPost'
  | 'updatePost'
  | 'updateManyPosts'
  | 'upsertPost'
  | 'deletePost'
  | 'deleteManyPosts'
  | 'createUser'
  | 'updateUser'
  | 'updateManyUsers'
  | 'upsertUser'
  | 'deleteUser'
  | 'deleteManyUsers'


type MutationCreateCommentArgs =
  | 'data'
type MutationUpdateCommentArgs =
  | 'data'
  | 'where'
type MutationUpdateManyCommentsArgs =
  | 'data'
  | 'where'
type MutationUpsertCommentArgs =
  | 'where'
  | 'create'
  | 'update'
type MutationDeleteCommentArgs =
  | 'where'
type MutationDeleteManyCommentsArgs =
  | 'where'
type MutationCreatePostArgs =
  | 'data'
type MutationUpdatePostArgs =
  | 'data'
  | 'where'
type MutationUpdateManyPostsArgs =
  | 'data'
  | 'where'
type MutationUpsertPostArgs =
  | 'where'
  | 'create'
  | 'update'
type MutationDeletePostArgs =
  | 'where'
type MutationDeleteManyPostsArgs =
  | 'where'
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
  createComment: {
    args: Record<MutationCreateCommentArgs, ArgDefinition>
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { data: CommentCreateInput }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Comment> | prisma.Comment;
  }
  updateComment: {
    args: Record<MutationUpdateCommentArgs, ArgDefinition>
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { data: CommentUpdateInput, where: CommentWhereUniqueInput }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Comment | null> | prisma.Comment | null;
  }
  updateManyComments: {
    args: Record<MutationUpdateManyCommentsArgs, ArgDefinition>
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { data: CommentUpdateManyMutationInput, where?: CommentWhereInput | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.BatchPayload> | prisma.BatchPayload;
  }
  upsertComment: {
    args: Record<MutationUpsertCommentArgs, ArgDefinition>
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { where: CommentWhereUniqueInput, create: CommentCreateInput, update: CommentUpdateInput }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Comment> | prisma.Comment;
  }
  deleteComment: {
    args: Record<MutationDeleteCommentArgs, ArgDefinition>
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { where: CommentWhereUniqueInput }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Comment | null> | prisma.Comment | null;
  }
  deleteManyComments: {
    args: Record<MutationDeleteManyCommentsArgs, ArgDefinition>
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { where?: CommentWhereInput | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.BatchPayload> | prisma.BatchPayload;
  }
  createPost: {
    args: Record<MutationCreatePostArgs, ArgDefinition>
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { data: PostCreateInput }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Post> | prisma.Post;
  }
  updatePost: {
    args: Record<MutationUpdatePostArgs, ArgDefinition>
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { data: PostUpdateInput, where: PostWhereUniqueInput }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Post | null> | prisma.Post | null;
  }
  updateManyPosts: {
    args: Record<MutationUpdateManyPostsArgs, ArgDefinition>
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { data: PostUpdateManyMutationInput, where?: PostWhereInput | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.BatchPayload> | prisma.BatchPayload;
  }
  upsertPost: {
    args: Record<MutationUpsertPostArgs, ArgDefinition>
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { where: PostWhereUniqueInput, create: PostCreateInput, update: PostUpdateInput }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Post> | prisma.Post;
  }
  deletePost: {
    args: Record<MutationDeletePostArgs, ArgDefinition>
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { where: PostWhereUniqueInput }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Post | null> | prisma.Post | null;
  }
  deleteManyPosts: {
    args: Record<MutationDeleteManyPostsArgs, ArgDefinition>
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "Mutation">,
      args: { where?: PostWhereInput | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.BatchPayload> | prisma.BatchPayload;
  }
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
  | { name: 'comment', args?: SubscriptionCommentArgs[] | false, alias?: string  } 
  | { name: 'post', args?: SubscriptionPostArgs[] | false, alias?: string  } 
  | { name: 'user', args?: SubscriptionUserArgs[] | false, alias?: string  } 

type SubscriptionFields =
  | 'comment'
  | 'post'
  | 'user'


type SubscriptionCommentArgs =
  | 'where'
type SubscriptionPostArgs =
  | 'where'
type SubscriptionUserArgs =
  | 'where'
  

export interface SubscriptionFieldDetails<GenTypes = GraphQLNexusGen> {
  comment: {
    args: Record<SubscriptionCommentArgs, ArgDefinition>
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "Subscription">,
      args: { where?: CommentSubscriptionWhereInput | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.CommentSubscriptionPayload | null> | prisma.CommentSubscriptionPayload | null;
  }
  post: {
    args: Record<SubscriptionPostArgs, ArgDefinition>
    description: string
    list: false
    nullable: true
    resolve: (
      root: RootValue<GenTypes, "Subscription">,
      args: { where?: PostSubscriptionWhereInput | null }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.PostSubscriptionPayload | null> | prisma.PostSubscriptionPayload | null;
  }
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
  

// Types for CommentSubscriptionPayload

type CommentSubscriptionPayloadObject =
  | CommentSubscriptionPayloadFields
  | { name: 'mutation', args?: [] | false, alias?: string  } 
  | { name: 'node', args?: [] | false, alias?: string  } 
  | { name: 'updatedFields', args?: [] | false, alias?: string  } 
  | { name: 'previousValues', args?: [] | false, alias?: string  } 

type CommentSubscriptionPayloadFields =
  | 'mutation'
  | 'node'
  | 'updatedFields'
  | 'previousValues'



  

export interface CommentSubscriptionPayloadFieldDetails<GenTypes = GraphQLNexusGen> {
  mutation: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "CommentSubscriptionPayload">,
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
      root: RootValue<GenTypes, "CommentSubscriptionPayload">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Comment | null> | prisma.Comment | null;
  }
  updatedFields: {
    args: {}
    description: string
    list: true
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "CommentSubscriptionPayload">,
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
      root: RootValue<GenTypes, "CommentSubscriptionPayload">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.CommentPreviousValues | null> | prisma.CommentPreviousValues | null;
  }
}
  

// Types for CommentPreviousValues

type CommentPreviousValuesObject =
  | CommentPreviousValuesFields
  | { name: 'id', args?: [] | false, alias?: string  } 
  | { name: 'content', args?: [] | false, alias?: string  } 

type CommentPreviousValuesFields =
  | 'id'
  | 'content'



  

export interface CommentPreviousValuesFieldDetails<GenTypes = GraphQLNexusGen> {
  id: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "CommentPreviousValues">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
  }
  content: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "CommentPreviousValues">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
  }
}
  

// Types for PostSubscriptionPayload

type PostSubscriptionPayloadObject =
  | PostSubscriptionPayloadFields
  | { name: 'mutation', args?: [] | false, alias?: string  } 
  | { name: 'node', args?: [] | false, alias?: string  } 
  | { name: 'updatedFields', args?: [] | false, alias?: string  } 
  | { name: 'previousValues', args?: [] | false, alias?: string  } 

type PostSubscriptionPayloadFields =
  | 'mutation'
  | 'node'
  | 'updatedFields'
  | 'previousValues'



  

export interface PostSubscriptionPayloadFieldDetails<GenTypes = GraphQLNexusGen> {
  mutation: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "PostSubscriptionPayload">,
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
      root: RootValue<GenTypes, "PostSubscriptionPayload">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.Post | null> | prisma.Post | null;
  }
  updatedFields: {
    args: {}
    description: string
    list: true
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "PostSubscriptionPayload">,
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
      root: RootValue<GenTypes, "PostSubscriptionPayload">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<prisma.PostPreviousValues | null> | prisma.PostPreviousValues | null;
  }
}
  

// Types for PostPreviousValues

type PostPreviousValuesObject =
  | PostPreviousValuesFields
  | { name: 'id', args?: [] | false, alias?: string  } 
  | { name: 'title', args?: [] | false, alias?: string  } 
  | { name: 'content', args?: [] | false, alias?: string  } 

type PostPreviousValuesFields =
  | 'id'
  | 'title'
  | 'content'



  

export interface PostPreviousValuesFieldDetails<GenTypes = GraphQLNexusGen> {
  id: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "PostPreviousValues">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
  }
  title: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "PostPreviousValues">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
  }
  content: {
    args: {}
    description: string
    list: false
    nullable: false
    resolve: (
      root: RootValue<GenTypes, "PostPreviousValues">,
      args: {  }  ,
      context: ContextValue<GenTypes>,
      info?: GraphQLResolveInfo
    ) => Promise<string> | string;
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
  


export interface CommentWhereUniqueInput {
  id?: string | null
}
  
export interface PostWhereInput {
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
  title?: string | null
  title_not?: string | null
  title_in: string[]
  title_not_in: string[]
  title_lt?: string | null
  title_lte?: string | null
  title_gt?: string | null
  title_gte?: string | null
  title_contains?: string | null
  title_not_contains?: string | null
  title_starts_with?: string | null
  title_not_starts_with?: string | null
  title_ends_with?: string | null
  title_not_ends_with?: string | null
  content?: string | null
  content_not?: string | null
  content_in: string[]
  content_not_in: string[]
  content_lt?: string | null
  content_lte?: string | null
  content_gt?: string | null
  content_gte?: string | null
  content_contains?: string | null
  content_not_contains?: string | null
  content_starts_with?: string | null
  content_not_starts_with?: string | null
  content_ends_with?: string | null
  content_not_ends_with?: string | null
  comments_every?: CommentWhereInput | null
  comments_some?: CommentWhereInput | null
  comments_none?: CommentWhereInput | null
  AND: PostWhereInput[]
  OR: PostWhereInput[]
  NOT: PostWhereInput[]
}
  
export interface CommentWhereInput {
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
  author?: UserWhereInput | null
  content?: string | null
  content_not?: string | null
  content_in: string[]
  content_not_in: string[]
  content_lt?: string | null
  content_lte?: string | null
  content_gt?: string | null
  content_gte?: string | null
  content_contains?: string | null
  content_not_contains?: string | null
  content_starts_with?: string | null
  content_not_starts_with?: string | null
  content_ends_with?: string | null
  content_not_ends_with?: string | null
  AND: CommentWhereInput[]
  OR: CommentWhereInput[]
  NOT: CommentWhereInput[]
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
  posts_every?: PostWhereInput | null
  posts_some?: PostWhereInput | null
  posts_none?: PostWhereInput | null
  AND: UserWhereInput[]
  OR: UserWhereInput[]
  NOT: UserWhereInput[]
}
  
export interface PostWhereUniqueInput {
  id?: string | null
}
  
export interface UserWhereUniqueInput {
  id?: string | null
}
  
export interface CommentCreateInput {
  author: UserCreateOneInput
  content: string
}
  
export interface UserCreateOneInput {
  create?: UserCreateInput | null
  connect?: UserWhereUniqueInput | null
}
  
export interface UserCreateInput {
  name: string
  posts?: PostCreateManyInput | null
}
  
export interface PostCreateManyInput {
  create: PostCreateInput[]
  connect: PostWhereUniqueInput[]
}
  
export interface PostCreateInput {
  title: string
  content: string
  comments?: CommentCreateManyInput | null
}
  
export interface CommentCreateManyInput {
  create: CommentCreateInput[]
  connect: CommentWhereUniqueInput[]
}
  
export interface CommentUpdateInput {
  author?: UserUpdateOneRequiredInput | null
  content?: string | null
}
  
export interface UserUpdateOneRequiredInput {
  create?: UserCreateInput | null
  update?: UserUpdateDataInput | null
  upsert?: UserUpsertNestedInput | null
  connect?: UserWhereUniqueInput | null
}
  
export interface UserUpdateDataInput {
  name?: string | null
  posts?: PostUpdateManyInput | null
}
  
export interface PostUpdateManyInput {
  create: PostCreateInput[]
  update: PostUpdateWithWhereUniqueNestedInput[]
  upsert: PostUpsertWithWhereUniqueNestedInput[]
  delete: PostWhereUniqueInput[]
  connect: PostWhereUniqueInput[]
  disconnect: PostWhereUniqueInput[]
  deleteMany: PostScalarWhereInput[]
  updateMany: PostUpdateManyWithWhereNestedInput[]
}
  
export interface PostUpdateWithWhereUniqueNestedInput {
  where: PostWhereUniqueInput
  data: PostUpdateDataInput
}
  
export interface PostUpdateDataInput {
  title?: string | null
  content?: string | null
  comments?: CommentUpdateManyInput | null
}
  
export interface CommentUpdateManyInput {
  create: CommentCreateInput[]
  update: CommentUpdateWithWhereUniqueNestedInput[]
  upsert: CommentUpsertWithWhereUniqueNestedInput[]
  delete: CommentWhereUniqueInput[]
  connect: CommentWhereUniqueInput[]
  disconnect: CommentWhereUniqueInput[]
  deleteMany: CommentScalarWhereInput[]
  updateMany: CommentUpdateManyWithWhereNestedInput[]
}
  
export interface CommentUpdateWithWhereUniqueNestedInput {
  where: CommentWhereUniqueInput
  data: CommentUpdateDataInput
}
  
export interface CommentUpdateDataInput {
  author?: UserUpdateOneRequiredInput | null
  content?: string | null
}
  
export interface CommentUpsertWithWhereUniqueNestedInput {
  where: CommentWhereUniqueInput
  update: CommentUpdateDataInput
  create: CommentCreateInput
}
  
export interface CommentScalarWhereInput {
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
  content?: string | null
  content_not?: string | null
  content_in: string[]
  content_not_in: string[]
  content_lt?: string | null
  content_lte?: string | null
  content_gt?: string | null
  content_gte?: string | null
  content_contains?: string | null
  content_not_contains?: string | null
  content_starts_with?: string | null
  content_not_starts_with?: string | null
  content_ends_with?: string | null
  content_not_ends_with?: string | null
  AND: CommentScalarWhereInput[]
  OR: CommentScalarWhereInput[]
  NOT: CommentScalarWhereInput[]
}
  
export interface CommentUpdateManyWithWhereNestedInput {
  where: CommentScalarWhereInput
  data: CommentUpdateManyDataInput
}
  
export interface CommentUpdateManyDataInput {
  content?: string | null
}
  
export interface PostUpsertWithWhereUniqueNestedInput {
  where: PostWhereUniqueInput
  update: PostUpdateDataInput
  create: PostCreateInput
}
  
export interface PostScalarWhereInput {
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
  title?: string | null
  title_not?: string | null
  title_in: string[]
  title_not_in: string[]
  title_lt?: string | null
  title_lte?: string | null
  title_gt?: string | null
  title_gte?: string | null
  title_contains?: string | null
  title_not_contains?: string | null
  title_starts_with?: string | null
  title_not_starts_with?: string | null
  title_ends_with?: string | null
  title_not_ends_with?: string | null
  content?: string | null
  content_not?: string | null
  content_in: string[]
  content_not_in: string[]
  content_lt?: string | null
  content_lte?: string | null
  content_gt?: string | null
  content_gte?: string | null
  content_contains?: string | null
  content_not_contains?: string | null
  content_starts_with?: string | null
  content_not_starts_with?: string | null
  content_ends_with?: string | null
  content_not_ends_with?: string | null
  AND: PostScalarWhereInput[]
  OR: PostScalarWhereInput[]
  NOT: PostScalarWhereInput[]
}
  
export interface PostUpdateManyWithWhereNestedInput {
  where: PostScalarWhereInput
  data: PostUpdateManyDataInput
}
  
export interface PostUpdateManyDataInput {
  title?: string | null
  content?: string | null
}
  
export interface UserUpsertNestedInput {
  update: UserUpdateDataInput
  create: UserCreateInput
}
  
export interface CommentUpdateManyMutationInput {
  content?: string | null
}
  
export interface PostUpdateInput {
  title?: string | null
  content?: string | null
  comments?: CommentUpdateManyInput | null
}
  
export interface PostUpdateManyMutationInput {
  title?: string | null
  content?: string | null
}
  
export interface UserUpdateInput {
  name?: string | null
  posts?: PostUpdateManyInput | null
}
  
export interface UserUpdateManyMutationInput {
  name?: string | null
}
  
export interface CommentSubscriptionWhereInput {
  mutation_in: prisma.MutationType[]
  updatedFields_contains?: string | null
  updatedFields_contains_every: string[]
  updatedFields_contains_some: string[]
  node?: CommentWhereInput | null
  AND: CommentSubscriptionWhereInput[]
  OR: CommentSubscriptionWhereInput[]
  NOT: CommentSubscriptionWhereInput[]
}
  
export interface PostSubscriptionWhereInput {
  mutation_in: prisma.MutationType[]
  updatedFields_contains?: string | null
  updatedFields_contains_every: string[]
  updatedFields_contains_some: string[]
  node?: PostWhereInput | null
  AND: PostSubscriptionWhereInput[]
  OR: PostSubscriptionWhereInput[]
  NOT: PostSubscriptionWhereInput[]
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
  | 'PostOrderByInput'
  | 'CommentOrderByInput'
  | 'UserOrderByInput'
  | 'MutationType'
  

export interface PluginTypes {
  fields: {
    Query: QueryObject
    Comment: CommentObject
    User: UserObject
    Post: PostObject
    CommentConnection: CommentConnectionObject
    PageInfo: PageInfoObject
    CommentEdge: CommentEdgeObject
    AggregateComment: AggregateCommentObject
    PostConnection: PostConnectionObject
    PostEdge: PostEdgeObject
    AggregatePost: AggregatePostObject
    UserConnection: UserConnectionObject
    UserEdge: UserEdgeObject
    AggregateUser: AggregateUserObject
    Mutation: MutationObject
    BatchPayload: BatchPayloadObject
    Subscription: SubscriptionObject
    CommentSubscriptionPayload: CommentSubscriptionPayloadObject
    CommentPreviousValues: CommentPreviousValuesObject
    PostSubscriptionPayload: PostSubscriptionPayloadObject
    PostPreviousValues: PostPreviousValuesObject
    UserSubscriptionPayload: UserSubscriptionPayloadObject
    UserPreviousValues: UserPreviousValuesObject
  }
  fieldsDetails: {
    Query: QueryFieldDetails
    Comment: CommentFieldDetails
    User: UserFieldDetails
    Post: PostFieldDetails
    CommentConnection: CommentConnectionFieldDetails
    PageInfo: PageInfoFieldDetails
    CommentEdge: CommentEdgeFieldDetails
    AggregateComment: AggregateCommentFieldDetails
    PostConnection: PostConnectionFieldDetails
    PostEdge: PostEdgeFieldDetails
    AggregatePost: AggregatePostFieldDetails
    UserConnection: UserConnectionFieldDetails
    UserEdge: UserEdgeFieldDetails
    AggregateUser: AggregateUserFieldDetails
    Mutation: MutationFieldDetails
    BatchPayload: BatchPayloadFieldDetails
    Subscription: SubscriptionFieldDetails
    CommentSubscriptionPayload: CommentSubscriptionPayloadFieldDetails
    CommentPreviousValues: CommentPreviousValuesFieldDetails
    PostSubscriptionPayload: PostSubscriptionPayloadFieldDetails
    PostPreviousValues: PostPreviousValuesFieldDetails
    UserSubscriptionPayload: UserSubscriptionPayloadFieldDetails
    UserPreviousValues: UserPreviousValuesFieldDetails
  }
  enumTypesNames: enumTypesNames
}

declare global {
  interface GraphQLNexusGen extends PluginTypes {}
}
  