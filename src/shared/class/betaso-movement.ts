import type { BetasoGameMovementType } from '../enums/betaso-game-movement.enum'
import type { Currency } from '../enums/currency.enum'
import type { TransactionTypes } from '../enums/transaction.enum'

export class CreateBetasoMovementDto {
  userId!: string

  tokenId!: string

  reason!: string

  amount!: number

  currency!: Currency

  transactionType!: TransactionTypes

  gameMovementType!: BetasoGameMovementType

  bet?: number
}
