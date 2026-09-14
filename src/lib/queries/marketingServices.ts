import { createClient } from '@/lib/supabase/server'
import { MarketingService } from '@/types/database'

export async function getMarketingServices(): Promise<MarketingService[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('marketing_services')
    .select('*, service_categories(id, name, slug)')
    .eq('is_active', true)
    .order('display_order')
  return (data as MarketingService[]) ?? []
}

export async function getAllMarketingServices(): Promise<(MarketingService & { service_categories?: { name: string } | null })[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('marketing_services')
    .select('*, service_categories(name)')
    .order('display_order')
  return (data as any[]) ?? []
}

export async function getMarketingServiceById(id: string): Promise<MarketingService | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('marketing_services')
    .select('*')
    .eq('id', id)
    .single()
  return (data as MarketingService) ?? null
}
