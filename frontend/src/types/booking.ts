export enum BookingTurn {
  TURN_08_00 = "08:00",
  TURN_09_30 = "09:30",
  TURN_11_00 = "11:00",
  TURN_12_30 = "12:30",
  TURN_14_00 = "14:00",
  TURN_15_30 = "15:30",
  TURN_17_00 = "17:00",
  TURN_18_30 = "18:30",
  TURN_20_00 = "20:00",
  TURN_21_30 = "21:30",
}

export interface CreateBookingData {
  date: string
  fee: number
  turn: BookingTurn
  appointerId: string
  appointeeId: string
  venueId: string
}

export interface Booking extends CreateBookingData {
  id: string
  createdAt: string
  updatedAt: string
  venue?: {
    id: string
    name: string
  }
  appointee?: {
    id: string
    name: string
  }
  appointer?: {
    id: string
    name: string
  }
}
