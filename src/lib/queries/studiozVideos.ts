import { createClient } from '@/lib/supabase/server'
import { StudiozVideoItem } from '@/components/public/StudiozVideoMarquee'
import { FALLBACK_STUDIOZ_VIDEOS } from '@/lib/constants/fallbackData'

export { FALLBACK_STUDIOZ_VIDEOS }

export async function getStudiozVideos(): Promise<StudiozVideoItem[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('studioz_videos')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return FALLBACK_STUDIOZ_VIDEOS
    }

    return data as StudiozVideoItem[]
  } catch (err) {
    console.warn('Error fetching studioz_videos, returning fallbacks:', err)
    return FALLBACK_STUDIOZ_VIDEOS
  }
}
