import type {User} from "@/types/user"

export const userService = {
  async get(id: string) {
    const { data } = await api.get<User>(`/users/${id}`)
    return data
  },
}

