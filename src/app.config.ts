import type { ServerOptions } from 'colyseus'

import { monitor } from '@colyseus/monitor'
import { playground } from '@colyseus/playground'
import config from '@colyseus/tools'
import { matchMaker, RedisDriver, RedisPresence } from 'colyseus'

/**
 * Import your Room files
 */
import env from '@/env'
import { logger } from '@/logger'

import { MyRoom } from './rooms/MyRoom'

// Adapter to bridge our Logger interface with Colyseus's expected logger interface
const colyseusLoggerAdapter = {
  trace: (...args: unknown[]) => logger.debug(args.map(String).join(' ')),
  debug: (...args: unknown[]) => logger.debug(args.map(String).join(' ')),
  info: (...args: unknown[]) => logger.info(args.map(String).join(' ')),
  warn: (...args: unknown[]) => logger.warn(args.map(String).join(' ')),
  error: (...args: unknown[]) => logger.error(args.map(String).join(' ')),
}

let gameOptions: ServerOptions = {}
if (env.NODE_APP_INSTANCE) {
  const processNumber = env.NODE_APP_INSTANCE ?? 0
  const port = env.PORT + processNumber
  gameOptions = {
    logger: colyseusLoggerAdapter,
    presence: new RedisPresence(env.REDIS_URI),
    driver: new RedisDriver(env.REDIS_URI),
    publicAddress: `${port}.${env.SERVER_NAME}`,
    async selectProcessIdToCreateRoom(
      roomName: string,
      _clientOptions: any,
    ) {
      if (roomName === 'lobby') {
        const lobbies = await matchMaker.query({ name: 'lobby' })
        if (lobbies.length !== 0) {
          throw new Error('Attempt to create one lobby')
        }
      }
      const stats = await matchMaker.stats.fetchAll()
      stats.sort((p1, p2) =>
        p1.roomCount !== p2.roomCount
          ? p1.roomCount - p2.roomCount
          : p1.ccu - p2.ccu,
      )
      if (stats.length === 0) {
        throw new Error('No process available')
      }
      return stats[0]!.processId
    },
  }
  gameOptions.presence?.setMaxListeners(100) // extend max listeners to avoid memory leak warning
}

export default config({
  options: gameOptions,
  initializeGameServer: (gameServer) => {
    /**
     * Define your room handlers:
     */
    gameServer.define('my_room', MyRoom)
  },
  initializeExpress: (app) => {
    /**
     * Bind your custom express routes here:
     * Read more: https://expressjs.com/en/starter/basic-routing.html
     */
    app.get('/hello_world', (req, res) => {
      res.send('It\'s time to kick ass and chew bubblegum!')
    })

    /**
     * Use @colyseus/playground
     * (It is not recommended to expose this route in a production environment)
     */
    if (env.NODE_ENV !== 'production') {
      app.use('/', playground())
    }

    /**
     * Use @colyseus/monitor
     * It is recommended to protect this route with a password
     * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
     */
    app.use('/monitor', monitor())
  },
  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
})
