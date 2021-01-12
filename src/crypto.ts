import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
require('dotenv').config();

const privateKey: string = process.env.JWTKEY;

export function hash(data: string, salt: string): string {
  const unhashedString = data + salt;
  const hashedString: string = crypto.createHash('sha256').update(unhashedString).digest('base64');
  return hashedString;
}

export function signJWT(userId: number) {
  const token = jwt.sign({ userID: userId }, privateKey, { expiresIn: 200 });
  return token;
}
