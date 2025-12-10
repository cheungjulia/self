/**
 * Subscriber data model for WhatsApp notifications
 */

export interface SubscriberMetadata {
  userAgent?: string
  locale?: string
  referrer?: string
  source?: string // page URL where they subscribed
}

export interface Subscriber {
  id: string
  phone: string // E.164 format: +[country][number], e.g., +14155551234
  name: string
  subscribedAt: string // ISO 8601 timestamp
  metadata: SubscriberMetadata
}

export interface SubscribeInput {
  phone: string
  name: string
  metadata?: Partial<SubscriberMetadata>
}

// Phone validation: E.164 format
// Allows optional + prefix, country code 1-3 digits, then 4-14 digits
export const PHONE_REGEX = /^\+?[1-9]\d{6,14}$/

export function normalizePhone(phone: string): string {
  // Remove all non-digit characters except leading +
  const cleaned = phone.replace(/[^\d+]/g, '')
  // Ensure + prefix
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`
}

export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(normalizePhone(phone))
}

