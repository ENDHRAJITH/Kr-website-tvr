import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => list.forEach(({ name, value }) =>
          response.cookies.set(name, value)
        ),
      },
    }
  )

  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const hasAdminCookie = request.cookies.get('kr_admin_session')?.value === 'true'

  // If env vars are placeholder or has admin cookie, allow access
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || hasAdminCookie) {
    return response
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/admin') && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
