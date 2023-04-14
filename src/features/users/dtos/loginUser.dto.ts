import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

export default class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  @Length(8)
  password: string;
}
