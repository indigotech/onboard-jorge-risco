import * as crypto from 'crypto';

export function hash(data: string, salt: string): string {
  const unhashedString = data + salt;
  const hashedString: string = crypto.createHash('sha256').update(unhashedString).digest('base64');
  return hashedString;
}
