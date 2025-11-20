import jwt from 'jsonwebtoken'

import type { UserId } from '../shared/types/user.type'

export type JwtToken = string
export type JwtSecret = string
export interface JwtPayload {
  sub: UserId
  iat: number
  exp: number
}

export class Jwt {
  private static secret: JwtSecret

  static async verify(token: JwtToken) {
    if (!this.secret) {
      console.error('❌ JWT_SECRET no está definido!')
      throw new Error('JWT_SECRET is not defined')
    }

    if (!token) {
      throw new Error('Token is empty')
    }

    try {
      const decoded = jwt.verify(token, this.secret) as JwtPayload
      return decoded
    }
    catch (error) {
      console.error('❌ Token inválido:', error instanceof Error ? error.message : error)
      throw new Error('Invalid token')
    }
  }

  static setSecret(secret: JwtSecret) {
    if (!secret) {
      console.error('⚠️  Advertencia: Intentando establecer JWT_SECRET vacío')
    }
    else {
      console.log('✅ JWT_SECRET establecido correctamente')
    }
    this.secret = secret
  }
}
