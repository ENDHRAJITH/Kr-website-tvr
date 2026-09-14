import { createClient } from '@/lib/supabase/server'
import { StudiozService } from '@/types/database'

export async function getStudiozServices(): Promise<StudiozService[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('studioz_services')
    .select('*, service_categories(id, name, slug)')
    .eq('is_active', true)
    .order('display_order')
  return (data as StudiozService[]) ?? []
}

export async function getAllStudiozServices(): Promise<(StudiozService & { service_categories?: { name: string } | null })[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('studioz_services')
    .select('*, service_categories(name)')
    .order('display_order')
  return (data as any[]) ?? []
}

export async function getStudiozServiceById(id: string): Promise<StudiozService | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('studioz_services')
    .select('*')
    .eq('id', id)
    .single()
  return (data as StudiozService) ?? null
}
