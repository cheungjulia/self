/**
 * WhatsApp Cloud API service
 * 
 * Setup:
 * 1. Go to https://developers.facebook.com
 * 2. Create an app → Add WhatsApp product
 * 3. Get your Phone Number ID and Access Token from WhatsApp > API Setup
 * 4. Add them to .env.local
 */

export interface WhatsAppMessage {
  to: string // Phone number in E.164 format (without +)
  text: string
}

export interface SendResult {
  success: boolean
  messageId?: string
  error?: string
}

class WhatsAppService {
  private phoneNumberId: string | null = null
  private accessToken: string | null = null

  private getCredentials() {
    if (!this.phoneNumberId || !this.accessToken) {
      this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || null
      this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || null
    }

    if (!this.phoneNumberId || !this.accessToken) {
      throw new Error(
        'Missing WhatsApp credentials. Set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN in .env.local'
      )
    }

    return { phoneNumberId: this.phoneNumberId, accessToken: this.accessToken }
  }

  /**
   * Send a text message to a single recipient
   */
  async sendMessage(message: WhatsAppMessage): Promise<SendResult> {
    try {
      const { phoneNumberId, accessToken } = this.getCredentials()

      // Remove + prefix if present (WhatsApp API expects without +)
      const toNumber = message.to.replace(/^\+/, '')

      const response = await fetch(
        `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: toNumber,
            type: 'text',
            text: { body: message.text },
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error('WhatsApp API error:', data)
        return {
          success: false,
          error: data.error?.message || 'Failed to send message',
        }
      }

      return {
        success: true,
        messageId: data.messages?.[0]?.id,
      }
    } catch (error) {
      console.error('WhatsApp send error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Send messages to multiple recipients
   * Returns summary of results
   */
  async sendBulk(
    phones: string[],
    text: string
  ): Promise<{ sent: number; failed: number; errors: string[] }> {
    const results = await Promise.allSettled(
      phones.map(phone => this.sendMessage({ to: phone, text }))
    )

    const errors: string[] = []
    let sent = 0
    let failed = 0

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.success) {
        sent++
      } else {
        failed++
        if (result.status === 'fulfilled' && result.value.error) {
          errors.push(result.value.error)
        } else if (result.status === 'rejected') {
          errors.push(String(result.reason))
        }
      }
    }

    return { sent, failed, errors: [...new Set(errors)] } // Dedupe errors
  }

  /**
   * Format a new post notification message
   */
  formatNewPostMessage(post: { title: string; url: string }): string {
    return `📝 new post: "${post.title}"\n\nread it here: ${post.url}`
  }
}

// Export singleton
export const whatsappService = new WhatsAppService()

