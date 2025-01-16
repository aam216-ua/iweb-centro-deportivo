import type { GetAllParams, PaginatedResponse } from "@/types/api"
import type { User } from "@/types/user"
import { Role, Status } from "@/types/user"
import { api } from "./api"

export const usersService = {
  async get(id: string) {
    const { data } = await api.get<User>(`/users/${id}`)
    return data
  },

  async getAll(params?: GetAllParams) {
    const { data } = await api.get<PaginatedResponse<User>>("/users", {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
      },
    })
    return data
  },

  async delete(id: string) {
    return api.delete(`/users/${id}`)
  },

  async updateRole(id: string, role: Role) {
    return api.post(`/auth/grant/${id}/role`, { role })
  },

  async updateStatus(id: string, status: Status) {
    return api.post(`/auth/grant/${id}/status`, { status })
  },
}
