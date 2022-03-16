# My Pets API ![My Pets API version](https://img.shields.io/github/package-json/v/nicolasomar/my-pets-api?color=success&label=%20&style=flat-square) ![My Pets API Coverage](https://img.shields.io/codecov/c/github/nicolasomar/my-pets-api?label=%20&logo=codecov&style=flat-square)
GraphQL server based on NodeJs to give back-end support a web client based on [React](https://my-pets-prod.netlify.app/).

## What do I need?
Before cloning this repo, I recommend installing the following software:
- [Node](https://nodejs.org/en/download/) >=12.16.1 to install packages
- [MongoDB](https://www.mongodb.com/download-center/community) >=4.2.3 to have a local database
- [Robo 3T](https://robomongo.org/download) to visualize data on your Mongo Database

## Setup
After cloning the repo, go to the created folder and install the node packages.
```sh
git clone https://github.com/NicolasOmar/my-pets-api.git
cd my-pets-api
npm install
```

## How to run it
To run it correctly (as a non-stopping server using local environment variables), I modified the `start` command by adding [nodemon](https://www.npmjs.com/package/nodemon) and [env-cmd](https://www.npmjs.com/package/env-cmd). So just run the following line:
```sh
npm start
```
After start the server, you can access the GraphQL Plauground through the [local link](http://localhost:4000/graphql).

## Folder structure
Once you have cloned the repo, it will show you the following folders:
- `.github:` [Github Actions](https://github.com/features/actions) files used to run post-merge.
- `env:` Environment variables.
- `public:` Contains only a `css` folder for specific home page styling.
- `scripts:` Location of the `update-version.js` file, responsible of update package's version on each push.
- `src`
  - `constants:` JSON files used for static values.
  - `db:` Connection to the Mongo database trough [Mongoose](https://mongoosejs.com/) as well as its Model declarations.
  - `functions:` Helper methods related to encryption and data parsing.
  - `graphql:` Server configuration based on [Apollo GraphQl](https://www.apollographql.com/) connection with its Schemas and Resolver declarations.
- `templates:` Structure dedicated to show a start page based in [Moustache.js](https://github.com/janl/mustache.js). Shows links of other useful sites related to the project.
- `tests:` Specific Jest configurations to test using a custom Mongoose connection.

## Find out more
| [Project Status](https://github.com/users/NicolasOmar/projects/1/views/1) | [Storybook site](https://my-pets-storybook.netlify.app/) | [React Repo](https://github.com/NicolasOmar/my-pets) |
| :--- | :--- | :--- |
| Trello board for project status tracking | Site dedicated to show and test all the created components | React front-end repository |

## License
**MIT**