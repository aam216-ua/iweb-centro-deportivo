export enum Role {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  RECEPTIONIST = "receptionist",
  CUSTOMER = "customer",
}

export enum Status {
  pendiente,
  activo,
  bloqueado,
  de_baja,
}

export interface User {
  id: string
  email: string
  name: string
  surname: string
  phone: string
  role: Role
  balance: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
