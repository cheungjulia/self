/**
 * Upstash Redis client singleton
 * 
 * Setup:
 * 1. Create account at https://upstash.com
 * 2. Create a Redis database
 * 3. Copy UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env.local
 */

import { Redis } from '@upstash/redis'

// Singleton pattern - reuse connection across requests
let redis: Redis | null = null

export function getRedis(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      throw new Error(
        'Missing Upstash Redis credentials. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local'
      )
    }

    redis = new Redis({ url, token })
  }

  return redis
}

// Redis key prefixes for organization
export const REDIS_KEYS = {
  // Hash storing subscriber data: subscribers:{phone} -> Subscriber
  subscriber: (phone: string) => `subscribers:${phone}`,
  // Set of all subscriber phone numbers for quick iteration
  subscriberList: 'subscribers:list',
} as const

