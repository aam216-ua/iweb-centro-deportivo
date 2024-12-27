import { IsStrongPassword, MaxLength } from 'class-validator';

export class UpdateCredentialsDto {
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 0,
    minSymbols: 0,
    minLowercase: 0,
    minUppercase: 0,
  })
  @MaxLength(256)
  newPassword: string;
}
