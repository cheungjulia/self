/**
 * Subscriber service - handles all subscriber operations
 * 
 * This module provides a clean interface for managing subscribers
 * without exposing Redis implementation details to the rest of the app.
 */

import { getRedis, REDIS_KEYS } from './redis'
import type { Subscriber, SubscribeInput, SubscriberMetadata } from '@/types/subscriber'
import { normalizePhone, isValidPhone } from '@/types/subscriber'

export class SubscriberService {
  /**
   * Add a new subscriber
   * Returns the created subscriber or null if already exists
   */
  async subscribe(input: SubscribeInput): Promise<{ success: true; subscriber: Subscriber } | { success: false; error: string }> {
    const phone = normalizePhone(input.phone)

    if (!isValidPhone(phone)) {
      return { success: false, error: 'Invalid phone number format. Use international format: +1234567890' }
    }

    const redis = getRedis()
    const key = REDIS_KEYS.subscriber(phone)

    // Check if already subscribed
    const exists = await redis.exists(key)
    if (exists) {
      return { success: false, error: 'This phone number is already subscribed' }
    }

    const subscriber: Subscriber = {
      id: crypto.randomUUID(),
      phone,
      name: input.name.trim(),
      subscribedAt: new Date().toISOString(),
      metadata: input.metadata || {},
    }

    // Store subscriber data as hash and add to list (atomic pipeline)
    const pipeline = redis.pipeline()
    pipeline.hset(key, subscriber as unknown as Record<string, unknown>)
    pipeline.sadd(REDIS_KEYS.subscriberList, phone)
    await pipeline.exec()

    return { success: true, subscriber }
  }

  /**
   * Remove a subscriber by phone number
   */
  async unsubscribe(phone: string): Promise<boolean> {
    const normalizedPhone = normalizePhone(phone)
    const redis = getRedis()
    const key = REDIS_KEYS.subscriber(normalizedPhone)

    const pipeline = redis.pipeline()
    pipeline.del(key)
    pipeline.srem(REDIS_KEYS.subscriberList, normalizedPhone)
    const results = await pipeline.exec()

    return (results[0] as number) > 0
  }

  /**
   * Get a subscriber by phone number
   */
  async getByPhone(phone: string): Promise<Subscriber | null> {
    const normalizedPhone = normalizePhone(phone)
    const redis = getRedis()
    const key = REDIS_KEYS.subscriber(normalizedPhone)

    const data = await redis.hgetall(key)
    if (!data || Object.keys(data).length === 0) {
      return null
    }

    return this.parseSubscriber(data)
  }

  /**
   * Get all subscribers
   */
  async getAll(): Promise<Subscriber[]> {
    const redis = getRedis()
    const phones = await redis.smembers(REDIS_KEYS.subscriberList) as string[]

    if (phones.length === 0) {
      return []
    }

    // Fetch all subscribers in parallel
    const pipeline = redis.pipeline()
    for (const phone of phones) {
      pipeline.hgetall(REDIS_KEYS.subscriber(phone))
    }
    const results = await pipeline.exec()

    return results
      .filter((data): data is Record<string, unknown> => data !== null && typeof data === 'object')
      .map(data => this.parseSubscriber(data))
      .filter((s): s is Subscriber => s !== null)
  }

  /**
   * Get subscriber count
   */
  async count(): Promise<number> {
    const redis = getRedis()
    return await redis.scard(REDIS_KEYS.subscriberList)
  }

  /**
   * Check if a phone number is subscribed
   */
  async isSubscribed(phone: string): Promise<boolean> {
    const normalizedPhone = normalizePhone(phone)
    const redis = getRedis()
    return await redis.sismember(REDIS_KEYS.subscriberList, normalizedPhone) === 1
  }

  /**
   * Parse Redis hash data to Subscriber type
   */
  private parseSubscriber(data: Record<string, unknown>): Subscriber | null {
    if (!data.id || !data.phone || !data.name || !data.subscribedAt) {
      return null
    }

    return {
      id: String(data.id),
      phone: String(data.phone),
      name: String(data.name),
      subscribedAt: String(data.subscribedAt),
      metadata: (typeof data.metadata === 'object' ? data.metadata : {}) as SubscriberMetadata,
    }
  }
}

// Export singleton instance
export const subscriberService = new SubscriberService()

