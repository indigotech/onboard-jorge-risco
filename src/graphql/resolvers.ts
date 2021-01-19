import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { hash, signJWT } from '../crypto';
import { validateEmail } from '../validation';

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
      await validateCredentials(args.email, hash(args.password, email + XSALT));
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

async function validateCredentials(email: string, hashedPassword: string) {
  if (!validateEmail(email)) {
    throw new Error('Invalid email format.');
  }
  const userWithSameCredentials = await getRepository(User).findOne({ email, password: hashedPassword });
  if (!userWithSameCredentials) {
    throw new Error('Wrong credentials.');
  }
}
