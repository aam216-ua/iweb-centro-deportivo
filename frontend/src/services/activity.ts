import type { Activity } from "@/types/activity"
import { api } from "./api"

export const activitiesService = {
  async getAll() {
    const { data } = await api.get<Activity[]>("/activities")
    return data
  },
}
