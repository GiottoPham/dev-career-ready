import { randomUUID } from "node:crypto"
import { EventEmitter } from "node:events"

import type { AnalysisStatus } from "@packages/shared"
import type Redis from "ioredis"

import { isRedisAvailable, redisConnection } from "../../../lib/redis"

const getChannelName = (resultId: number) => `analyze:status:${resultId}`

type StatusPayload = { status: AnalysisStatus; error?: string }

declare global {
  var __statusEmitter: EventEmitter | undefined
}

// Always-on, same-process delivery — the BullMQ worker and the SSE route run
// in the same process today, so this alone is correct with Redis fully down.
// Redis pub/sub is layered on top only to reach a future multi-replica deploy;
// PROCESS_ID lets a subscriber ignore its own process's messages echoed back
// through Redis, since those were already delivered via the local emitter.
const localEmitter = (globalThis.__statusEmitter ??= new EventEmitter().setMaxListeners(0))
const PROCESS_ID = randomUUID()

export const subscribeToStatus = ({
  resultId,
  onStatus,
}: {
  resultId: number
  onStatus: (payload: StatusPayload) => void
}) => {
  const channel = getChannelName(resultId)
  localEmitter.on(channel, onStatus)

  let redisSub: Redis | undefined
  if (redisConnection && isRedisAvailable()) {
    redisSub = redisConnection.duplicate()
    const handler = (receivedChannel: string, message: string) => {
      if (receivedChannel !== channel) {
        return
      }
      const parsed = JSON.parse(message)
      if (parsed.__origin === PROCESS_ID) {
        return
      }
      onStatus(parsed)
    }
    redisSub.subscribe(channel).catch(() => {})
    redisSub.on("message", handler)
    redisSub.on("error", () => {})
  }

  return async () => {
    localEmitter.off(channel, onStatus)
    if (redisSub) {
      await redisSub.unsubscribe(channel).catch(() => {})
      await redisSub.quit().catch(() => {})
    }
  }
}

export const publishStatus = ({ resultId, payload }: { resultId: number; payload: StatusPayload }) => {
  localEmitter.emit(getChannelName(resultId), payload)

  if (redisConnection && isRedisAvailable()) {
    redisConnection.publish(getChannelName(resultId), JSON.stringify({ ...payload, __origin: PROCESS_ID })).catch(() => {})
  }
}
