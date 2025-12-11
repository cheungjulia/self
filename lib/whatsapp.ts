/**
 * WhatsApp Cloud API service
 * 
 * Setup:
 * 1. Go to https://developers.facebook.com
 * 2. Create an app → Add WhatsApp product
 * 3. Get your Phone Number ID and Access Token from WhatsApp > API Setup
 * 4. Add them to .env.local
 * 
 * Template Setup:
 * Create a template called "new_post" with body text containing {{1}} for the title
 * Example: "📝 New post: {{1}}"
 */

export interface SendResult {
  success: boolean
  messageId?: string
  error?: string
}

interface TemplateComponent {
  type: 'header' | 'body'
  parameters: Array<{ type: 'text'; text: string }>
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
   * Send a template message to a single recipient
   */
  async sendTemplate(
    to: string,
    templateName: string,
    bodyParams?: string[],
    languageCode = 'en_US'
  ): Promise<SendResult> {
    try {
      const { phoneNumberId, accessToken } = this.getCredentials()
      const toNumber = to.replace(/^\+/, '')

      const template: Record<string, unknown> = {
        name: templateName,
        language: { code: languageCode },
      }

      // Add body parameters if provided
      if (bodyParams && bodyParams.length > 0) {
        template.components = [{
          type: 'body',
          parameters: bodyParams.map(text => ({ type: 'text', text })),
        }]
      }

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
            type: 'template',
            template,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error('WhatsApp API error:', data)
        return {
          success: false,
          error: data.error?.message || 'Failed to send template message',
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
   * Send new post notification to multiple recipients
   */
  async notifyNewPost(
    phones: string[],
    title: string,
    templateName = 'new_post',
    languageCode = 'en_US'
  ): Promise<{ sent: number; failed: number; errors: string[] }> {
    const results = await Promise.allSettled(
      phones.map(phone => this.sendTemplate(phone, templateName, [title], languageCode))
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

    return { sent, failed, errors: [...new Set(errors)] }
  }
}

export const whatsappService = new WhatsAppService()
