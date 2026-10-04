import { ServiceCategory } from '@/types/database'
import { safeSupabaseQuery } from './queryHelper'

export async function getCategories(division: 'studioz' | 'marketing'): Promise<ServiceCategory[]> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('service_categories')
        .select('*')
        .eq('division', division)
        .order('display_order')
      return (data as ServiceCategory[]) ?? []
    },
    []
  )
}

export async function getAllCategories(): Promise<ServiceCategory[]> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('service_categories')
        .select('*')
        .order('display_order')
      return (data as ServiceCategory[]) ?? []
    },
    []
  )
}
