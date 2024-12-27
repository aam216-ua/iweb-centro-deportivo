import { MaxLength, IsEmail } from 'class-validator';

export class AuthCredentialsDto {
  @IsEmail()
  email: string;

  @MaxLength(64)
  password: string;
}
