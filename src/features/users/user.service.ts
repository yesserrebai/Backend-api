import HttpException from '../../exceptions/httpException';
import RegisterUserDto from './dtos/registerUser.dto';
import UserModel from './user.model';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '../../shared/auth';
import { AuthenticatedUser } from '../../shared/types';
import IUser from './user.interface';
import LoginUserDto from './dtos/loginUser.dto';
import UpdateUserDto from './dtos/updateUser.dto';

export default class UserService {
  static registerUser = async (
    registerUser: RegisterUserDto,
  ): Promise<AuthenticatedUser<IUser>> => {
    let isEmailUsed = await UserModel.findOne({
      email: registerUser.email,
    });
    if (isEmailUsed) {
      throw new HttpException(400, 'email already exists');
    }

    let plainPassword = registerUser.password;
    let hashedPassword = await bcrypt.hash(plainPassword, 10);
    registerUser.password = hashedPassword;

    const user = new UserModel(registerUser);
    await user.save();
    const fetchUser = await UserModel.findById(user._id);
    if (!fetchUser) {
      throw new HttpException(404, 'user not found');
    }

    const token: string = generateAccessToken(fetchUser?._id.toString());
    const result = {
      user: fetchUser,
      accessToken: token,
    };
    return result;
  };

  static loginUser = async (
    loginCred: LoginUserDto,
  ): Promise<AuthenticatedUser<IUser>> => {
    let fetchedUser = await UserModel.findOne({
      email: loginCred.email,
    }).select('+password');
    if (!fetchedUser) {
      throw new HttpException(401, 'Invalid email or password');
    }
    let user: IUser = fetchedUser;
    let passwordMatch: Boolean = false;
    if (user.password) {
      passwordMatch = await bcrypt.compare(loginCred.password, user.password);
    }

    if (!passwordMatch) {
      throw new HttpException(401, 'Invalid email or password');
    }
    user.password = '';

    const token: string = generateAccessToken(user._id.toString());
    const result = {
      user: user,
      accessToken: token,
    };
    return result;
  };
  /* static updateUser = async (payload:UpdateUserDto):Promise<IUser> => {

  }; */
}
