import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Default fallback state if DB is not updated
let inMemoryChatbotEnabled = true

export async function GET() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('site_stats')
      .select('*')
      .eq('label', 'ai_chatbot_status')
      .maybeSingle()

    if (data) {
      const isEnabled = data.value === 'true' || data.value === 'enabled'
      return NextResponse.json({ enabled: isEnabled })
    }

    return NextResponse.json({ enabled: inMemoryChatbotEnabled })
  } catch {
    return NextResponse.json({ enabled: inMemoryChatbotEnabled })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { enabled } = body

    if (typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'Enabled status must be a boolean.' }, { status: 400 })
    }

    inMemoryChatbotEnabled = enabled

    const supabase = await createClient()
    const { data: existing } = await supabase
      .from('site_stats')
      .select('id')
      .eq('label', 'ai_chatbot_status')
      .maybeSingle()

    if (existing) {
      await supabase
        .from('site_stats')
        .update({ value: enabled ? 'true' : 'false' })
        .eq('id', existing.id)
    } else {
      await supabase.from('site_stats').insert([
        {
          label: 'ai_chatbot_status',
          value: enabled ? 'true' : 'false',
          icon: 'bot',
          display_order: 99,
        },
      ])
    }

    return NextResponse.json({
      success: true,
      enabled,
      message: `AI Chatbot assistant is now ${enabled ? 'ENABLED' : 'DISABLED'} on the public site!`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update toggle' }, { status: 500 })
  }
}
