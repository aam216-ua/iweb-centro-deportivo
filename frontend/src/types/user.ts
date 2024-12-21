export enum Role {
  no_socio,
  socio,
  recepcionista,
  web_master,
}

export enum Status {
  pendiente,
  activo,
  bloqueado,
  de_baja,
}

export interface User {
  id: number
  email: string
  nombre: string
  apellidos: string
  telefono: string
  privilegios: Role
  estado: Status
  saldo: number
}
