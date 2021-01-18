import * as request from 'supertest';
import { runServer } from '../src/server';
import { expect } from 'chai';

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

  it('should return user "Siclano"', async () => {
    const query = {
      query: `mutation{
        login(email:"siclano@email.com", password: "best_password_ever"){
          user{
            name
          }
        }
      }`,
    };
    const response = await request(url).post('').send(query);
    expect(response.body.data.login.user.name).to.be.eq('Siclano');
  });
});
