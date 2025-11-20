import type { Logger } from './logger'

import env from '../env'
import { ConsoleLogger, GraylogLogger } from './providers'

export { Logger } from './logger'
export type { LogMeta } from './logger'

export { ConsoleLogger, GraylogLogger } from './providers'
export type { ConsoleLoggerConfig, GraylogConfig } from './providers'

function createLogger(): Logger {
  if (env.NODE_ENV === 'production' && env.GRAYLOG_HOST) {
    return new GraylogLogger({
      host: env.GRAYLOG_HOST,
      port: env.GRAYLOG_PORT,
      level: 'info',
    })
  }

  return new ConsoleLogger({
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',
    pretty: env.NODE_ENV === 'development',
  })
}

export const logger = createLogger()
