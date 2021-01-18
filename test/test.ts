import * as request from 'supertest';
import { runServer } from '../src/server';
import { expect } from 'chai';

import { checkToken } from '../src/crypto';
import { getRepository, Repository } from 'typeorm';
import { User } from '../src/entity/User';


let usersRepo: Repository<User>;
before(async () => {
  try {
    await runServer();
    usersRepo = getRepository(User);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});
=======

const url = `http://localhost:${process.env.SERVERPORT}/`;


describe('Query test', () => {
  before(async () => {
    try {
      await runServer();
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  });
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
    const newUser = usersRepo.create({
      name: 'Fulano',
      email: 'fulano@email.com',
      birthDate: '1444-01-01',
      cpf: '0',
      password: 'AwnLfl1zsnvUDHeXnhKHFfUjTekcoXRDp6336GRSWRg=',
    });
    await usersRepo.save(newUser);
  });

  afterEach(async () => {
    usersRepo.clear();
  });

  it('should return user "Fulano"', async () => {
    const query = {
      query: `mutation{
        login(email:"fulano@email.com", password: "dumb_password", rememberMe: true){
          user{
            name
          },
          token
        }
      }`,
    };
    const response = await request(url).post('').send(query);
    checkToken(response.body.data.login.token);
    expect(response.body.data.login.user.name).to.be.eq('Fulano');
  });
});
