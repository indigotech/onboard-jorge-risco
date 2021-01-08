import { gql } from 'apollo-server';

export const typeDefs = gql`
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
