import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'
import { createClient } from '@/lib/supabase/server'
import { WhyChooseUsData } from '@/types/database'

const DATA_DIR = path.join(process.cwd(), 'public', 'data')
const FILE_PATH = path.join(DATA_DIR, 'whyChooseUs.json')

export async function GET() {
  try {
    // 1. Try reading from Supabase
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'why_choose_us')
        .maybeSingle()

      if (!error && data && data.value) {
        const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value
        return NextResponse.json({ data: parsed, source: 'supabase' })
      }
    } catch {}

    // 2. Try reading from local disk JSON file
    try {
      const fileContent = await readFile(FILE_PATH, 'utf-8')
      const localData = JSON.parse(fileContent) as WhyChooseUsData
      return NextResponse.json({ data: localData, source: 'disk' })
    } catch {}

    return NextResponse.json({ error: 'Data not found' }, { status: 404 })
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

    // 1. Save to local disk JSON (instant & 100% resilient)
    await mkdir(DATA_DIR, { recursive: true })
    await writeFile(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')

    // 2. Sync to Supabase site_settings
    let supabaseError = null
    try {
      const supabase = await createClient()
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          { key: 'why_choose_us', value: data, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        )
      if (error) supabaseError = error.message
    } catch (e: any) {
      supabaseError = e?.message || 'Supabase connection failed'
    }

    return NextResponse.json({
      success: true,
      message: 'Why Choose Us data saved successfully!',
      supabaseError,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save data' }, { status: 500 })
  }
}
