// src/shared/dtos/game-mode.dto.ts
import { z } from 'zod'

export const CreateGameModeSchema = z.object({
  name: z.string()
    .min(3, 'Mínimo 3 caracteres'),
  multiplier: z.number()
    .min(1)
    .default(1),
  prize: z.number()
    .min(0)
    .int(),
  entryFee: z.number()
    .min(0)
    .int(),
  playersQuantity: z.enum(['2', '4'])
    .transform(val => Number(val)),
  pointsToWin: z.number()
    .max(100, 'Máximo 100 puntos')
    .default(10),
  isActive: z.boolean().optional().default(true),
  isFreeRoom: z.boolean().default(false),
})

export const UpdateGameModeSchema = CreateGameModeSchema.partial()

export const GameModeIdSchema = z.object({
  uuid: z.string().uuid('UUID inválido'),
})

export type CreateGameModeDto = z.infer<typeof CreateGameModeSchema>
export type UpdateGameModeDto = z.infer<typeof UpdateGameModeSchema>
