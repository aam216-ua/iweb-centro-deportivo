import { ApiProperty } from '@nestjs/swagger';
import {
  IsStrongPassword,
  Length,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Correo del usuario',
    type: 'string',
    example: 'customer@ua.es',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    type: 'string',
    example: 'Password123#',
    maxLength: 64,
  })
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minLowercase: 1,
    minUppercase: 1,
  })
  @MaxLength(64)
  password: string;

  @ApiProperty({
    description: 'Nombre real del usuario',
    type: 'string',
    example: 'Juan',
    minLength: 2,
    maxLength: 256,
  })
  @Length(2, 256)
  name: string;

  @ApiProperty({
    description: 'Apellidos del usuario',
    type: 'string',
    example: 'Rodríguez Bartolomeo',
    minLength: 2,
    maxLength: 256,
  })
  @Length(2, 256)
  surname: string;

  @ApiProperty({
    description: 'Numero de teléfono español',
    type: 'string',
    example: '+34 966 00 00 00',
  })
  @IsPhoneNumber('ES')
  phone: string;
}
