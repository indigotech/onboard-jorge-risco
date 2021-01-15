import * as request from 'supertest';
import { runServer } from '../src/server';
import { expect } from 'chai';

const url = `http://localhost:${process.env.SERVERPORT}/`;
import { checkToken } from '../src/crypto';

before(async () => {
  try {
    await runServer();
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

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
