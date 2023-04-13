import { Request, Response, Router } from 'express';
import { Controller } from '../../shared';
import UserService from './user.service';
import validationMiddleware from '../../middlewares/dataValidator';
import RegisterUserDto from './dtos/registerUser.dto';

export default class UserController implements Controller {
  path = '/users';
  route = Router();
  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.post(
      '/register',
      validationMiddleware(RegisterUserDto),
      this.registerUser,
    );
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    const registerUser: RegisterUserDto = req.body;
    const result = await UserService.registerUser(registerUser);
    res.status(201).send(result);
  }
}
