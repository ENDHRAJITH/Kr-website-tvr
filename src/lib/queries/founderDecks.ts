import { createClient } from '@/lib/supabase/server'
import { FounderDeck } from '@/types/database'
import { FALLBACK_FOUNDER_DECKS } from '@/lib/constants/fallbackData'

export { FALLBACK_FOUNDER_DECKS }

export async function getFounderDecks(): Promise<FounderDeck[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('founder_decks')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return FALLBACK_FOUNDER_DECKS
    }

    return data as FounderDeck[]
  } catch (err) {
    console.warn('Error fetching founder_decks, returning fallbacks:', err)
    return FALLBACK_FOUNDER_DECKS
  }
}
