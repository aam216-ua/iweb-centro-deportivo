import type { User } from "@/types/user"
import { api } from "./api"

export const userService = {
  async get(id: string) {
    const { data } = await api.get<User>(`/users/${id}`)
    return data
  },
}
