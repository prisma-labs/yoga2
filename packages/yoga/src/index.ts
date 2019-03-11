import * as ApolloServer from 'apollo-server-express'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import express from 'express'
import * as Http from 'http'
import { InputConfig as YogaConfig, Yoga, MaybePromise } from './types'

export * from 'nexus'
export * from 'nexus-prisma'
export { ApolloServer, express }

export function config(opts: YogaConfig) {
  return opts
}

export function eject<T = express.Application, U = Http.Server>(
  opts: Yoga<T, U>,
) {
  return opts
}

export function useExpress(
  fn: (app: express.Application) => MaybePromise<void>,
) {
  return fn
}

export function context<T>(ctx: ((ctx: ExpressContext) => T) | T) {
  return ctx
}
