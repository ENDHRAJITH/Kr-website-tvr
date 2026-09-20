import { createClient } from '@/lib/supabase/server'
import { WeddingPackage } from '@/types/database'

export async function getWeddingPackages(): Promise<WeddingPackage[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('wedding_packages')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    if (error) {
      console.warn('wedding_packages query error:', error.message)
      return []
    }
    return (data as WeddingPackage[]) ?? []
  } catch (err) {
    console.warn('Failed to fetch wedding packages:', err)
    return []
  }
}

export async function getAllWeddingPackages(): Promise<WeddingPackage[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('wedding_packages')
      .select('*')
      .order('display_order')

    if (error) {
      console.warn('getAllWeddingPackages error:', error.message)
      return []
    }
    return (data as WeddingPackage[]) ?? []
  } catch (err) {
    console.warn('Failed to fetch all wedding packages:', err)
    return []
  }
}

export async function getWeddingPackageById(id: string): Promise<WeddingPackage | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('wedding_packages')
      .select('*')
      .eq('id', id)
      .single()

    return (data as WeddingPackage) ?? null
  } catch (err) {
    return null
  }
}
