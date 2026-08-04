import { app } from "./app"
import { redisConnection, redisPublisher } from "./lib/redis"
import { analyzeWorker } from "./services/redis/analyze/worker" // starts the BullMQ worker as a side effect

const port = process.env.PORT

const server = app.listen(port)

const shutdown = async () => {
  await analyzeWorker.close()
  await redisConnection.quit()
  await redisPublisher.quit()
  server.close(() => process.exit(0))
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
