import type { Client } from 'colyseus'

import { Room } from 'colyseus'

import { logger } from '@/logger'

import { DominoRoomState } from './schema/domino/domino-room-state'

export class DominoRoom extends Room<DominoRoomState> {
  state = new DominoRoomState()

  onCreate(options: any) {
    try {
      const gameModeId = options.gameModeId || options.uuid

      if (!gameModeId) {
        throw new Error('Game mode id is required')
      }
    }
    catch (error) {
      logger.error('❌ [DOMINO] Error en onCreate:', { error })
      throw error
    }
  }

  onJoin(client: Client) {
    try {
      const token = client.sessionId
      if (!token) {
        throw new Error('Token not found')
      }
    }
    catch (error) {
      logger.error('❌ [DOMINO] Error en onJoin:', { error })
      throw error
    }
  }

  onLeave(client: Client) {
    try {
      const token = client.sessionId
      if (!token) {
        throw new Error('Token not found')
      }
    }
    catch (error) {
      logger.error('❌ [DOMINO] Error en onLeave:', { error })
      throw error
    }
  }

  onDispose() {}

  onUncaughtException(err: Error, methodName: string) {
    logger.error('='.repeat(80))
    logger.error(`❌ ERROR NO CAPTURADO EN DOMINO ROOM - Método: ${methodName}`)
    logger.error('='.repeat(80))
    logger.error(`Error: ${err.message}`)
    if ('stack' in err && err.stack) {
      logger.error(`Stack: ${err.stack}`)
    }
  }
}
