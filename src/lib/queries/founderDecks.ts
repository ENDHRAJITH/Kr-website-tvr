import { FounderDeck } from '@/types/database'
import { safeSupabaseQuery } from './queryHelper'

export async function getFounderDecks(): Promise<FounderDeck[]> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('founder_decks')
        .select('*')
        .order('display_order', { ascending: true })
      return (data as FounderDeck[]) || []
    },
    []
  )
}
