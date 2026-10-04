import { StudiozVideoItem } from '@/components/public/StudiozVideoMarquee'
import { safeSupabaseQuery } from './queryHelper'

export async function getStudiozVideos(): Promise<StudiozVideoItem[]> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('studioz_videos')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      return (data as StudiozVideoItem[]) || []
    },
    []
  )
}
