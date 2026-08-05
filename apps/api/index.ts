import { app } from "./app"
import "./services/redis/analyze/worker" // starts the BullMQ worker as a side effect

// A Redis error surfacing from a connection ioredis/BullMQ manages internally
// (e.g. their own duplicated connections) can arrive as an unhandled
// rejection instead of a client "error" event we can listen for directly.
// Log and keep running rather than let it take the whole API down — the app
// is designed to degrade gracefully when Redis is unavailable/over quota.
process.on("unhandledRejection", (reason) => {
  // eslint-disable-next-line no-console
  console.error("[unhandledRejection]", reason)
})

process.on("uncaughtException", (err) => {
  // eslint-disable-next-line no-console
  console.error("[uncaughtException]", err)
})

const port = process.env.PORT

app.listen(port)
