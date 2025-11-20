import { ArraySchema, Schema, type } from '@colyseus/schema'

// Nuevo schema para almacenar información de modos de juego
export class GameModeCount extends Schema {
  @type('string') gameModeName: string = ''
  @type('number') playerCount: number = 0
}

export class LobbyRoomState extends Schema {
  @type('number') totalPlayers: number = 0
  @type('number') playersInLobby: number = 0
  @type([GameModeCount]) gameModesCount = new ArraySchema<GameModeCount>()
}
