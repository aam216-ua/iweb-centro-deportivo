export interface GetAllParams {
  page?: number
  size?: number
}

export interface PaginatedResponse<T> {
  meta: {
    page: number
    size: number
    total: number
  }
  data: T[]
}
