/**
 * Interfaces para las configuraciones del juego
 */

import type { CreateGameSettingsRequest, GameTimeouts } from '../types/game-settings.type'

/**
 * Interface para el servicio de configuraciones del juego
 */
export interface IGameSettingsService {
  getActiveSettings: () => Promise<any>
  getTimeouts: () => Promise<GameTimeouts>
  createSettings: (data: CreateGameSettingsRequest) => Promise<any>
  updateActiveSettings: (data: any) => Promise<any>
  activateSettings: (settingsId: string) => Promise<any>
  deleteSettings: (settingsId: string) => Promise<boolean>
  getAllSettings: () => Promise<any[]>
}

/**
 * Interface para respuestas de la API
 */
export interface GameSettingsResponse {
  success: boolean
  data?: any
  error?: string
  message?: string
}

/**
 * Interface para validación de configuraciones
 */
export interface GameSettingsValidation {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}
