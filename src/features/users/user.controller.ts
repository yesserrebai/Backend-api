import { Request, Response, Router } from 'express';
import { Controller } from '../../shared';
import UserService from './user.service';
import validationMiddleware from '../../middlewares/dataValidator';
import RegisterUserDto from './dtos/registerUser.dto';
import LoginUserDto from './dtos/loginUser.dto';

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
    this.route.post(
      '/login',
      validationMiddleware(LoginUserDto),
      this.loginUser,
    );
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    const registerUser: RegisterUserDto = req.body;
    const result = await UserService.registerUser(registerUser);
    res.status(201).send(result);
  }
  async loginUser(req: Request, res: Response): Promise<void> {
    const loginCred: LoginUserDto = req.body;
    const result = await UserService.loginUser(loginCred);
    res.status(200).send(result);
  }
}
