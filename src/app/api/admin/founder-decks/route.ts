import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'
import { createClient } from '@/lib/supabase/server'
import { FounderDeck } from '@/types/database'

const DATA_DIR = path.join(process.cwd(), 'public', 'data')
const FILE_PATH = path.join(DATA_DIR, 'founderDecks.json')

const DEFAULT_DECKS: FounderDeck[] = [
  {
    id: 'rajitha-deck',
    founder_name: 'Rajitha',
    founder_role: 'Founder & Creative Director (KR Studioz)',
    division: 'studioz',
    avatar_url: '',
    pdf_url: '/docs/rajitha-studioz-portfolio.pdf',
    bio: 'Pioneer of high-end wedding cinematography and storytelling.',
    slides: [],
    display_order: 1
  },
  {
    id: 'karthik-deck',
    founder_name: 'Karthik',
    founder_role: 'Founder & Managing Director (KR Digital)',
    division: 'marketing',
    avatar_url: '',
    pdf_url: '/docs/karthik-digital-marketing-deck.pdf',
    bio: 'Brand strategist & growth hacker driving multi-million reach.',
    slides: [],
    display_order: 2
  }
]

export async function GET() {
  try {
    // 1. Try reading from local disk JSON
    let localData: FounderDeck[] = []
    try {
      const content = await readFile(FILE_PATH, 'utf-8')
      localData = JSON.parse(content)
    } catch (e) {}

    // 2. Try Supabase
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('founder_decks')
        .select('*')
        .order('display_order', { ascending: true })

      if (!error && data && data.length > 0) {
        // If Supabase has valid data, compare timestamps or sync
        const supabaseDecks = data as FounderDeck[]
        
        // If local JSON has newer pdf_url / slides that Supabase doesn't have, merge them
        const merged = supabaseDecks.map((sDeck) => {
          const lMatch = localData.find((l) => l.id === sDeck.id)
          if (lMatch && lMatch.pdf_url && lMatch.pdf_url !== sDeck.pdf_url) {
            return { ...sDeck, pdf_url: lMatch.pdf_url }
          }
          return sDeck
        })

        return NextResponse.json({ decks: merged, source: 'supabase' })
      }
    } catch (e) {}

    // If Supabase is empty or fails, use local disk data or defaults
    if (localData.length > 0) {
      return NextResponse.json({ decks: localData, source: 'disk' })
    }

    return NextResponse.json({ decks: DEFAULT_DECKS, source: 'default' })
  } catch (error: any) {
    return NextResponse.json({ decks: DEFAULT_DECKS, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { decks, activeDeck } = body

    if (!decks || !Array.isArray(decks)) {
      return NextResponse.json({ error: 'Invalid payload: decks array required' }, { status: 400 })
    }

    // 1. Save to local disk JSON file
    await mkdir(DATA_DIR, { recursive: true })
    await writeFile(FILE_PATH, JSON.stringify(decks, null, 2), 'utf-8')

    // 2. Sync active deck or all decks to Supabase
    let supabaseError = null
    try {
      const supabase = await createClient()
      if (activeDeck) {
        const { error } = await supabase.from('founder_decks').upsert(activeDeck)
        if (error) supabaseError = error.message
      } else {
        for (const deck of decks) {
          const { error } = await supabase.from('founder_decks').upsert(deck)
          if (error) supabaseError = error.message
        }
      }
    } catch (e: any) {
      supabaseError = e?.message || 'Supabase connection failed'
    }

    return NextResponse.json({
      success: true,
      message: 'Saved deck to server disk storage successfully!',
      supabaseError,
    })
  } catch (error: any) {
    console.error('Error saving founder decks API:', error)
    return NextResponse.json({ error: error.message || 'Failed to save decks' }, { status: 500 })
  }
}
