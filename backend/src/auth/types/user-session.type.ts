import { UserRole } from 'src/users/enums/user-role.enum';

export type UserSession = {
  id: string;
  role: UserRole;
};
