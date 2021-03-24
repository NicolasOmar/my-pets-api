# My Pets API ![My Pets APIversion](https://img.shields.io/github/package-json/v/nicolasomar/my-pets-api?color=success&label=%20&style=flat-square)
GraphQL API based on NodeJs to give middle/back-end support for a web client based on [React](https://my-pets-prod.netlify.app/).

## What do I need?
Before cloning this repo, I recommend installing the following software:
- [Node](https://nodejs.org/en/download/) >=12.16.1 to install packages
- [MongoDB](https://www.mongodb.com/download-center/community) >=4.2.3 to have a local database
- [Robo 3T](https://robomongo.org/download) to visualize data on your Mongo Database
- [Postman](https://www.postman.com/downloads/) to test the API

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
After start the server, you can access the Graph Plauground through the [local link](http://localhost:4000/graphql).

## License
**MIT**