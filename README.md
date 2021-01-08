# onboard-jorge-risco

## Project's description

nodeJS GraphQL server ([apollo-server](https://www.apollographql.com/docs/apollo-server/)) with [typeORM](https://typeorm.io/#/), running with a [PostgreSQL](https://www.postgresql.org/about/) database in a [docker](https://www.docker.com/) container.

## Environment and tools

Environment:

- [Typescript](https://www.npmjs.com/package/typescript)
- [nodeJS v15.5.1](https://nodejs.org/en/)
- [apollo-server](https://www.apollographql.com/docs/apollo-server/)
- [typeORM](https://typeorm.io/#/)
- [docker v20.10.2](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/about/)

Dev Tools:

- [ESLint](https://www.npmjs.com/package/eslint)
- [Prettier](https://www.npmjs.com/package/prettier)

Both **ESLint** and **Prettier** are being used according to this [template](https://github.com/indigotech/template-node)'s config files.

## Steps to run and debug

In order to run this project, **first** check if you have **nodeJS** properly installed on your machine by typing `node -v` into a terminal. Also make sure your **docker** instalation is OK by typing `docker -v`.

1. Clone the project. `git clone https://github.com/indigotech/onboard-jorge-risco.git`
2. Install the dependencies. `npm install`
3. Run `docker-compose up` on the root folder to start the container.
4. Type `npm run build:dev` if you desire to test the connection through an example request.
5. Type `npm start` to run `src/server.ts`

Step 3 will execute `src/index.ts` using [nodemon](https://www.npmjs.com/package/nodemon), which can be useful in eventual debugging scenarios.
