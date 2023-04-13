import HttpException from '../../exceptions/httpException';
import RegisterUserDto from './dtos/registerUser.dto';
import UserModel from './user.model';

export default class UserService {
  static registerUser = async (
    registerUser: RegisterUserDto,
  ): Promise<Object> => {
    try {
      const user = await UserModel.create(registerUser);
      return user;
    } catch (error) {
      return Promise.reject(
        new HttpException(
          500,
          JSON.stringify({ message: 'something went wrong' }),
        ),
      );
    }
  };
}
