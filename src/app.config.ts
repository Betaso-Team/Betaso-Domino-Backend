import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";

/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom";
import { matchMaker, RedisDriver, RedisPresence, ServerOptions } from "colyseus";

let gameOptions: ServerOptions = {}

if (process.env.NODE_APP_INSTANCE) {
    const processNumber = Number(process.env.NODE_APP_INSTANCE || "0")
    const port = (Number(process.env.PORT) || 2569) + processNumber
    gameOptions = {
      presence: new RedisPresence(process.env.REDIS_URI),
      driver: new RedisDriver(process.env.REDIS_URI),
      publicAddress: `${port}.${process.env.SERVER_NAME}`,
      selectProcessIdToCreateRoom: async function (
        roomName: string,
        clientOptions: any
      ) {
        if (roomName === "lobby") {
          const lobbies = await matchMaker.query({ name: "lobby" })
          if (lobbies.length !== 0) {
            throw "Attempt to create one lobby"
          }
        }
        const stats = await matchMaker.stats.fetchAll()
        stats.sort((p1, p2) =>
          p1.roomCount !== p2.roomCount
            ? p1.roomCount - p2.roomCount
            : p1.ccu - p2.ccu
        )
        if (stats.length === 0) {
          throw "No process available"
        } else {
          return stats[0]?.processId
        }
      }
    }
    gameOptions.presence?.setMaxListeners(100) // extend max listeners to avoid memory leak warning
  }


export default config({

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('my_room', MyRoom);

    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */
        app.get("/hello_world", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground());
        }

        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        app.use("/monitor", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
