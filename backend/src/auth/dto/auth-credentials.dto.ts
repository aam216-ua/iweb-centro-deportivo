import { IsStrongPassword, MaxLength, IsEmail } from 'class-validator';

export class AuthCredentialsDto {
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
}
