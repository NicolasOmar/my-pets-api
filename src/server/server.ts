// npm install @apollo/server express graphql cors
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import { readFileSync } from 'fs'
// RESOLVERS SPLITED BY OPERATIONS
import Query from '@resolvers/Queries'
import Mutation from '@resolvers/Mutations'
import Relationships from '@resolvers/Relationships'
import { User } from 'src/graphql/generated/resolved'
// MODELS
// import User from '../db/models/user.model'
// CONSTANTS
// import { ERROR_MSGS, HTTP_CODES } from '@constants/errors'
// SCHEMAS SPLITED BY CONCERNS
const EntityTypes = readFileSync('./src/graphql/schemas/Entities.gql', { encoding: 'utf-8' })
const PayloadTypes = readFileSync('./src/graphql/schemas/Payloads.gql', { encoding: 'utf-8' })
const ResponseTypes = readFileSync('./src/graphql/schemas/Responses.gql', { encoding: 'utf-8' })
const OperationTypes = readFileSync('./src/graphql/schemas/Operations.gql', { encoding: 'utf-8' })

interface AuthContext {
  loggedUser?: User
  token?: string
}

const app = express()
const httpServer = http.createServer(app)
const server = new ApolloServer<AuthContext>({
  typeDefs: [EntityTypes, PayloadTypes, ResponseTypes, OperationTypes],
  resolvers: { Query, Mutation, ...Relationships },
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

export { server, httpServer, app }
