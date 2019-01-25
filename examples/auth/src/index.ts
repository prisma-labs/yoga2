import * as path from 'path'
import { makeSchema, Yoga } from 'yoga'
import { ApolloServer } from 'apollo-server-express'
import context from './context'
import * as types from './graphql'

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const user = { name: "admin", password: "admin" };
passport.use(new LocalStrategy(function(username: any, password: any, done: any) {
  if (username === user.name && password === user.password) {
    return done(null, user);
  }
  return done("No user");
}));
passport.serializeUser(function(user: any, done: any) {
  done(null, user.id);
});

passport.deserializeUser(function(id: any, done: any) {
  done(null, user);
});

export default {
  server: dirname => {
    const schema = makeSchema({
      types,
      outputs: {
        schema: path.join(dirname, './generated/nexus.graphql'),
        typegen: path.join(dirname, './generated/nexus.ts'),
      },
      typegenAutoConfig: {
        sources: [
          {
            module: path.join(dirname, './context.ts'),
            alias: 'ctx',
          },
        ],
        contextType: 'ctx.Context',
      },
    })
    const server = new ApolloServer({
      schema,
      context,
      tracing: false,
      introspection: false,
    })
    server.applyMiddleware(app)
    return server;
  },
  startServer: server =>
    server.listen().then(s => console.log(`Server listening at ${s.url}`)),
  stopServer: server => server.stop(),
} as Yoga<ApolloServer>
