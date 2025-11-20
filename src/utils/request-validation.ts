import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

import { ZodError } from 'zod'

interface RequestValidationSchema {
  body?: ZodType
  query?: ZodType
  params?: ZodType
}

export function validateRequest(schema: RequestValidationSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        schema.body.parse(req.body)
      }
      if (schema.query) {
        schema.query.parse(req.query)
      }
      if (schema.params) {
        schema.params.parse(req.params)
      }
      next()
    }
    catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Request validation failed',
          details: error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        })
        return
      }
      next(error)
    }
  }
}
