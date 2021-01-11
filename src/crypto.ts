export function hash(data: string, salt: string): string {
  const unhashed_string = data + salt;
  const hashed_string: string = require('crypto').createHash('sha256').update(unhashed_string).digest('base64');
  return hashed_string;
}
