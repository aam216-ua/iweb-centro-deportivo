import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsEmail } from 'class-validator';

export class AuthCredentialsDto {
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
  @MaxLength(64)
  password: string;
}
