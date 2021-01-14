import * as assert from 'assert';
import * as request from 'supertest';
import { runServer } from '../src/server';

const url = `http://localhost:4000/`;

before(async () => {
  try {
    await runServer();
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

describe('Query test', () => {
  it('should return "Hello world!"', async () => {
    const expected = 'Hello world!';

    const query = {
      query: `query{
        hello
      }`,
    };

    const response = await request(url).post('').send(query);
    assert.equal(response.body.data.hello, expected);
  });

  it('should return user "Siclano"', async () => {
    const expected = 'Siclano';

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
    assert.equal(response.body.data.login.user.name, expected);
  });
});
