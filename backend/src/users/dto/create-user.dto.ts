import {
  IsStrongPassword,
  Length,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minLowercase: 1,
    minUppercase: 1,
  })
  @MaxLength(64)
  password: string;

  @Length(2, 256)
  name: string;

  @Length(2, 256)
  surname: string;

  @IsPhoneNumber('ES')
  phone: string;
}
