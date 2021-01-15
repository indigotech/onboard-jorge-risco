import { environmentConfig } from './src/environment-config';

environmentConfig();

module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: process.env.PORT,
  username: process.env.LOGIN,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  synchronize: true,
  logging: false,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
