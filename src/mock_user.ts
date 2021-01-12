import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from './entity/User';

createConnection()
  .then(async (connection) => {
    console.log('Inserting a new user into the database...');
    const user = new User();
    user.name = 'Fulano';
    user.email = 'fulano@email.com';
    user.birthDate = '1444-01-01';
    user.cpf = '0000000001';
    user.password = 'AwnLfl1zsnvUDHeXnhKHFfUjTekcoXRDp6336GRSWRg==';
    await connection.manager.save(user);
    console.log(`Saved a new user with id: ${user.id} `);

    console.log('Loading users from the database...');
    const users = await connection.manager.find(User);
    console.log('Loaded users: ', users);

    console.log('Here you can setup and run express/koa/any other framework.');
  })
  .catch((error) => console.log(error));
