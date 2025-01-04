import type { GetAllParams, PaginatedResponse } from "@/types/api"
import type { Booking, CreateBookingData } from "@/types/booking"
import { api } from "./api"

export interface BookingQueryParams extends GetAllParams {
  appointeeId?: string
  appointerId?: string
  venueId?: string
  after?: string
  before?: string
  sort?: "ASC" | "DESC"
}

export const bookingsService = {
  async get(id: string) {
    const { data } = await api.get<Booking>(`/bookings/${id}`)
    return data
  },

  async getAll(params?: BookingQueryParams) {
    const { data } = await api.get<PaginatedResponse<Booking>>("/bookings", {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        appointeeId: params?.appointeeId,
        appointerId: params?.appointerId,
        venueId: params?.venueId,
        after: params?.after,
        before: params?.before,
        sort: params?.sort,
      },
    })
    return data
  },

  async create(bookingData: CreateBookingData) {
    const { data } = await api.post<Booking>("/bookings", bookingData)
    return data
  },

  async update(id: string, bookingData: Partial<CreateBookingData>) {
    const { data } = await api.patch<Booking>(`/bookings/${id}`, bookingData)
    return data
  },

  async delete(id: string) {
    return api.delete(`/bookings/${id}`)
  },
}
