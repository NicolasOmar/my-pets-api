# Copilot Instructions for My Pets API

Welcome to the My Pets API codebase! This document provides essential guidelines for AI coding agents to be productive in this project. The project is a GraphQL server built with Node.js, TypeScript, and MongoDB, designed to support a React-based web client.

## Project Overview
- **Architecture**: The project follows a modular structure with clear separation of concerns:
  - `src/db`: MongoDB models and connection setup.
  - `src/graphql`: GraphQL schemas, resolvers, and related utilities.
  - `src/functions`: Helper functions for encryption, database operations, and data parsing.
  - `src/interfaces`: TypeScript interfaces for type safety.
  - `src/constants`: Centralized error messages and constants.
- **Data Flow**: The GraphQL resolvers interact with MongoDB models to fetch and manipulate data. Relationships between entities (e.g., users, pets, events) are managed using Mongoose.
- **Testing**: Jest is used for unit testing, with custom setup and teardown scripts for MongoDB.

## Developer Workflows
### Running the Project
1. Install dependencies: `npm install`
2. Start the server: `npm start`
   - The server runs on `http://localhost:4000/graphql`.

### Testing
- Run tests: `npm test`
- Test with coverage: `npm run test:ci`

### Building
- Compile TypeScript: `npm run compile:ts`
- Generate GraphQL types: `npm run compile:gql`
- Build the project: `npm run build`

### Database Operations
- Populate the database: `npm run db:create:local`
- Clear all tables: Use the `clearAllTables` function in `src/functions/dbOps.ts`.

## Project-Specific Conventions
- **Error Handling**: Use centralized error messages from `src/constants/errors.ts`.
- **Encryption**: Passwords are encrypted using `crypto-js` with the method and secret defined in environment variables.
- **GraphQL Resolvers**: Follow the structure in `src/graphql/resolvers`. Use `Mutations.ts` for write operations and `Queries.ts` for read operations.
- **Testing**: Mock data is stored in `src/functions/mocks`. Use these mocks for consistent test cases.

## Key Files and Directories
- `src/db/models`: MongoDB models for `User`, `Pet`, `Event`, etc.
- `src/graphql/resolvers`: GraphQL resolvers for handling API requests.
- `src/functions`: Utility functions for common operations.
- `src/interfaces`: TypeScript interfaces for entities and shared types.
- `scripts`: Scripts for initializing tests and generating the database.

## External Dependencies
- **MongoDB**: Database for storing application data.
- **Apollo Server**: GraphQL server implementation.
- **Crypto-JS**: Used for encryption and decryption.
- **Jest**: Testing framework.

## Tips for AI Agents
- **Follow Existing Patterns**: Adhere to the modular structure and naming conventions.
- **Use TypeScript Types**: Leverage the interfaces in `src/interfaces` to ensure type safety.
- **Centralized Constants**: Use `src/constants/errors.ts` for error messages.
- **Mock Data**: Use `src/functions/mocks` for consistent testing.

For any questions or clarifications, refer to the [README.md](../README.md) or the specific files mentioned above.