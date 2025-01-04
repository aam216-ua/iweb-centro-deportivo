import type { PaginatedResponse } from "@/types/api"
import type { Booking, BookingQueryParams, CreateBookingData } from "@/types/booking"
import { api } from "./api"

export const bookingService = {
  async create(bookingData: CreateBookingData) {
    const { data } = await api.post<Booking>("/bookings", bookingData)
    return data
  },

  async getAll(params?: BookingQueryParams) {
    const { data } = await api.get<PaginatedResponse<Booking>>("/bookings", {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        appointerId: params?.appointerId,
        appointeeId: params?.appointeeId,
        venueId: params?.venueId,
        after: params?.after?.toISOString(),
        before: params?.before?.toISOString(),
        sort: params?.sort,
      },
    })
    return data
  },

  async get(id: string) {
    const { data } = await api.get<Booking>(`/bookings/${id}`)
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
