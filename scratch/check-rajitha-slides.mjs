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

async function inspectSlides() {
  const { data } = await supabase.from('founder_decks').select('*').eq('id', 'rajitha-deck').single()
  console.log('--- RAJITHA DECK IN SUPABASE DB ---')
  console.log('Slides in DB:', data?.slides)
}

inspectSlides()
