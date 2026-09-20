import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ClientLogo } from '@/types/database'
import { readFile } from 'fs/promises'
import path from 'path'

const FILE_PATH = path.join(process.cwd(), 'public', 'data', 'clientLogos.json')

const DEFAULT_CLIENT_LOGOS: ClientLogo[] = [
  {
    id: 'cl-bni',
    name: 'BNI Emperor Chapter',
    logo_url: '/images/bni-logo.png',
    link: 'https://bni.com',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'cl-kr-digital',
    name: 'KR Digital Marketing',
    logo_url: '/kr-logo.png',
    link: null,
    display_order: 2,
    is_active: true,
  },
  {
    id: 'cl-real-estate',
    name: 'Delta Real Estate Developers',
    logo_url: '/kr-logo.png',
    link: null,
    display_order: 3,
    is_active: true,
  },
  {
    id: 'cl-studioz',
    name: 'KR Studioz Wedding Films',
    logo_url: '/kr-logo.png',
    link: null,
    display_order: 4,
    is_active: true,
  },
  {
    id: 'cl-thiruvarur-realtors',
    name: 'Thiruvarur Land & Plot Sales',
    logo_url: '/kr-logo.png',
    link: null,
    display_order: 5,
    is_active: true,
  },
  {
    id: 'cl-nri-marketing',
    name: 'Gulf & SEA NRI Investor Network',
    logo_url: '/kr-logo.png',
    link: null,
    display_order: 6,
    is_active: true,
  },
]

export async function GET() {
  try {
    // 1. Try reading from Supabase
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('client_logos')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (!error && data && data.length > 0) {
        return NextResponse.json({ logos: data as ClientLogo[], source: 'supabase' })
      }
    } catch {}

    // 2. Try reading from local disk JSON
    try {
      const content = await readFile(FILE_PATH, 'utf-8')
      const localData = JSON.parse(content)
      if (Array.isArray(localData) && localData.length > 0) {
        return NextResponse.json({ logos: localData as ClientLogo[], source: 'disk' })
      }
    } catch {}

    // 3. Fallback defaults
    return NextResponse.json({ logos: DEFAULT_CLIENT_LOGOS, source: 'default' })
  } catch (error: any) {
    return NextResponse.json({ logos: DEFAULT_CLIENT_LOGOS, error: error.message }, { status: 500 })
  }
}
