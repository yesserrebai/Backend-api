import HttpException from '../../exceptions/httpException';
import RegisterUserDto from './dtos/registerUser.dto';
import UserModel from './user.model';

export default class UserService {
  // this function will return access token also
  static registerUser = async (
    registerUser: RegisterUserDto,
  ): Promise<Object> => {
    try {
      const user = new UserModel(registerUser);
      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      throw new HttpException(500, 'Something went wrong');
    }
  };
}
