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
  isMobilePhone,
} from 'class-validator';
import { role, gender, language } from '../user.enum';
import { Transform, TransformFnParams } from 'class-transformer';
export default class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(8)
  password: string;

  @IsOptional()
  @IsString()
  firstname: string;

  @IsOptional()
  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  @IsEnum(gender)
  gender: string;

  @IsOptional()
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

  @IsOptional()
  @IsEnum(language)
  @IsString()
  language: string;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => new Date(value))
  @IsDate()
  dateofbirth: Date;

  @IsOptional()
  @IsString()
  avatar: string;
}
