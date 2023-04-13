/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import HttpException from '../exceptions/httpException';

export default (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.log('error', '', err);
  res.status(err.status || 500).json({ message: err.message });
};
