import type { Logger as PinoLogger } from 'pino'

import pino from 'pino'

import { Logger } from '../logger'

export interface GraylogConfig {
  host: string
  port: number
  facility?: string
  level?: string
}

export class GraylogLogger extends Logger {
  protected pino: PinoLogger

  constructor(config: GraylogConfig) {
    super()

    this.pino = pino({
      level: config.level ?? 'info',
    }, pino.transport({
      target: 'pino-gelf',
      options: {
        host: config.host,
        port: config.port,
        facility: config.facility ?? 'betaso-domino',
      },
    }))
  }
}
