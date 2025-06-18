import { redisClient } from "@/redis/redis"

export async function isRateLimited(
  key: string,
  limit = 3,
  windowMs = 60 * 60 * 1000
) {
  const redisKey = `ratelimit:${key}`

  const current = await redisClient.incr(redisKey)

  if (current === 1) {
    await redisClient.expire(redisKey, windowMs / 1000)
  }

  return current > limit
}
