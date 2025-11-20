import type { Response as ExpressResponse } from 'express'

export type ResponseBody<T>
  = | {
    status: 'success' | 'fail'
    data: T
  }
  | {
    status: 'error'
    message: string
  }

export type Response<T> = ExpressResponse<ResponseBody<T>>
