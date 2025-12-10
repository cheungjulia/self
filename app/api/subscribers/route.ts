import { NextRequest, NextResponse } from 'next/server'
import { subscriberService } from '@/lib/subscribers'

/**
 * GET /api/subscribers
 * 
 * Debug endpoint to view all subscribers.
 * Protected by NOTIFY_SECRET.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const expectedToken = process.env.NOTIFY_SECRET

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const subscribers = await subscriberService.getAll()
  
  return NextResponse.json({
    count: subscribers.length,
    subscribers: subscribers.map(s => ({
      name: s.name,
      phone: s.phone,
      subscribedAt: s.subscribedAt,
    })),
  })
}
