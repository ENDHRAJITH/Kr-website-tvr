import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { FounderDeck } from '@/types/database'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('founder_decks')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message, decks: [] }, { status: 500 })
    }

    return NextResponse.json({ decks: (data as FounderDeck[]) || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message, decks: [] }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { decks, activeDeck } = body

    const supabase = await createClient()

    if (activeDeck) {
      const { error } = await supabase.from('founder_decks').upsert(activeDeck)
      if (error) throw error
    } else if (decks && Array.isArray(decks)) {
      for (const deck of decks) {
        const { error } = await supabase.from('founder_decks').upsert(deck)
        if (error) throw error
      }
    } else {
      return NextResponse.json({ error: 'Invalid payload: deck data required' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Saved directly to Supabase database successfully!',
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save decks' }, { status: 500 })
  }
}
