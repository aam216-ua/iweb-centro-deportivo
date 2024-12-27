import { IsStrongPassword, MaxLength, IsEmail } from 'class-validator';

export class AuthCredentialsDto {
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
}
