import * as ApolloServer from 'apollo-server-express'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import express from 'express'
import * as Http from 'http'
import * as logger from './logger'
import { InputConfig as YogaConfig, MaybePromise, Yoga } from './types'
import { injectCustomEnvironmentVariables } from './config'
import * as middleware from 'graphql-middleware'
export * from 'nexus'
export * from 'nexus-prisma'
export { ApolloServer, express, logger, middleware }


injectCustomEnvironmentVariables()

export function yogaConfig(opts: YogaConfig) {
  return opts
}

export function yogaEject<T = express.Application, U = Http.Server>(
  opts: Yoga<T, U>,
) {
  return opts
}

export function yogaExpress(
  fn: (app: express.Application) => MaybePromise<void>,
) {
  return fn
}

export function yogaContext(ctx: ((ctx: ExpressContext) => object) | object) {
  return ctx
}
