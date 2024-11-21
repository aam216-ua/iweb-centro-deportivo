export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterUserData {
  email: string
  nombre: string
  apellido: string
  password: string
  confirmPassword: string
}

export interface User {
  id: number
  email: string
  name: string
  roles?: string[]
}

export interface AuthResponse {
  token: string
  user: User
}
