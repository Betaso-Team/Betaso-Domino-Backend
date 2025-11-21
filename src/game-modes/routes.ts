import type { Request } from 'express'

import { Router } from 'express'

import type { IGameMode } from '@/database'
import type { CreateGameModeDto, UpdateGameModeDto } from '@/shared/dto/game-mode.dto'
import type { Response } from '@/utils/response'

import { logger } from '@/logger'

import { GameModeService } from './game-mode.service'

export const gameModeRoutes = Router()

gameModeRoutes.get('/', async (req: Request, res: Response<IGameMode[]>) => {
  const gameModes = await GameModeService.getAllActive()
  res.status(200).json({
    status: 'success',
    data: gameModes,
  })
})

gameModeRoutes.get('/reactive/:uuid', async (req: Request<{ uuid: string }, object, object>, res: Response<IGameMode>) => {
  try {
    const { uuid } = req.params
    if (!uuid) {
      return res.status(400).json({
        status: 'error',
        message: 'UUID es requerido',
      })
    }
    const gameMode = await GameModeService.reactivate(uuid)
    if (!gameMode) {
      return res.status(404).json({
        status: 'error',
        message: 'Modo de juego no encontrado',
      })
    }
    res.status(200).json({
      status: 'success',
      message: 'Modo de juego reactivado correctamente',
    })
  }
  catch (error) {
    logger.error('Error al reactivar el modo de juego:', { error })
    res.status(500).json({
      status: 'error',
      message: 'Error al reactivar el modo de juego',
    })
  }
})

gameModeRoutes.get('/:uuid', async (req: Request, res: Response<IGameMode>) => {
  try {
    const { uuid } = req.params
    if (!uuid) {
      return res.status(400).json({
        status: 'error',
        message: 'UUID es requerido',
      })
    }
    const gameMode = await GameModeService.getByUuid(uuid)
    if (!gameMode) {
      return res.status(404).json({
        status: 'error',
        message: 'Modo de juego no encontrado',
      })
    }
    res.status(200).json({
      status: 'success',
      data: gameMode,
    })
  }
  catch (error) {
    logger.error('Error al obtener el modo de juego:', { error })
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener el modo de juego',
    })
  }
})

gameModeRoutes.post('/', async (req: Request<object, object, CreateGameModeDto>, res: Response<IGameMode>) => {
  try {
    const { name, multiplier, prize, entryFee, playersQuantity, pointsToWin, isActive, isFreeRoom } = req.body
    const gameMode = await GameModeService.create({ name, multiplier, prize, entryFee, playersQuantity, pointsToWin, isActive, isFreeRoom })
    res.status(201).json({
      status: 'success',
      data: gameMode,
    })
  }
  catch (error) {
    logger.error('Error al crear el modo de juego:', { error })
    res.status(500).json({
      status: 'error',
      message: 'Error al crear el modo de juego',
    })
  }
})

gameModeRoutes.put('/:uuid', async (req: Request<{ uuid: string }, object, UpdateGameModeDto>, res: Response<IGameMode>) => {
  try {
    const { uuid } = req.params
    if (!uuid) {
      return res.status(400).json({
        status: 'error',
        message: 'UUID es requerido',
      })
    }
    const { name, multiplier, prize, entryFee, playersQuantity, pointsToWin, isActive, isFreeRoom } = req.body
    const gameMode = await GameModeService.update(uuid, { name, multiplier, prize, entryFee, playersQuantity, pointsToWin, isActive, isFreeRoom })

    if (!gameMode) {
      return res.status(404).json({
        status: 'error',
        message: 'Modo de juego no encontrado',
      })
    }
    res.status(200).json({
      status: 'success',
      data: gameMode,
    })
  }
  catch (error) {
    logger.error('Error al actualizar el modo de juego:', { error })
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar el modo de juego',
    })
  }
})

gameModeRoutes.delete('/:uuid', async (req: Request<{ uuid: string }, object, object>, res: Response<IGameMode>) => {
  try {
    const { uuid } = req.params
    const gameMode = await GameModeService.softDelete(uuid)
    if (!gameMode) {
      return res.status(404).json({
        status: 'error',
        message: 'Modo de juego no encontrado',
      })
    }
    res.status(200).json({
      status: 'success',
      message: 'Modo de juego eliminado correctamente',
    })
  }
  catch (error) {
    logger.error('Error al eliminar el modo de juego:', { error })
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar el modo de juego',
    })
  }
})
