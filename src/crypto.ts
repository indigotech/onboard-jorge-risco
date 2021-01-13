import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
require('dotenv').config();

const privateKey: string = process.env.JWTKEY;

export function hash(data: string, salt: string): string {
  const unhashedString = data + salt;
  const hashedString: string = crypto.createHash('sha256').update(unhashedString).digest('base64');
  return hashedString;
}

export function signJWT(userId: number, rememberMe: boolean) {
  const expirationSeconds = rememberMe ? 604800 : 120;
  const token = jwt.sign({ userID: userId }, privateKey, { expiresIn: expirationSeconds });
  return token;
}
