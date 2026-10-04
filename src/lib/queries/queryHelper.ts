import { createClient } from '@/lib/supabase/server'

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(
    url &&
      key &&
      url !== 'https://placeholder.supabase.co' &&
      !url.includes('placeholder') &&
      key !== 'placeholder-key'
  )
}

export async function safeSupabaseQuery<T>(
  queryFn: (supabase: any) => Promise<T>,
  fallbackValue: T,
  timeoutMs: number = 1200
): Promise<T> {
  if (!isSupabaseConfigured()) {
    return fallbackValue
  }

  let timer: NodeJS.Timeout
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      resolve(fallbackValue)
    }, timeoutMs)
  })

  try {
    const supabase = await createClient()
    const result = await Promise.race([queryFn(supabase), timeoutPromise])
    if (timer!) clearTimeout(timer)
    return result ?? fallbackValue
  } catch (err) {
    if (timer!) clearTimeout(timer)
    return fallbackValue
  }
}
