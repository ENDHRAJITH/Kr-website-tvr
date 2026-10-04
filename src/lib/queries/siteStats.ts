import { SiteStat } from '@/types/database'
import { safeSupabaseQuery } from './queryHelper'

export async function getSiteStats(): Promise<SiteStat[]> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('site_stats')
        .select('*')
        .order('display_order')
      
      const allStats = (data as SiteStat[]) ?? []
      return allStats.filter((s) => {
        const label = (s.label || '').toLowerCase()
        const id = (s.id || '').toLowerCase()
        const val = (s.value || '').toLowerCase()

        if (label.includes('chatbot') || id.includes('chatbot')) return false
        if (label.includes('ai_') || id.includes('ai_')) return false
        if (label.startsWith('home_hero_') || id.startsWith('home_hero_')) return false
        if (label.startsWith('rag_doc_') || id.startsWith('rag_doc_')) return false
        if (val === 'true' || val === 'false') return false
        return true
      })
    },
    []
  )
}

export async function getAllSiteStats(): Promise<SiteStat[]> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('site_stats')
        .select('*')
        .order('display_order')
      return (data as SiteStat[]) ?? []
    },
    []
  )
}
