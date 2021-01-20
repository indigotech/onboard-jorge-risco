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
    await addUser('Fulano', 'fulano@email.com', '1444-01-01', '1', 'arX9hAzm1KP18VqkBkw/CSuyhtPjOjo21Z4PdHM5f7Y=');
    await addUser('Ciclano', 'ciclano@email.com', '1444-01-01', '2', 'arX9hAzm1KP18VqkBkw/CSuyhtPjOjo21Z4PdHM5f7Y=');
  });

  afterEach(async () => {
    await usersRepo.clear();
  });

  it('should return user "Fulano"', async () => {
    const email = 'fulano@email.com';
    const password = 'dumb_password123';
    const query = requestLogin(email, password, false);

    const response = await request(url).post('').send(query);

    expect(validateEmail(email)).to.be.eq(true);
    expect(checkToken(response.body.data.login.token)).to.be.eq(true);
    expect(response.body.data.login.user.name).to.be.eq('Fulano');
    expect(response.body.data.login.user.email).to.be.eq('fulano@email.com');
    expect(response.body.data.login.user.birthDate).to.be.eq('1444-01-01');
    expect(response.body.data.login.user.cpf).to.be.eq('1');
  });

  it('should return error: "Invalid email format"', async () => {
    const email = '---___---===1203';
    const password = 'dumb_password123';
    const query = requestLogin(email, password, false);

    await request(url).post('').send(query);

    const response = await request(url).post('').send(query);
    expect(response.body.errors[0].message).to.be.eq('Invalid email format.');
  });
  it('[wrong password] should return error: "Wrong credentials"', async () => {
    const email = 'fulano@email.com';
    const password = 'WRONG-PASSWORD!';
    const query = requestLogin(email, password, false);

    await request(url).post('').send(query);

    const response = await request(url).post('').send(query);
    expect(response.body.errors[0].code).to.be.eq('INTERNAL_SERVER_ERROR');
    expect(response.body.errors[0].message).to.be.eq('Wrong credentials.');
  });
  it('[wrong email] should return error: "Wrong credentials"', async () => {
    const email = 'random@email.com';
    const password = 'dumb_password123';
    const query = requestLogin(email, password, false);

    await request(url).post('').send(query);

    const response = await request(url).post('').send(query);
    expect(response.body.errors[0].code).to.be.eq('INTERNAL_SERVER_ERROR');
    expect(response.body.errors[0].message).to.be.eq('Wrong credentials.');
  });
  it('should log in and then create a new user', async () => {
    //Logging in
    const email = 'fulano@email.com';
    const password = 'dumb_password123';
    const query = requestLogin(email, password, false);

    const response = await request(url).post('').send(query);
    const token: string = response.body.data.login.token;

    expect(checkToken(token)).to.be.eq(true);
    //Creating user

    const query2 = createUserRequest(token);

    const response2 = await request(url).post('').send(query2);

    expect(response2.body.data.createUser.name).to.be.eq('NewGuy');
    expect(response2.body.data.createUser.email).to.be.eq('newguy@email.com');
    expect(response2.body.data.createUser.birthDate).to.be.eq('01-01-01');
    expect(response2.body.data.createUser.cpf).to.be.eq('3');
  });
  it('[Expired token] should return expired token error when trying to create user', async () => {
    //Logging in
    const email = 'fulano@email.com';
    const password = 'dumb_password123';
    const query = requestLogin(email, password, false);

    const response = await request(url).post('').send(query);
    const token: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjc5OCwiaWF0IjoxNjExMDc1NDQ0LCJleHAiOjE2MTEwNzU1NjR9.BcHGkTDMIkB8RdAwIaLT04gO8O2J6RrCsfFlp9hAFEQ';

    //Creating user

    const query2 = createUserRequest(token);

    const response2 = await request(url).post('').send(query2);

    expect(response2.body.errors[0].code).to.be.eq('INTERNAL_SERVER_ERROR');
    expect(response2.body.errors[0].message).to.be.eq('Expired or invalid token, please log in again.');
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
function createUserRequest(token: string) {
  return {
    query: `mutation{
      createUser(
        token:"${token}",
        name:"NewGuy",
        email:"newguy@email.com",
        birthDate:"01-01-01",
        cpf:"3",
        password:"dumb_password123"
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
