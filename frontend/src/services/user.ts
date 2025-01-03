import type { User } from "@/types/user"
import type { GetAllParams,PaginatedResponse} from "@/types/api"
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
        size: params?.size ?? 10
      }
    })
    return data
  }
}
