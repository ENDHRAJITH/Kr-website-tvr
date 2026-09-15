import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminJWT } from '@/lib/auth/jwt'
import { hashPassword } from '@/lib/auth/password'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('kr_admin_jwt')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await verifyAdminJWT(token)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()
    const { data: users, error } = await supabase
      .from('admin_users')
      .select('id, username, email, name, role, is_active, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ users: [] })
    }

    return NextResponse.json({ users: users || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('kr_admin_jwt')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await verifyAdminJWT(token)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { username, email, password, name, role = 'admin' } = body

    if (!username || !email || !password || !name) {
      return NextResponse.json({ error: 'All fields (Name, Username, Email, Password) are required.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)
    const supabase = await createClient()

    const { data: newUser, error } = await supabase
      .from('admin_users')
      .insert([
        {
          username: String(username).trim().toLowerCase(),
          email: String(email).trim().toLowerCase(),
          password_hash: passwordHash,
          name: String(name).trim(),
          role: String(role || 'admin'),
          is_active: true,
        },
      ])
      .select('id, username, email, name, role, is_active, created_at')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Admin user "${name}" added successfully!`,
      user: newUser,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create user' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('kr_admin_jwt')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await verifyAdminJWT(token)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Prevent deleting self
    if (id === payload.userId) {
      return NextResponse.json({ error: 'You cannot delete your own admin account while logged in.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from('admin_users').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Admin user removed successfully.' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
