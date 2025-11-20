import type { Logger as PinoLogger } from 'pino'

export type LogMeta = Record<string, unknown>

export abstract class Logger {
  protected abstract pino: PinoLogger

  debug(message: string, meta?: LogMeta): void {
    if (meta) {
      this.pino.debug(meta, message)
    }
    else {
      this.pino.debug(message)
    }
  }

  info(message: string, meta?: LogMeta): void {
    if (meta) {
      this.pino.info(meta, message)
    }
    else {
      this.pino.info(message)
    }
  }

  warn(message: string, meta?: LogMeta): void {
    if (meta) {
      this.pino.warn(meta, message)
    }
    else {
      this.pino.warn(message)
    }
  }

  error(message: string, meta?: LogMeta): void {
    if (meta) {
      this.pino.error(meta, message)
    }
    else {
      this.pino.error(message)
    }
  }

  child(bindings: LogMeta): PinoLogger {
    return this.pino.child(bindings)
  }
}
