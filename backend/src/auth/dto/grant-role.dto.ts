import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole } from 'src/users/enums/user-role.enum';

export class GrantRoleDto {
  @ApiProperty({
    description: 'Nuevo rol del usuario',
    enum: ['customer', 'receptionist', 'admin', 'superadmin'],
    example: 'admin',
  })
  @IsEnum(UserRole)
  role: UserRole;
}
