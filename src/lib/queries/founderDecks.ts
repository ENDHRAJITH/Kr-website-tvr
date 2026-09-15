import { createClient } from '@/lib/supabase/server'
import { FounderDeck } from '@/types/database'

export async function getFounderDecks(): Promise<FounderDeck[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('founder_decks')
      .select('*')
      .order('display_order', { ascending: true })

    return (data as FounderDeck[]) || []
  } catch (err) {
    console.error('Error fetching founder_decks directly from Supabase:', err)
    return []
  }
}
