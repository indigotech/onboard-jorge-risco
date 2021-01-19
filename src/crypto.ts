import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

export function hash(data: string, email: string): string {
  const unhashedString = data + email + process.env.XSALT;
  const hashedString: string = crypto.createHash('sha256').update(unhashedString).digest('base64');
  return hashedString;
}

export function signJWT(userId: number, rememberMe: boolean) {
  const expirationSeconds = rememberMe ? 604800 : 120;
  const token = jwt.sign({ userID: userId }, process.env.JWTKEY, { expiresIn: expirationSeconds });
  return token;
}

export function checkToken(token: string): boolean {
  let tokenInfo;
  let tokenExpiration;
  try {
    tokenInfo = getDecodedAccessToken(token);
    tokenExpiration = tokenInfo.exp;
  } catch (error) {
    throw new Error('Could not decode token. It might not be valid. Try logging in again to generate a new token.');
  }

  if (Date.now() <= tokenExpiration * 1000) {
    return true;
  } else {
    return false;
  }
}

function getDecodedAccessToken(token: string): any {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.log(error);
  }
}
