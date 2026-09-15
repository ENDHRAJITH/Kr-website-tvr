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

async function resetUnsplashSlides() {
  console.log('Clearing old Unsplash slide URLs from Supabase DB...')
  
  const { error: err1 } = await supabase
    .from('founder_decks')
    .update({ slides: [] })
    .eq('id', 'rajitha-deck')

  const { error: err2 } = await supabase
    .from('founder_decks')
    .update({ slides: [] })
    .eq('id', 'karthik-deck')

  if (err1 || err2) {
    console.error('Error clearing slides:', err1 || err2)
  } else {
    console.log('✅ Successfully cleared Unsplash placeholder slides from Supabase DB!')
  }
}

resetUnsplashSlides()
