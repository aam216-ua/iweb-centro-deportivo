import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserStatus } from 'src/users/enums/user-status.enum';

export class GrantStatusDto {
  @ApiProperty({
    description: 'Nuevo estado del usuario',
    enum: UserStatus,
    example: 'blocked',
  })
  @IsEnum(UserStatus)
  status: UserStatus;
}
