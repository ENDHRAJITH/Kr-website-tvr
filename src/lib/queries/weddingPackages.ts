import { WeddingPackage } from '@/types/database'
import { safeSupabaseQuery } from './queryHelper'

export async function getWeddingPackages(): Promise<WeddingPackage[]> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('wedding_packages')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
      return (data as WeddingPackage[]) ?? []
    },
    []
  )
}

export async function getAllWeddingPackages(): Promise<WeddingPackage[]> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('wedding_packages')
        .select('*')
        .order('display_order')
      return (data as WeddingPackage[]) ?? []
    },
    []
  )
}

export async function getWeddingPackageById(id: string): Promise<WeddingPackage | null> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('wedding_packages')
        .select('*')
        .eq('id', id)
        .single()
      return (data as WeddingPackage) ?? null
    },
    null
  )
}
