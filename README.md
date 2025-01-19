# My Pets API
GraphQL server based on NodeJs to give back-end support a web client based on [React](https://my-pets-prod.netlify.app/).

## Table of contents

- [Status](#status)
- [Dependencies](#dependencies)
- [What do I need?](#what-do-i-need)
- [Setup](#setup)
- [How to run it](#how-to-run-it)
- [Folder structure](#folder-structure)
- [Find out more](#find-out-more)
- [License](#license)

## Status

![Project version][badge-repo-version]
[![Code Coverage][badge-code-coverage]][link-code-coverage]
[![Quality Gate Status][badge-soundcloud-quality]][link-soundcloud-status]
[![Maintainability Rating][badge-soundcloud-maintanibility]][link-soundcloud-status]
[![Security Rating][badge-soundcloud-security]][link-soundcloud-status]
[![Technical Debt][badge-soundcloud-tech-debt]][link-soundcloud-status]
[![Known Vulnerabilities][badge-snyk-status]][link-snyk-status]
![GitHub Repo stars][badge-github-repo-stars]
![GitHub commit activity][badge-github-commits]
![GitHub last commit][badge-github-last-commit]

[badge-repo-version]: https://img.shields.io/github/package-json/v/nicolasomar/my-pets-api?label=version&logo=npm&color=success
[badge-code-coverage]: https://img.shields.io/codecov/c/github/nicolasomar/my-pets-api?label=coverage&logo=codecov
[link-code-coverage]: https://app.codecov.io/gh/NicolasOmar/my-pets-api
[badge-soundcloud-quality]: https://sonarcloud.io/api/project_badges/measure?project=NicolasOmar_my-pets-api&metric=alert_status
[badge-soundcloud-maintanibility]: https://sonarcloud.io/api/project_badges/measure?project=NicolasOmar_my-pets-api&metric=sqale_rating
[badge-soundcloud-security]: https://sonarcloud.io/api/project_badges/measure?project=NicolasOmar_my-pets-api&metric=security_rating
[badge-soundcloud-tech-debt]: https://sonarcloud.io/api/project_badges/measure?project=NicolasOmar_my-pets-api&metric=sqale_index
[link-soundcloud-status]: https://sonarcloud.io/summary/new_code?id=NicolasOmar_my-pets-api
[badge-snyk-status]: https://snyk.io/test/github/nicolasomar/my-pets-api/badge.svg
[link-snyk-status]: https://snyk.io/test/github/nicolasomar/my-pets-api
[badge-github-repo-stars]: https://img.shields.io/github/stars/nicolasomar/my-pets-api?label=stars&logo=github&labelColor=535353&style=flat
[badge-github-commits]: https://img.shields.io/github/commit-activity/m/nicolasomar/my-pets-api?logo=github
[badge-github-last-commit]: https://img.shields.io/github/last-commit/nicolasomar/my-pets-api?logo=github

## Dependencies
![express dependency][badge-dependency-express]
![typescript dependency][badge-dependency-typescript]
![graphql dependency][badge-dependency-graphql]
![apollo-server dependency][badge-dependency-apollo-server]
![nodemon dependency][badge-dependency-nodemon]
![hbs dependency][badge-dependency-hbs]
![mongoose dependency][badge-dependency-mongoose]
![bcryptjs dependency][badge-dependency-bcryptjs]
![crypto-js dependency][badge-dependency-crypto-js]
![babel-node dependency][badge-dependency-babel-node]
![jest dependency][badge-dependency-jest]
![ts-jest dependency][badge-dependency-ts-jest]
![eslint dependency][badge-dependency-eslint]
![prettier dependency][badge-dependency-prettier]
![lint-staged dependency][badge-dependency-lint-staged]
![husky dependency][badge-dependency-husky]

[badge-dependency-express]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets-api/express/main?logo=express
[badge-dependency-typescript]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets-api/dev/typescript/main?logo=typescript
[badge-dependency-graphql]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets-api/graphql/main?logo=graphql
[badge-dependency-apollo-server]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets-api/apollo-server-express/main?logo=apollographql
[badge-dependency-nodemon]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets-api/dev/nodemon/main?logo=nodemon
[badge-dependency-hbs]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets-api/hbs/main?logo=hbs
[badge-dependency-mongoose]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets-api/mongoose/main?logo=mongoose
[badge-dependency-bcryptjs]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets-api/bcryptjs/main
[badge-dependency-crypto-js]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets-api/crypto-js/main
[badge-dependency-babel-node]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets-api/@babel/node/main?logo=babel
[badge-dependency-jest]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets-api/dev/jest/main?logo=jest
[badge-dependency-ts-jest]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets-api/dev/ts-jest/main?logo=ts-jest
[badge-dependency-eslint]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets-api/dev/eslint/main?logo=eslint
[badge-dependency-prettier]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets-api/dev/prettier/main?logo=prettier
[badge-dependency-lint-staged]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets-api/dev/lint-staged/main?logo=lint-staged
[badge-dependency-husky]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets-api/dev/husky/main?logo=husky

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
| [Project Status](https://github.com/users/NicolasOmar/projects/1/views/1) | [React Repo](https://github.com/NicolasOmar/my-pets) |
| :--- | :--- |
| Project board for project status tracking | React front-end repository |

## License
**MIT**