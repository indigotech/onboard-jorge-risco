import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    hello: String
    goodbye: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    goodbye: () => 'Goodbye world!',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
