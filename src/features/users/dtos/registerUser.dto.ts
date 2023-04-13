import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  Length,
  IsEnum,
  isISO31661Alpha2,
  Validate,
  IsMobilePhone,
  isMobilePhone,
} from 'class-validator';
import { role, gender, language } from '../user.enum';
import { Transform, TransformFnParams } from 'class-transformer';
export default class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(role)
  role: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(gender)
  gender: string;

  @IsNotEmpty()
  @IsString()
  @Validate(isISO31661Alpha2, {
    message: 'Invalid country code',
  })
  country: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  postalcode: string;

  @IsOptional()
  @Validate(isMobilePhone, { message: 'Invalid phone number' })
  @IsString()
  phonenumber: string;

  @IsNotEmpty()
  @IsEnum(language)
  @IsString()
  language: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => new Date(value))
  @IsDate()
  dateofbirth: Date;

  @IsOptional()
  @IsString()
  avatar: string;
}
