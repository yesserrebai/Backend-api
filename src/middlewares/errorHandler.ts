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
): Response<any, Record<string, any>> => {
  logger.log('error', '', err);
  return res.status(err.status || 500).json({ message: err.message });
};
