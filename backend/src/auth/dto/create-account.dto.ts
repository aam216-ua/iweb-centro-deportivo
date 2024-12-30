import {
  IsEmail,
  IsPhoneNumber,
  IsStrongPassword,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateAccountDto {
  @IsEmail()
  email: string;

  @IsPhoneNumber('ES')
  phone: string;

  @Length(2, 256)
  name: string;

  @Length(2, 256)
  surname: string;

  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minLowercase: 1,
    minUppercase: 1,
  })
  @MaxLength(64)
  password: string;
}
