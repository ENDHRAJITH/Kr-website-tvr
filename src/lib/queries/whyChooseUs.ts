import { WhyChooseUsData } from '@/types/database'
import { createClient } from '@/lib/supabase/server'

export async function getWhyChooseUsData(): Promise<WhyChooseUsData | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'why_choose_us')
      .maybeSingle()

    if (!error && data && data.value) {
      return (typeof data.value === 'string' ? JSON.parse(data.value) : data.value) as WhyChooseUsData
    }
    return null
  } catch (err) {
    console.error('Error fetching why_choose_us from Supabase:', err)
    return null
  }
}
