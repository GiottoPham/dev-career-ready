import type { AnalysisStatus } from "@packages/shared"

import { redisConnection, redisPublisher } from "../../../lib/redis"

const getChannelName = (resultId: number) => `analyze:status:${resultId}`

export const subscribeToStatus = ({
  resultId,
  onStatus,
}: {
  resultId: number
  onStatus: (payload: { status: AnalysisStatus; error?: string }) => void
}) => {
  const channel = getChannelName(resultId)
  const redis = redisConnection.duplicate()

  const handler = (receivedChannel: string, message: string) => {
    if (receivedChannel !== channel) {
      return
    }
    onStatus(JSON.parse(message))
  }

  redis.subscribe(channel)
  redis.on("message", handler)

  const unsubscribe = async () => {
    redis.off("message", handler)
    await redis.unsubscribe(channel)
    await redis.quit()
  }

  return unsubscribe
}

export const publishStatus = ({
  resultId,
  payload,
}: {
  resultId: number
  payload: { status: AnalysisStatus; error?: string }
}) => redisPublisher.publish(getChannelName(resultId), JSON.stringify(payload))
