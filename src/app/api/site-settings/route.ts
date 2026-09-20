import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

let inMemorySettings: Record<string, string> = {
  home_hero_image_url: '/images/kr-founders-hero.png',
  home_hero_image_scale: '100',
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('site_stats')
      .select('*')
      .in('label', ['home_hero_image_url', 'home_hero_image_scale'])

    if (data && data.length > 0) {
      data.forEach((row: any) => {
        inMemorySettings[row.label] = row.value
      })
    }

    return NextResponse.json({
      success: true,
      settings: inMemorySettings,
    })
  } catch {
    return NextResponse.json({
      success: true,
      settings: inMemorySettings,
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { home_hero_image_url, home_hero_image_scale } = body

    const supabase = await createClient()

    if (home_hero_image_url) {
      inMemorySettings.home_hero_image_url = home_hero_image_url
      const { data: existing } = await supabase
        .from('site_stats')
        .select('id')
        .eq('label', 'home_hero_image_url')
        .maybeSingle()

      if (existing) {
        await supabase
          .from('site_stats')
          .update({ value: home_hero_image_url })
          .eq('id', existing.id)
      } else {
        await supabase.from('site_stats').insert([
          {
            label: 'home_hero_image_url',
            value: home_hero_image_url,
            icon: 'image',
            display_order: 98,
          },
        ])
      }
    }

    if (home_hero_image_scale !== undefined) {
      const scaleStr = String(home_hero_image_scale)
      inMemorySettings.home_hero_image_scale = scaleStr

      const { data: existing } = await supabase
        .from('site_stats')
        .select('id')
        .eq('label', 'home_hero_image_scale')
        .maybeSingle()

      if (existing) {
        await supabase
          .from('site_stats')
          .update({ value: scaleStr })
          .eq('id', existing.id)
      } else {
        await supabase.from('site_stats').insert([
          {
            label: 'home_hero_image_scale',
            value: scaleStr,
            icon: 'maximize',
            display_order: 97,
          },
        ])
      }
    }

    return NextResponse.json({
      success: true,
      settings: inMemorySettings,
      message: 'Home Hero Image settings updated successfully!',
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update settings' },
      { status: 500 }
    )
  }
}
