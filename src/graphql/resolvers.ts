export const resolvers = {
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
