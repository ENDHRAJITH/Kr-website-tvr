import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ClientLogo } from '@/types/database'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('client_logos')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message, logos: [] }, { status: 500 })
    }

    return NextResponse.json({ logos: (data as ClientLogo[]) || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message, logos: [] }, { status: 500 })
  }
}
