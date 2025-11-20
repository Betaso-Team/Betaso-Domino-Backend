import type { Client } from 'colyseus'

import { LobbyRoom as ColyseusLobbyRoom, matchMaker } from 'colyseus'
import * as cron from 'node-cron'

import { Jwt } from '@/auth/auth'

import { LobbyRoomState } from './schema/lobby/lobby-room-state'

export class LobbyRoom extends ColyseusLobbyRoom {
  state = new LobbyRoomState()
  private cleanupCronJob: cron.ScheduledTask | null = null

  async onCreate() {
    try {
      await super.onCreate({})
      this.state.totalPlayers = await this.countPlayers()
      this.state.playersInLobby = this.clients.length
      this.initCleanupCronJob()
    }
    catch (error) {
      console.error('❌ [LOBBY] Error en onCreate:', error)
      console.error('Stack:', error instanceof Error ? error.stack : 'No stack available')
      throw error
    }
  }

  async onJoin(client: Client, options: any) {
    try {
      await super.onJoin(client, options)
      this.state.totalPlayers = await this.countPlayers()
      this.state.playersInLobby = this.clients.length
    }
    catch (error) {
      console.error('❌ [LOBBY] Error en onJoin:', error)
      console.error('Stack:', error instanceof Error ? error.stack : 'No stack available')
    }
  }

  async onLeave(client: Client) {
    try {
      await super.onLeave(client)
      this.state.totalPlayers = await this.countPlayers()
      this.state.playersInLobby = this.clients.length
    }
    catch (error) {
      console.error('❌ [LOBBY] Error en onLeave:', error)
      console.error('Stack:', error instanceof Error ? error.stack : 'No stack available')
    }
  }

  static async onAuth(token: string) {
    try {
      if (!token) {
        console.error('❌ LOBBY: Conexión sin token')
        throw new Error('No token provided')
      }
      const jwtPayload = await Jwt.verify(token)
      return jwtPayload
    }
    catch (error) {
      console.error('❌ LOBBY: Error en onAuth:', error)
      throw error // Re-lanzar para que Colyseus lo maneje
    }
  }

  onUncaughtException(err: Error, methodName: string) {
    console.error('='.repeat(80))
    console.error(`❌ ERROR NO CAPTURADO EN LOBBY ROOM - Método: ${methodName}`)
    console.error('='.repeat(80))
    console.error('Error:', err)
    console.error('Stack:', err.stack)
    if (err.cause) {
      console.error('Cause:', err.cause)
    }
    if (err.message) {
      console.error('Message:', err.message)
    }
    console.error('='.repeat(80))

    // Importante: NO lanzar el error aquí, solo loguearlo
    // Si lanzamos el error, el servidor se caerá
    return false // Indica que el error fue manejado
  }

  async countPlayers() {
    try {
      let totalPlayers = 0

      this.state.gameModesCount.clear()

      const modesMap = new Map<string, number>()

      for (const room of this.rooms) {
        if (room && typeof room.clients === 'number') {
          totalPlayers += room.clients

          const modeName = room.name || 'unknown'
          modesMap.set(modeName, (modesMap.get(modeName) || 0) + room.clients)
        }
      }

      modesMap.forEach((count, modeName) => {
        const gameModeCount = new GameModeCount()
        gameModeCount.gameModeName = modeName
        gameModeCount.playerCount = count
        this.state.gameModesCount.push(gameModeCount)
      })

      return totalPlayers
    }
    catch (error) {
      console.error('❌ [LOBBY] Error en countPlayers:', error)
      return 0
    }
  }

  private initCleanupCronJob() {
    // Ejecutar cada 15 minutos
    this.cleanupCronJob = cron.schedule('*/15 * * * *', async () => {
      try {
        await this.cleanupInactiveRooms()
      }
      catch (error) {
        console.error('❌ Error en limpieza de salas:', error)
      }
    })

    console.log('✅ Cron job de limpieza iniciado en LobbyRoom')
  }

  private async cleanupInactiveRooms() {
    try {
      // Obtener todas las salas
      const allRooms = await matchMaker.query({})

      const fifteenMinutesAgo = Date.now() - (15 * 60 * 1000)

      // Filtrar solo salas de juego (excluir lobby)
      const gameRooms = allRooms.filter(room => room.name !== 'lobby')

      console.log(`🧹 Verificando ${gameRooms.length} salas de juego...`)

      let closedCount = 0

      for (const room of gameRooms) {
        try {
          const roomCreatedAt = new Date(room.createdAt).getTime()
          const roomAge = Date.now() - roomCreatedAt
          const isOld = roomCreatedAt < fifteenMinutesAgo
          const isEmpty = room.clients === 0

          // Si es vieja y está vacía, revisar el estado interno
          if (isOld && isEmpty) {
            try {
              // Obtener el estado interno de la sala usando remoteRoomCall
              const inspectData = await matchMaker.remoteRoomCall(
                room.roomId,
                'getInspectData',
              )

              const status = inspectData.state?.status

              // Estados válidos que NO deben cerrarse:
              // - 'matching': Sala buscando jugadores
              // - 'enqueued': Sala en cola
              // - 'initial_cards_dealt': Cartas iniciales repartidas
              // - 'started': Partida en curso
              // Estados que SÍ deben cerrarse:
              // - 'finished': Partida terminada
              // - 'canceled': Partida cancelada
              const isNotMatching = status !== 'matching'

              if (isNotMatching) {
                console.log(`🗑️ Cerrando sala inactiva: ${room.roomId}`)
                console.log(`  - Name: ${room.name}`)
                console.log(`  - Creada hace: ${Math.round(roomAge / 60000)} min`)
                console.log(`  - Clientes: ${room.clients}`)
                console.log(`  - Estado: ${status}`)
                console.log(`  - State Size: ${inspectData.stateSize} bytes`)

                await matchMaker.remoteRoomCall(room.roomId, 'disconnect', [])
                closedCount++
                console.log(`✅ Sala cerrada exitosamente`)
              }
              else {
                console.log(`⏭️ Sala ${room.roomId} preservada (estado: ${status})`)
              }
            }
            catch (inspectError) {
              // Si no se puede inspeccionar, probablemente ya está cerrada
              console.log(`⚠️ No se pudo inspeccionar sala ${room.roomId}, posiblemente ya cerrada ${inspectError}`)
            }
          }
        }
        catch (error) {
          console.error(`❌ Error procesando sala ${room.roomId}:`, error)
        }
      }

      console.log(`🎯 Limpieza completada: ${closedCount} salas cerradas de ${gameRooms.length} revisadas`)
    }
    catch (error) {
      console.error('❌ Error en cleanupInactiveRooms:', error)
    }
  }

  async onDispose() {
    if (this.cleanupCronJob) {
      this.cleanupCronJob.stop()
      this.cleanupCronJob = null
    }
    await super.onDispose()
  }
}
