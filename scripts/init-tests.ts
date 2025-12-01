import 'tsconfig-paths/register'
import '@babel/register'
// APP AND SERVER IMPORTS
import express from 'express';
import cors from 'cors';
import { expressMiddleware } from '@as-integrations/express5';
// APOLLO SERVER AND MONGOOSE INSTANCE
import { server, app } from '../src/server/server'
import '../src/db/mongoose'
// ENVIRONMENTS VARIABLES
const { PORT } = process.env

export default async () => {
  await server.start()
  app.use('/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );
  app.listen(PORT)
}