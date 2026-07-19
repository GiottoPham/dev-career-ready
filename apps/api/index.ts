import { app } from "./app"
import "./services/redis/analyze/worker" // starts the BullMQ worker as a side effect

const port = process.env.PORT

app.listen(port)
