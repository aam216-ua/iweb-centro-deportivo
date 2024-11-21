export interface LoginCredentials {
  email: string
  password: string
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
