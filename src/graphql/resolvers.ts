import { getRepository, createConnection } from 'typeorm';
import { User } from '../entity/User';
import { hash } from '../crypto';

export const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    goodbye: () => 'Goodbye world!',
  },
  Mutation: {
    login: async (_, args) => {
      const email: string = args.email;
      const XSALT: string = process.env.XSALT;

      const connection = await createConnection();
      const usersRepository = getRepository(User);

      const user = await usersRepository.findOne({
        where: { email: args.email, password: hash(args.password, email + XSALT) },
      });

      await connection.close();
      return {
        user: { id: user.id, birthDate: user.birthDate, email: user.email, cpf: user.cpf },
        token: 12,
      };
    },
  },
};
