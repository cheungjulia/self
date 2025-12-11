import { NextRequest, NextResponse } from 'next/server'
import { subscriberService } from '@/lib/subscribers'
import { whatsappService } from '@/lib/whatsapp'
import { z } from 'zod'

const notifySchema = z.object({
  postId: z.string().min(1),
  title: z.string().min(1),
})

/**
 * POST /api/notify
 * 
 * Sends a WhatsApp notification to all subscribers about a new post.
 * Protected by NOTIFY_SECRET bearer token.
 * 
 * Body: { postId: string, title: string }
 * 
 * Requires a WhatsApp template called "new_post" with {{1}} for the title.
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const expectedToken = process.env.NOTIFY_SECRET

  if (!expectedToken) {
    console.error('NOTIFY_SECRET not configured')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = notifySchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const { title } = parsed.data
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
    const result = await whatsappService.notifyNewPost(phones, title)

    console.log(`Notified subscribers: ${result.sent} sent, ${result.failed} failed`)

    return NextResponse.json({
      success: true,
      sent: result.sent,
      failed: result.failed,
      total: subscribers.length,
      phones,
      errors: result.errors.length > 0 ? result.errors : undefined,
    })
  } catch (error) {
    console.error('Notify error:', error)
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 })
  }
}
