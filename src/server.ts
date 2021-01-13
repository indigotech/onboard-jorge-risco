import { ApolloServer } from 'apollo-server';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
require('dotenv').config();

export async function runServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  return server;
}

async function server() {
  const server = await runServer().then((server) => {
    server.listen().then(({ url }) => {
      console.log(`Server ready at ${url}`);
    });
  });
}

server();
