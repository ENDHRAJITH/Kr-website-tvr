import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'kr_super_secret_jwt_key_2026_marketing_studioz'
const secretKey = new TextEncoder().encode(JWT_SECRET)

export interface AdminJWTPayload {
  userId: string
  username: string
  email: string
  name: string
  role: string
}

export async function signAdminJWT(payload: AdminJWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)
}

export async function verifyAdminJWT(token: string): Promise<AdminJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return {
      userId: String(payload.userId || payload.sub || ''),
      username: String(payload.username || ''),
      email: String(payload.email || ''),
      name: String(payload.name || ''),
      role: String(payload.role || 'admin'),
    }
  } catch {
    return null
  }
}
