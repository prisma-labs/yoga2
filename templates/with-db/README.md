## Getting started



Run the following command to bootstrap the example

```bash
yarn create yoga
```

Then select the `db-yoga` template

```
? Choose a GraphQL server template? 
  minimal-yoga (Basic starter template ) 
❯ db-yoga (Template with Prisma database support)
```

Once this is done, `cd` in the created directory, and run

```bash
yarn prisma deploy
```

For a quicker startup, choose `Demo server`

```bash
? Set up a new Prisma server or deploy to an existing server? 
  Use existing database      Connect to existing database 
  Create new database        Set up a local database using Docker 
                         
  Or deploy to an existing Prisma server:
❯ Demo server                Hosted demo environment incl. database 
```

You're good to go, simply run `yarn dev` and the server will start 🙌