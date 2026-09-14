import { createClient } from '@/lib/supabase/server'
import { ClientLogo } from '@/types/database'

export async function getClientLogos(): Promise<ClientLogo[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('client_logos')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
  return (data as ClientLogo[]) ?? []
}

export async function getAllClientLogos(): Promise<ClientLogo[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('client_logos')
    .select('*')
    .order('display_order')
  return (data as ClientLogo[]) ?? []
}
