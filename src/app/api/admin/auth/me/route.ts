import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminJWT } from '@/lib/auth/jwt'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('kr_admin_jwt')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const payload = await verifyAdminJWT(token)

    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      user: payload,
    })
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 401 })
  }
}
