import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { WhyChooseUsData } from '@/types/database'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'why_choose_us')
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (data && data.value) {
      const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value
      return NextResponse.json({ data: parsed as WhyChooseUsData })
    }

    return NextResponse.json({ error: 'No data found in Supabase' }, { status: 404 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { data } = body

    if (!data) {
      return NextResponse.json({ error: 'Missing data payload' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('site_settings')
      .upsert(
        { key: 'why_choose_us', value: data, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Saved directly to Supabase database successfully!',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save to Supabase' }, { status: 500 })
  }
}
