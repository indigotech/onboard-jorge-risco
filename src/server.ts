import { ApolloServer } from 'apollo-server';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { environmentConfig } from './environment-config';
import { createConnection } from 'typeorm';
environmentConfig();
console.log(`SELECTED ENVIRONMENT: ${process.env.ENVNAME}`);

export async function runServer() {
  const connection = await createConnection();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  try {
    const { url } = await server.listen();
    console.log(`Server ready at ${url}`);
  } catch (error) {
    console.log(`error: ${error.message}`);
  }
}

if (require.main === module) {
  runServer();
}
