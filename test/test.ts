import * as request from 'supertest';
import { runServer } from '../src/server';
import { expect } from 'chai';
import { checkToken, hash } from '../src/crypto';
import { getRepository, Repository } from 'typeorm';
import { User } from '../src/entity/User';
import { validateEmail } from '../src/validation';

let usersRepo: Repository<User>;
before(async () => {
  try {
    await runServer();
    usersRepo = getRepository(User);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

const url = `http://localhost:${process.env.SERVERPORT}/`;

describe('Query test', () => {
  it('should return "Hello world!"', async () => {
    const query = {
      query: `query{
        hello
      }`,
    };

    const response = await request(url).post('').send(query);
    expect(response.body.data.hello).to.be.eq('Hello world!');
  });
});

describe('Login Mutation test', async () => {
  beforeEach(async () => {
    await addUser('Fulano', 'fulano@email.com', '1444-01-01', '1', 'jAiLPQV92PZK9Aen8Bl54WDbpUk8LBN05dJsZC6+QfU=');
    await addUser('Ciclano', 'ciclano@email.com', '1444-01-01', '2', 'jAiLPQV92PZK9Aen8Bl54WDbpUk8LBN05dJsZC6+QfU=');
  });

  afterEach(async () => {
    await usersRepo.clear();
  });

  it('should return user "Fulano"', async () => {
    const email = 'fulano@email.com';
    const password = 'dumb_password';
    const hashedPassword = hash(password, email + process.env.XSALT);
    const query = requestLogin(email, password, false);
    await credentialValidation(email, hashedPassword);

    const response = await request(url).post('').send(query);

    expect(validateEmail(email)).to.be.eq(true);
    expect(checkToken(response.body.data.login.token)).to.be.eq(true);
    expect(response.body.data.login.user.name).to.be.eq('Fulano');
    expect(response.body.data.login.user.email).to.be.eq('fulano@email.com');
    expect(response.body.data.login.user.birthDate).to.be.eq('1444-01-01');
    expect(response.body.data.login.user.cpf).to.be.eq('1');
  });
});

async function credentialValidation(email: string, hashedPassword: string) {
  if (!validateEmail(email)) {
    throw new Error('Invalid email format.');
  }
  const userWithSameCredentials = await getRepository(User).findOne({ email, password: hashedPassword });
  if (!userWithSameCredentials) {
    throw new Error('Wrong credentials.');
  }
}

function requestLogin(email: string, password: string, rememberMe: boolean) {
  return {
    query: `mutation{
      login(email:"${email}" password:"${password}" rememberMe:${rememberMe}){
        user{
          name
          email
          birthDate
          cpf
          
        ,
        }
        token
      }
    
    
    }`,
  };
}

async function addUser(name: string, email: string, birthDate: string, cpf: string, password: string) {
  const newUser = usersRepo.create({
    name,
    email,
    birthDate,
    cpf,
    password,
  });
  await usersRepo.save(newUser);
}
