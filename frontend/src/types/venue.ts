export interface Venue {
  id: string
  name: string
  description?: string
  capacity: number
  status: VenueStatus
  fee: number
  activity: {
    id: string
    name: string
  }
}

export enum VenueStatus {
  AVAILABLE = "available",
  UNAVAILABLE = "unavailable",
}

export interface CreateVenueData {
  name: string
  description?: string
  capacity: number
  fee: number
  activityId: string
  status?: VenueStatus
}
