import type { NextFunction, Request, Response } from 'express'

import { Jwt } from '../auth/auth'
import { db } from '../database/db'

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string
    iat: number
    exp: number
  }
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no proporcionado' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = await Jwt.verify(token)

    req.user = decoded
    next()
  }
  catch (error) {
    console.error('Error al verificar token:', error)
    return res.status(401).json({ message: 'Token inválido' })
  }
}

export async function isAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(403).json({
      message: 'Acceso denegado: usuario no autenticado',
    })
  }

  try {
    const user = await db
      .selectFrom('public.user')
      .where('uuid', '=', req.user.sub)
      .select('role')
      .executeTakeFirst()

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
      })
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        message: 'Acceso denegado: se requieren permisos de administrador',
      })
    }

    next()
  }
  catch (error) {
    console.error('Error al verificar rol de usuario:', error)
    return res.status(500).json({
      message: 'Error al verificar permisos de usuario',
    })
  }
}
