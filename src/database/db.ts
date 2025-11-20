import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'

import env from '@/env'

import type { Currency } from '../shared/enums/currency.enum'
import type { User } from '../shared/interfaces/user.interface'

export enum GameMovementType {
  TRUCO = 'truco',
}

export enum GameResultEnum {
  WIN = 'win',
  LOSE = 'lose',
}

export interface LastWinner {
  id?: number
  bet: number
  gameCurrency: Currency
  gameName: string
  gameStatus: GameResultEnum
  gameType: GameMovementType
  userName: string
  profilePicture: string
  win: number
  gameImage?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Database {
  'public.user': User
  'public.last_winners': LastWinner
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: env.POSTGRES_CONNECTION_STRING,
  }),
})

const db = new Kysely<Database>({
  dialect,
})

export { db }
