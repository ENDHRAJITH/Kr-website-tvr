import { TeamMember } from '@/types/database'
import { safeSupabaseQuery } from './queryHelper'

export async function getTeamMembers(): Promise<TeamMember[]> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order')
      return (data as TeamMember[]) ?? []
    },
    []
  )
}

export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single()
      return (data as TeamMember) ?? null
    },
    null
  )
}
