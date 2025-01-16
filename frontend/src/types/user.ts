export enum Role {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  RECEPTIONIST = "receptionist",
  CUSTOMER = "customer",
}

export enum Status {
  pending = "pending",
  created = "created",
  blocked = "blocked",
}

export interface User {
  id: string
  email: string
  name: string
  surname: string
  phone: string
  role: Role
  status: Status
  balance: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
