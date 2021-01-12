import { getRepository, createConnection } from 'typeorm';
import { User } from '../entity/User';
import { hash, signJWT } from '../crypto';

export const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    goodbye: () => 'Goodbye world!',
  },
  Mutation: {
    login: async (_, args) => {
      let rememberMe: boolean;
      args.rememberMe ? (rememberMe = true) : (rememberMe = false);

      const email: string = args.email;
      const XSALT: string = process.env.XSALT;

      const connection = await createConnection();
      const usersRepository = getRepository(User);

      const user = await usersRepository.findOne({
        where: { email: args.email, password: hash(args.password, email + XSALT) },
      });

      const token: string = signJWT(user.id, rememberMe);

      await connection.close();

      return {
        user,
        token: token,
      };
    },
  },
};
