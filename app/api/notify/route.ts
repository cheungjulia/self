import { NextRequest, NextResponse } from 'next/server'
import { subscriberService } from '@/lib/subscribers'
import { whatsappService } from '@/lib/whatsapp'
import { z } from 'zod'

const notifySchema = z.object({
  postId: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url().optional(), // Optional - will construct from postId if not provided
  useTemplate: z.boolean().optional(), // Use template message instead of text (default: true)
  templateName: z.string().optional(), // Template name (default: hello_world)
})

/**
 * POST /api/notify
 * 
 * Sends a WhatsApp notification to all subscribers about a new post.
 * Protected by NOTIFY_SECRET bearer token.
 * 
 * Body: { postId: string, title: string, url?: string }
 */
export async function POST(req: NextRequest) {
  // Auth check
  const authHeader = req.headers.get('authorization')
  const expectedToken = process.env.NOTIFY_SECRET

  if (!expectedToken) {
    console.error('NOTIFY_SECRET not configured')
    return NextResponse.json(
      { error: 'Server misconfigured' },
      { status: 500 }
    )
  }

  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()

    // Validate input
    const parsed = notifySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const { postId, title, url, useTemplate = true, templateName = 'hello_world' } = parsed.data

    // Construct URL if not provided
    const siteUrl = process.env.SITE_URL || 'https://creaturewai.net'
    const postUrl = url || `${siteUrl}/post/${postId}`

    // Get all subscribers
    const subscribers = await subscriberService.getAll()

    if (subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No subscribers to notify',
        sent: 0,
        failed: 0,
      })
    }

    const phones = subscribers.map(s => s.phone)
    let result: { sent: number; failed: number; errors: string[] }

    if (useTemplate) {
      // Use template message (works anytime, no 24h window)
      result = await whatsappService.sendBulkTemplate(phones, templateName)
    } else {
      // Use text message (only works within 24h of user messaging first)
      const message = whatsappService.formatNewPostMessage({ title, url: postUrl })
      result = await whatsappService.sendBulk(phones, message)
    }

    console.log(`Notified subscribers: ${result.sent} sent, ${result.failed} failed`)

    return NextResponse.json({
      success: true,
      sent: result.sent,
      failed: result.failed,
      total: subscribers.length,
      errors: result.errors.length > 0 ? result.errors : undefined,
      phones: phones,
    })
  } catch (error) {
    console.error('Notify error:', error)
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    )
  }
}

