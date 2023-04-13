import HttpException from '../../exceptions/httpException';
import RegisterUserDto from './dtos/registerUser.dto';
import UserModel from './user.model';

export default class UserService {
  // this function will return access token also
  static registerUser = async (
    registerUser: RegisterUserDto,
  ): Promise<Object> => {
    let isEmailUsed = await UserModel.findOne({ email: registerUser.email });
    if (isEmailUsed) {
      throw new HttpException(400, 'email already exists');
    }
    const user = new UserModel(registerUser);
    const savedUser = await user.save();
    return savedUser;
  };
}
