export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterUserData {
  email: string
  nombre: string
  apellidos: string
  password: string
  confirmPassword: string
}

export interface User {
  id: number
  email: string
  nombre: string
  apellidos: string
  telefono: string
  saldo: number
}

export interface Facility {
  id: number
  nombre: string
  precio: number
}

export interface AuthResponse {
  token: string
  user: User
}
