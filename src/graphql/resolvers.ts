import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { hash, signJWT } from '../crypto';

export const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    goodbye: () => 'Goodbye world!',
  },
  Mutation: {
    login: async (_, args) => {
      const email: string = args.email;
      const XSALT: string = process.env.XSALT;

      const usersRepository = getRepository(User);

      const user = await usersRepository.findOne({
        where: { email: args.email, password: hash(args.password, email + XSALT) },
      });

      const token: string = signJWT(user.id, args.rememberMe);

      return {
        user,
        token,
      };
    },
  },
};
