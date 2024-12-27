import { IsStrongPassword, MaxLength } from 'class-validator';

export class UpdateCredentialsDto {
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minLowercase: 1,
    minUppercase: 1,
  })
  @MaxLength(64)
  newPassword: string;
}
