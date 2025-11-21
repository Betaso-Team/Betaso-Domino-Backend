import { v4 as uuidv4 } from 'uuid'

import type { IGameMode } from '@/database'
import type { CreateGameModeDto, UpdateGameModeDto } from '@/shared/dto/game-mode.dto'

import { GameMode } from '@/database'
import { logger } from '@/logger'

export class GameModeService {
  // Obtener todos activos
  static async getAllActive(): Promise<IGameMode[]> {
    try {
      return await GameMode.find({ isActive: true })
        .select('-__v')
        .sort({ entryFee: 1 })
        .lean()
    }
    catch (error) {
      logger.error('Error obteniendo modos activos:', { error })
      throw new Error('Error al obtener modos de juego')
    }
  }

  // Obtener todos (incluyendo inactivos)
  static async getAll(): Promise<IGameMode[]> {
    try {
      return await GameMode.find()
        .select('-__v')
        .sort({ createdAt: -1 })
        .lean()
    }
    catch (error) {
      logger.error('Error obteniendo todos los modos:', { error })
      throw new Error('Error al obtener modos de juego')
    }
  }

  // Obtener por UUID
  static async getByUuid(uuid: string): Promise<IGameMode | null> {
    try {
      return await GameMode.findOne({ uuid, isActive: true }).lean()
    }
    catch (error) {
      logger.error('Error obteniendo modo:', { error, uuid })
      throw new Error('Error al obtener modo de juego')
    }
  }

  // Crear
  static async create(data: CreateGameModeDto, createdBy?: string): Promise<IGameMode> {
    try {
      const existingMode = await GameMode.findOne({ name: data.name })

      if (existingMode) {
        throw new Error(`Ya existe un modo con el nombre "${data.name}"`)
      }

      const newMode = await GameMode.create({
        uuid: uuidv4(),
        ...data,
        createdBy,
        isActive: true,
      })

      return newMode.toObject()
    }
    catch (error) {
      logger.error('Error creando modo:', { error, data })
      if (error instanceof Error)
        throw error
      throw new Error('Error al crear modo de juego')
    }
  }

  // Actualizar
  static async update(uuid: string, data: UpdateGameModeDto, updatedBy?: string): Promise<IGameMode> {
    try {
      const existingMode = await GameMode.findOne({ uuid })

      if (!existingMode) {
        throw new Error('Modo de juego no encontrado')
      }

      if (data.name && data.name !== existingMode.name) {
        const duplicateName = await GameMode.findOne({
          name: data.name,
          uuid: { $ne: uuid },
        })

        if (duplicateName) {
          throw new Error(`Ya existe un modo con el nombre "${data.name}"`)
        }
      }

      const updatedMode = await GameMode.findOneAndUpdate(
        { uuid },
        { ...data, updatedBy, updatedAt: new Date() },
        { new: true, runValidators: true },
      )

      if (!updatedMode) {
        throw new Error('Error al actualizar modo')
      }

      return updatedMode.toObject()
    }
    catch (error) {
      logger.error('Error actualizando modo:', { error, uuid })
      if (error instanceof Error)
        throw error
      throw new Error('Error al actualizar modo de juego')
    }
  }

  // Soft delete
  static async softDelete(uuid: string): Promise<IGameMode> {
    try {
      const mode = await GameMode.findOne({ uuid })

      if (!mode) {
        throw new Error('Modo de juego no encontrado')
      }

      if (!mode.isActive) {
        throw new Error('El modo ya está inactivo')
      }

      mode.isActive = false
      mode.updatedAt = new Date()

      await mode.save()

      return mode.toObject()
    }
    catch (error) {
      logger.error('Error desactivando modo:', { error, uuid })
      if (error instanceof Error)
        throw error
      throw new Error('Error al desactivar modo')
    }
  }

  // Reactivar
  static async reactivate(uuid: string): Promise<IGameMode> {
    try {
      const mode = await GameMode.findOne({ uuid })

      if (!mode) {
        throw new Error('Modo de juego no encontrado')
      }

      if (mode.isActive) {
        throw new Error('El modo ya está activo')
      }

      mode.isActive = true
      mode.updatedAt = new Date()

      await mode.save()

      return mode.toObject()
    }
    catch (error) {
      logger.error('Error reactivando modo:', { error, uuid })
      if (error instanceof Error)
        throw error
      throw new Error('Error al reactivar modo')
    }
  }
}
