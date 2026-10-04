import { PortfolioItem } from '@/types/database'
import { safeSupabaseQuery } from './queryHelper'

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
      return (data as PortfolioItem[]) ?? []
    },
    []
  )
}

export async function getAllPortfolioItems(): Promise<PortfolioItem[]> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('display_order')
      return (data as PortfolioItem[]) ?? []
    },
    []
  )
}

export async function getPortfolioItemById(id: string): Promise<PortfolioItem | null> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('id', id)
        .single()
      return (data as PortfolioItem) ?? null
    },
    null
  )
}
