import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'buile_admin'

// Next.js 16+ dynamic APIs: cookies() is async
async function cookieStore() {
  return cookies()
}

export async function isAuthed() {
  const c = await cookieStore()
  const v = c.get(COOKIE_NAME)?.value
  return v === '1'
}

export async function requireAuth() {
  return isAuthed()
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function setAuthCookie() {
  const c = await cookieStore()
  c.set(COOKIE_NAME, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearAuthCookie() {
  const c = await cookieStore()
  c.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}
