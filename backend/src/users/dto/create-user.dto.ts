import { UserRole } from '../entities/user.entity';
import {
  IsStrongPassword,
  Length,
  MaxLength,
  IsAlpha,
  IsEmail,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minNumbers: 0,
    minSymbols: 0,
    minLowercase: 0,
    minUppercase: 0,
  })
  @MaxLength(256)
  password: string;

  @IsAlpha()
  @Length(2, 256)
  name: string;

  @IsAlpha()
  @Length(2, 256)
  surname: string;

  @IsPhoneNumber('ES')
  phone: string;

  @IsEnum(UserRole)
  role: UserRole;
}
