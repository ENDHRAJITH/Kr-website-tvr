import { WhyChooseUsData } from '@/types/database'
import { readFile } from 'fs/promises'
import path from 'path'
import { safeSupabaseQuery } from './queryHelper'

const FILE_PATH = path.join(process.cwd(), 'public', 'data', 'whyChooseUs.json')

export async function getWhyChooseUsData(): Promise<WhyChooseUsData | null> {
  // 1. Try Supabase
  const dbData = await safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'why_choose_us')
        .maybeSingle()
      if (data && data.value) {
        return (typeof data.value === 'string' ? JSON.parse(data.value) : data.value) as WhyChooseUsData
      }
      return null
    },
    null
  )

  if (dbData) return dbData

  // 2. Disk fallback
  try {
    const raw = await readFile(FILE_PATH, 'utf-8')
    return JSON.parse(raw) as WhyChooseUsData
  } catch (err) {
    console.warn('Failed to read whyChooseUs.json from disk:', err)
    return null
  }
}
