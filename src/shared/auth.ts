import * as jwt from 'jsonwebtoken';
import config from 'config';
import { SecretConfig } from '../shared/interfaces/config.interface';

export function generateAccessToken(id: string): string {
  const secret: SecretConfig = config.get('auth');
  // token expires in one hour
  let exp = Math.floor(Date.now() / 1000) + 60 * 60;
  let iat = Math.floor(Date.now() / 1000);
  let payload = {
    sub: id,
    exp,
    iat,
  };
  const token = jwt.sign(payload, secret.privateKey);
  return token;
}
