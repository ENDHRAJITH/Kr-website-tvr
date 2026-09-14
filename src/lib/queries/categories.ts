import { createClient } from '@/lib/supabase/server'
import { ServiceCategory } from '@/types/database'

export async function getCategories(division: 'studioz' | 'marketing'): Promise<ServiceCategory[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('service_categories')
    .select('*')
    .eq('division', division)
    .order('display_order')
  return (data as ServiceCategory[]) ?? []
}

export async function getAllCategories(): Promise<ServiceCategory[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('service_categories')
    .select('*')
    .order('display_order')
  return (data as ServiceCategory[]) ?? []
}
