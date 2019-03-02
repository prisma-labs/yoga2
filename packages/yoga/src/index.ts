import * as ApolloServer from 'apollo-server-express'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { InputConfig, Yoga } from './types'
import { core } from 'nexus/dist'
import { Application } from 'express'

export * from 'nexus'
export * from 'nexus-prisma'
export { ApolloServer }

export function config(opts: InputConfig) {
  return opts
}

export function eject<T extends any = any>(opts: Yoga<T>) {
  return opts
}

export function express(fn: (app: Application) => core.MaybePromise<void>) {
  return fn
}

export function context(ctx: ((ctx: ExpressContext) => object) | object) {
  return ctx
}
