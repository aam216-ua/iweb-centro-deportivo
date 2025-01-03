import type { GetAllParams, PaginatedResponse } from "@/types/api"
import type { CreateVenueData, Venue } from "@/types/venue"
import { api } from "./api"

export interface VenueQueryParams extends GetAllParams {
  activityId?: string
  maxFee?: number
  minCapacity?: number
  status?: string
}

export const venuesService = {
  async get(id: string) {
    const { data } = await api.get<Venue>(`/venues/${id}`)
    return data
  },

  async getAll(params?: VenueQueryParams) {
    const { data } = await api.get<PaginatedResponse<Venue>>("/venues", {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        activityId: params?.activityId,
        maxFee: params?.maxFee,
        minCapacity: params?.minCapacity,
        status: params?.status,
      },
    })
    return data
  },

  async create(venueData: CreateVenueData) {
    const { data } = await api.post<Venue>("/venues", venueData)
    return data
  },

  async update(id: string, venueData: Partial<CreateVenueData>) {
    const { data } = await api.patch<Venue>(`/venues/${id}`, venueData)
    return data
  },

  async delete(id: string) {
    return api.delete(`/venues/${id}`)
  },
}
