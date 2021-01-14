import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

export function hash(data: string, salt: string): string {
  const unhashedString = data + salt;
  const hashedString: string = crypto.createHash('sha256').update(unhashedString).digest('base64');
  return hashedString;
}

export function signJWT(userId: number, rememberMe: boolean) {
  const expirationSeconds = rememberMe ? 604800 : 120;
  const token = jwt.sign({ userID: userId }, process.env.JWTKEY, { expiresIn: expirationSeconds });
  return token;
}
