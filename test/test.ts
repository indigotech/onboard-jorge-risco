import * as request from 'supertest';
import { runServer } from '../src/server';
import { expect } from 'chai';
import { signJWT } from '../src/crypto';
import { getRepository, Repository } from 'typeorm';
import { User } from '../src/entity/User';
import { validateEmail } from '../src/validation';
import * as testUser from './test_users';
import { checkResponse, checkError } from './expectors';

let usersRepo: Repository<User>;
const fulano = testUser.Fulano;
const ciclano = testUser.Ciclano;
const newGuy = testUser.newGuy;

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
    await addUser(fulano);
    await addUser(ciclano);
  });

  afterEach(async () => {
    await usersRepo.clear();
  });

  it('should return user "Fulano"', async () => {
    const query = requestLogin(fulano.email, fulano.password, false);
    const response = await request(url).post('').send(query);

    expect(validateEmail(fulano.email)).to.be.eq(true);
    checkResponse('login', response, fulano);
  });

  it('should return error: "Invalid email format"', async () => {
    const email = '---___---===1203';
    const password = fulano.password;
    const query = requestLogin(email, password, false);

    await request(url).post('').send(query);

    const response = await request(url).post('').send(query);
    expect(response.body.errors[0].message).to.be.eq('Invalid email format.');
  });
  it('[wrong password] should return error: "Wrong credentials"', async () => {
    const email = fulano.email;
    const password = 'WRONG-PASSWORD!';
    const query = requestLogin(email, password, false);

    await request(url).post('').send(query);

    const response = await request(url).post('').send(query);

    const errorCode = 422;
    const errorName = 'BAD_USER_INPUT';
    const errorMessage = 'Wrong credentials.';
    checkError(response, errorCode, errorName, errorMessage);
  });
  it('[wrong email] should return error: "Wrong credentials"', async () => {
    const email = 'random@email.com';
    const password = fulano.password;
    const query = requestLogin(email, password, false);

    await request(url).post('').send(query);

    const response = await request(url).post('').send(query);

    const errorCode = 422;
    const errorName = 'BAD_USER_INPUT';
    const errorMessage = 'Wrong credentials.';
    checkError(response, errorCode, errorName, errorMessage);
  });
  it('should input valid token and then create a new user', async () => {
    const token = signJWT(1, false);
    const email = 'newguy@email.com';
    const query = createUserRequest(newGuy, token);

    const response = await request(url).post('').send(query);
    const user = await getRepository(User).findOne({
      where: { email },
    });
    checkResponse('createUser', response, user);
  });
  it('[Expired token] should return expired token error when trying to create user', async () => {
    const token: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjc5OCwiaWF0IjoxNjExMDc1NDQ0LCJleHAiOjE2MTEwNzU1NjR9.BcHGkTDMIkB8RdAwIaLT04gO8O2J6RrCsfFlp9hAFEQ';

    //Creating user

    const query = createUserRequest(newGuy, token);

    const response = await request(url).post('').send(query);

    const errorCode = 401;
    const errorName = 'UNAUTHENTICATED';
    const errorMessage = 'Expired or invalid token, please log in again.';
    checkError(response, errorCode, errorName, errorMessage);
  });
  it('should return "Email already used', async () => {
    const token = signJWT(1, false);
    const query = createUserRequest(fulano, token);
    const response = await request(url).post('').send(query);

    const errorCode = 403;
    const errorName = 'FORBIDDEN';
    const errorMessage = 'Email already used, try another email address.';
    checkError(response, errorCode, errorName, errorMessage);
  });
});

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
function createUserRequest(user, token: string) {
  return {
    query: `mutation{
      createUser(
        token:"${token}",
        name:"${user.name}",
        email:"${user.email}",
        birthDate:"${user.birthDate}",
        cpf:"${user.cpf}",
        password:"${user.password}"
      ) {
        id
        name
        email
        birthDate
        cpf
      }
      }`,
  };
}
async function addUser(user) {
  const newUser = usersRepo.create({
    name: user.name,
    email: user.email,
    birthDate: user.birthDate,
    cpf: user.cpf,
    password: user.hashedPassword,
  });
  await usersRepo.save(newUser);
}
