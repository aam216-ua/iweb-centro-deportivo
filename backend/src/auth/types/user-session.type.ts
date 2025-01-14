import { UserRole } from 'src/users/enums/user-role.enum';
import { UserStatus } from 'src/users/enums/user-status.enum';

export type UserSession = {
  id: string;
  role: UserRole;
  status: UserStatus;
};
