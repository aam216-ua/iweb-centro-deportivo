import { IsEnum } from 'class-validator';
import { UserRole } from 'src/users/enums/user-role.enum';

export class GrantRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
