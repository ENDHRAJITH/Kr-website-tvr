import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' })

  response.cookies.set('kr_admin_jwt', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  })

  response.cookies.set('kr_admin_session', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  })

  return response
}

export async function GET() {
  return POST()
}
