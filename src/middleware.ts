import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminJWT } from '@/lib/auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLoginPage = pathname === '/admin/login'

  const jwtToken = request.cookies.get('kr_admin_jwt')?.value
  const isValidJWT = jwtToken ? await verifyAdminJWT(jwtToken) : null

  // If user is trying to access /admin routes without a valid JWT session, redirect to /admin/login
  if (!isLoginPage && !isValidJWT) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If user is already authenticated with a valid JWT and visits /admin/login, redirect to /admin
  if (isLoginPage && isValidJWT) {
    const adminUrl = new URL('/admin', request.url)
    return NextResponse.redirect(adminUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
