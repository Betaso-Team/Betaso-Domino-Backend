/**
 * Tipos para las configuraciones del juego
 */

export interface GameTimeouts {
  matchmaking: number // Tiempo de búsqueda de oponente (ms)
  playerTurn: number // Tiempo de turno del jugador (ms)
  playerExtra: number // Tiempo extra del jugador (ms)
}

export interface GameSettings {
  _id?: string

  // Tiempos de configuración
  matchmakingTimeout: number
  playerTurnTimeout: number
  playerExtraTimeout: number

  // Metadatos
  version: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateGameSettingsRequest {
  matchmakingTimeout?: number
  playerTurnTimeout?: number
  playerExtraTimeout?: number
  version?: string
}

export interface UpdateGameSettingsRequest extends Partial<CreateGameSettingsRequest> {
  isActive?: boolean
}

/**
 * Constantes para validación de tiempos
 */
export const TIMEOUT_LIMITS = {
  MATCHMAKING: {
    MIN: 30, // 30 segundos
    MAX: 600, // 10 minutos
    DEFAULT: 120, // 2 minutos
  },
  PLAYER_TURN: {
    MIN: 15, // 15 segundos
    MAX: 300, // 5 minutos
    DEFAULT: 60, // 1 minuto
  },
  PLAYER_EXTRA: {
    MIN: 10, // 10 segundos
    MAX: 120, // 2 minutos
    DEFAULT: 30, // 30 segundos
  },
} as const

/**
 * Configuración por defecto del juego
 */
export const DEFAULT_GAME_SETTINGS: Omit<GameSettings, '_id' | 'createdAt' | 'updatedAt'> = {
  matchmakingTimeout: TIMEOUT_LIMITS.MATCHMAKING.DEFAULT,
  playerTurnTimeout: TIMEOUT_LIMITS.PLAYER_TURN.DEFAULT,
  playerExtraTimeout: TIMEOUT_LIMITS.PLAYER_EXTRA.DEFAULT,
  version: '1.0.0',
  isActive: true,
}
