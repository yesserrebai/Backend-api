import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from 'config';
import { SecretConfig } from '../shared/interfaces/config.interface';
import { CustomRequest } from '../shared/interfaces/customRequest.interface';

export function authMiddleware(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  const secret: SecretConfig = config.get('auth');
  const token = req.headers['authorization']?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secret.privateKey);
    req.userId = decoded.sub?.toString();
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
