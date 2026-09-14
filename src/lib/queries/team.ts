import { createClient } from '@/lib/supabase/server'
import { TeamMember } from '@/types/database'

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order')
  return (data as TeamMember[]) ?? []
}

export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', id)
    .single()
  return (data as TeamMember) ?? null
}
