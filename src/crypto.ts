const crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  key = 'fjdsaoiIJI';

export function encrypt(text) {
  const cipher = crypto.createCipher(algorithm, key);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

export function decrypt(text) {
  const decipher = crypto.createDecipher(algorithm, key);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}
