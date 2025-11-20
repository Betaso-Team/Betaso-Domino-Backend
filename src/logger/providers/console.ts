import type { Logger as PinoLogger } from 'pino'

import pino from 'pino'

import { Logger } from '../logger'

export interface ConsoleLoggerConfig {
  level?: string
  pretty?: boolean
}

export class ConsoleLogger extends Logger {
  protected pino: PinoLogger

  constructor(config?: ConsoleLoggerConfig) {
    super()

    const transport = config?.pretty
      ? pino.transport({
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        })
      : undefined

    this.pino = pino({
      level: config?.level ?? 'info',
    }, transport)
  }
}
