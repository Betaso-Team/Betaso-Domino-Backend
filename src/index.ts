/**
 * IMPORTANT:
 * ---------
 * Do not manually edit this file if you'd like to host your server on Colyseus Cloud
 *
 * If you're self-hosting (without Colyseus Cloud), you can manually
 * instantiate a Colyseus Server as documented here:
 *
 * See: https://docs.colyseus.io/server/api/#constructor-options
 */
import { Encoder } from '@colyseus/schema'
import { listen } from '@colyseus/tools'
import { matchMaker } from 'colyseus'
import { CronJob } from 'cron'

import env from '@/env'
import { logger } from '@/logger'

import app from './app.config'

Encoder.BUFFER_SIZE = 512 * 1024

// Create and listen on 2567 (or PORT environment variable.)
async function main() {
  if (env.NODE_APP_INSTANCE) {
    const processNumber = env.NODE_APP_INSTANCE
    const port = env.PORT + processNumber
    await listen(app)
    if (port === env.PORT) {
      // only the first thread of the first instance will create the lobby and init cron jobs
      await matchMaker.createRoom('lobby', {})
      checkLobby()
    }
  }
  else {
    await listen(app, env.PORT)
    await matchMaker.createRoom('lobby', {})
  }
}

function checkLobby() {
  logger.info('checkLobby cron job')
  CronJob.from({
    cronTime: '* * * * *',
    timeZone: 'America/Caracas',
    onTick: async () => {
      const lobbies = await matchMaker.query({ name: 'lobby' })
      if (lobbies.length === 0) {
        logger.warn(
          `Lobby room has not been found, retrying 2 times before recreating...`,
        )

        // Retry 2 times with 10 second wait between attempts
        let retryCount = 0
        const maxRetries = 2

        while (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 10000)) // Wait 10 seconds
          retryCount++

          const retriedLobbies = await matchMaker.query({ name: 'lobby' })
          if (retriedLobbies.length > 0) {
            logger.info(`Lobby room found on retry attempt ${retryCount}`)
            return
          }
          logger.warn(
            `Retry attempt ${retryCount}/${maxRetries} failed, lobby still not found`,
          )
        }

        logger.warn(
          `All retry attempts failed, automatically remaking lobby room`,
        )
        matchMaker.createRoom('lobby', {})
      }
    },
    start: true,
  })
}

// ========================================
// MANEJO DE ERRORES - SOLO LOGGEAR
// ========================================

process.on("uncaughtException", (error: Error) => {
    logger.error("=".repeat(80));
    logger.error("💥 UNCAUGHT EXCEPTION - ERROR NO CAPTURADO");
    logger.error("=".repeat(80));
    logger.error("Error:", error.message);
    logger.error("Stack:", error.stack);
    logger.error("=".repeat(80));
    
    // ⚠️ NO reiniciar el proceso
    // Las partidas activas continúan
    // Se recomienda monitorear estos logs y corregir los errores
  });
  
  process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
    logger.error("=".repeat(80));
    logger.error("💥 UNHANDLED REJECTION - PROMESA RECHAZADA");
    logger.error("=".repeat(80));
    logger.error("Razón:", reason);
    if (reason?.stack) {
      logger.error("Stack:", reason.stack);
    }
    logger.error("=".repeat(80));
    
    // ⚠️ NO reiniciar el proceso
    // Las partidas activas continúan
  });
  process.on("warning", (warning: Error) => {
    logger.warn("⚠️  WARNING:", warning.name, "-", warning.message);
  });

main()
