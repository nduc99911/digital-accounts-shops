import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const COOKIE_NAME = 'buile_customer'

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: string) {
  const token = crypto.randomBytes(24).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)

  await prisma.customerSession.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  })

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearSession() {
  const token = cookies().get(COOKIE_NAME)?.value
  if (token) {
    await prisma.customerSession.deleteMany({ where: { token } }).catch(() => {})
  }
  cookies().set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}

export async function getCurrentCustomer() {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token) return null

  const session = await prisma.customerSession.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session) return null
  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.customerSession.delete({ where: { token } }).catch(() => {})
    return null
  }

  return session.user
}
