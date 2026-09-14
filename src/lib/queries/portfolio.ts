import { createClient } from '@/lib/supabase/server'
import { PortfolioItem } from '@/types/database'

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
  return (data as PortfolioItem[]) ?? []
}

export async function getAllPortfolioItems(): Promise<PortfolioItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('display_order')
  return (data as PortfolioItem[]) ?? []
}

export async function getPortfolioItemById(id: string): Promise<PortfolioItem | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('id', id)
    .single()
  return (data as PortfolioItem) ?? null
}
