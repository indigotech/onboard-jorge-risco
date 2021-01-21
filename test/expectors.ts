import { expect } from 'chai';
import { checkToken } from '../src/crypto';
import * as request from 'supertest';

export function checkResponse(queryType: string, response: request.Response, user) {
  switch (queryType) {
    case 'login': {
      expect(checkToken(response.body.data.login.token)).to.be.eq(true);
      expect(response.body.data.login.user.name).to.be.eq(user.name);
      expect(response.body.data.login.user.email).to.be.eq(user.email);
      expect(response.body.data.login.user.birthDate).to.be.eq(user.birthDate);
      expect(response.body.data.login.user.cpf).to.be.eq(user.cpf);
      break;
    }
    case 'createUser': {
      expect(response.body.data.createUser.name).to.be.eq(user.name);
      expect(response.body.data.createUser.email).to.be.eq(user.email);
      expect(response.body.data.createUser.birthDate).to.be.eq(user.birthDate);
      expect(response.body.data.createUser.cpf).to.be.eq(user.cpf);
      break;
    }
  }
}

export function checkError(response, errorCode, errorName, errorMessage) {
  expect(response.body.errors[0].code).to.be.eq(errorCode);
  expect(response.body.errors[0].error).to.be.eq(errorName);
  expect(response.body.errors[0].message).to.be.eq(errorMessage);
}
