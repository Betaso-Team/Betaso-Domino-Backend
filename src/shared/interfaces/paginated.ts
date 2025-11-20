export interface Paginated<T> {
    hasNextPage: boolean
    hasPreviousPage: boolean
    page: number
    perPage: number
    totalPages: number
    totalItems: number
    items: T[]
  }