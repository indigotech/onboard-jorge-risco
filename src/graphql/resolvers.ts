import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { hash, signJWT, checkToken } from '../crypto';
import { validateEmail, validatePassowrd } from '../validation';

export const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    goodbye: () => 'Goodbye world!',
  },
  Mutation: {
    login: async (_, args) => {
      const usersRepository = getRepository(User);
      const email: string = args.email;

      await validateCredentials(args.email, hash(args.password, email));
      const user = await usersRepository.findOne({
        where: { email: args.email, password: hash(args.password, email) },
      });

      const token: string = signJWT(user.id, args.rememberMe);

      return {
        user,
        token,
      };
    },
    createUser: async (_, args) => {
      const usersRepository = getRepository(User);
      const token = args.token;
      const name = args.name;
      const email = args.email;
      const birthDate = args.birthDate;
      const cpf = args.cpf;
      const password = hash(args.password, args.email);

      checkToken(token);
      if (!validateEmail(email)) {
        throw new Error('Invalid email format.');
      }
      validatePassowrd(password);

      const userWithSameEmail = await usersRepository.findOne({
        where: { email },
      });
      if (userWithSameEmail) {
        throw new Error('Email already used, try another email address.');
      }

      const newUser = usersRepository.create({
        name,
        email,
        birthDate,
        cpf,
        password,
      });
      await usersRepository.save(newUser);

      const user = await usersRepository.findOne({
        where: { email, password },
      });

      return user;
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
