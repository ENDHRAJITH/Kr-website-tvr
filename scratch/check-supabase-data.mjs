import fs from 'fs'

try {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valParts] = trimmed.split('=')
      process.env[key.trim()] = valParts.join('=').trim()
    }
  }
} catch (e) {}

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(url, key)

async function checkData() {
  console.log('--- CHECKING SUPABASE TABLES DATA ---')

  const { data: founderDecks, error: err1 } = await supabase.from('founder_decks').select('*')
  console.log('founder_decks:', { count: founderDecks?.length, error: err1?.message, data: founderDecks })

  const { data: studiozVideos, error: err2 } = await supabase.from('studioz_videos').select('*')
  console.log('studioz_videos:', { count: studiozVideos?.length, error: err2?.message })

  const { data: siteStats, error: err3 } = await supabase.from('site_stats').select('*')
  console.log('site_stats:', { count: siteStats?.length, error: err3?.message })
}

checkData()
