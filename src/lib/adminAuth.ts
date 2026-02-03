import { cookies } from 'next/headers'
import { compare, hash } from 'bcryptjs'

const ADMIN_AUTH_COOKIE = 'admin_auth'
const ADMIN_TOKEN = 'admin_token_secure_2024'

export async function setAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_AUTH_COOKIE, ADMIN_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_AUTH_COOKIE)
}

export async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_AUTH_COOKIE)?.value
  return token === ADMIN_TOKEN
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash)
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}
