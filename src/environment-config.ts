export function environmentConfig() {
  switch (process.env.NODE_ENV) {
    case 'DEV':
      require('dotenv').config({ path: '.env.dev' });
    case 'TEST':
      require('dotenv').config({ path: '.env.test' });
  }
}
