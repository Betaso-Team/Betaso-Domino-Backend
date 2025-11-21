// src/database/schemas/game-mode.schema.ts
import mongoose from 'mongoose'

export interface IGameMode {
  uuid: string
  name: string
  multiplier: number
  prize: number
  entryFee: number
  playersQuantity: 2 | 4
  pointsToWin: number
  isActive: boolean
  isFreeRoom: boolean
  createdAt: Date
  updatedAt: Date
}

const GameModeSchema = new mongoose.Schema<IGameMode>({
  uuid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  multiplier: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  prize: {
    type: Number,
    required: true,
    min: 0,
  },
  entryFee: {
    type: Number,
    required: true,
    min: 0,
  },
  playersQuantity: {
    type: Number,
    enum: [2, 4],
    required: true,
  },
  pointsToWin: {
    type: Number,
    required: true,
    default: 25,
    max: 100,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  isFreeRoom: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  collection: 'game_modes_domino',
})

// Índices para optimización
GameModeSchema.index({ isActive: 1, name: 1 })
GameModeSchema.index({ isActive: 1, uuid: 1 })

export const GameMode = mongoose.model<IGameMode>('GameMode', GameModeSchema)
