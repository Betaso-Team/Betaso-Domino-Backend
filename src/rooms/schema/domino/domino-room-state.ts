import { Schema, type } from '@colyseus/schema'

export class DominoRoomState extends Schema {
  @type('string') token: string = ''
  @type('string') name: string = ''
  @type('number') prize: number = 0
  @type('number') entryFee: number = 0
  @type('number') multiplier: number = 0
  @type('number') playersQuantity: number = 0
  @type('number') pointsToWin: number = 15
  @type('string') status:
    | 'matching'
    | 'enqueued'
    | 'started'
    | 'finished'
    | 'canceled' = 'matching'

  @type('string') winnerId: string = ''
  @type('string') currentTurnPlayerId: string = ''
}
