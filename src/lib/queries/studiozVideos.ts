import { createClient } from '@/lib/supabase/server'
import { StudiozVideoItem } from '@/components/public/StudiozVideoMarquee'

export async function getStudiozVideos(): Promise<StudiozVideoItem[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('studioz_videos')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    return (data as StudiozVideoItem[]) || []
  } catch (err) {
    console.error('Error fetching studioz_videos directly from Supabase:', err)
    return []
  }
}
