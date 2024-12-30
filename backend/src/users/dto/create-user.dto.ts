import { Length, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsPhoneNumber('ES')
  phone: string;

  @Length(2, 256)
  name: string;

  @Length(2, 256)
  surname: string;
}
