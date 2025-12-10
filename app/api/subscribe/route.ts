import { NextRequest, NextResponse } from 'next/server'
import { subscriberService } from '@/lib/subscribers'
import { z } from 'zod'

const subscribeSchema = z.object({
  phone: z.string().min(7, 'Phone number too short'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  metadata: z.object({
    userAgent: z.string().optional(),
    locale: z.string().optional(),
    referrer: z.string().optional(),
    source: z.string().optional(),
  }).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const parsed = subscribeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const { phone, name, metadata } = parsed.data

    // Subscribe
    const result = await subscriberService.subscribe({
      phone,
      name,
      metadata,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Successfully subscribed!',
    })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

