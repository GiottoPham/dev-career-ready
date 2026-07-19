import Redis from "ioredis"
const redisUrl = process.env.REDIS_URL!

export const redisConnection = new Redis(redisUrl, { maxRetriesPerRequest: null })

export const redisPublisher = new Redis(redisUrl)
