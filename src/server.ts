import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    hello: String
    goodbye: String
  }

  type User {
    id: ID
    name: String
    email: String
    birthDate: String
    cpf: String
  }

  type LoginResponse {
    user: User
    token: Int
  }

  type Mutation {
    login(email: String, password: String): LoginResponse
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    goodbye: () => 'Goodbye world!',
  },
  Mutation: {
    login(_, args) {
      return {
        user: { id: 123, birthDate: '2020-01-01', email: args.email, cpf: '62693406080' },
        token: 12,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
