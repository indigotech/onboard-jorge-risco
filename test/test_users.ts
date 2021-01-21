import { hash } from '../src/crypto';

export class testUser {
  name: string;
  email: string;
  birthDate: string;
  cpf: string;
  password: string;
  hashedPassword: string;
  constructor(name: string, email: string, birthDate: string, cpf: string, password: string) {
    this.name = name;
    this.email = email;
    this.birthDate = birthDate;
    this.cpf = cpf;
    this.password = password;
    this.hashedPassword = hash(this.password, this.email);
  }
}

export const Fulano = new testUser('Fulano', 'fulano@email.com', '1444-01-01', '1', 'dumb_password123');
export const Ciclano = new testUser('Ciclano', 'ciclano@email.com', '1444-01-01', '2', 'dumb_password123');
export const newGuy = new testUser('newGuy', 'newguy@email.com', '01-01-01', '3', 'dumb_password123');
