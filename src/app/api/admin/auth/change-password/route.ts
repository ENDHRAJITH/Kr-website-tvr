import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminJWT } from '@/lib/auth/jwt'
import { comparePassword, hashPassword } from '@/lib/auth/password'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('kr_admin_jwt')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const payload = await verifyAdminJWT(token)
    if (!payload) {
      return NextResponse.json({ error: 'Session expired. Please login again.' }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword, confirmPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both current password and new password are required.' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long.' }, { status: 400 })
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New password and confirm password do not match.' }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Fetch user from admin_users table
    const { data: user, error: fetchErr } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', payload.username)
      .maybeSingle()

    if (user) {
      const isValid = await comparePassword(currentPassword, user.password_hash)
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
      }

      const newHash = await hashPassword(newPassword)

      const { error: updateErr } = await supabase
        .from('admin_users')
        .update({
          password_hash: newHash,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully! Please use your new password next time you log in.',
      })
    }

    // 2. Fallback if database row doesn't exist yet (Insert user into DB with new password hash)
    const envAdminPass = process.env.ADMIN_PASSWORD || 'kr2026admin'
    if (currentPassword !== envAdminPass) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
    }

    const newHash = await hashPassword(newPassword)
    const { error: insertErr } = await supabase.from('admin_users').insert([
      {
        username: payload.username || 'admin',
        email: payload.email || 'admin@krdigitalstudioz.com',
        password_hash: newHash,
        name: payload.name || 'KR Admin',
        role: 'super_admin',
        is_active: true,
      },
    ])

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Admin password initialized and saved to database successfully!',
    })
  } catch (err: any) {
    console.error('Error changing admin password:', err)
    return NextResponse.json({ error: err.message || 'Failed to update password.' }, { status: 500 })
  }
}
