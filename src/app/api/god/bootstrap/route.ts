import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

// Create a default admin if none exists
export async function POST() {
  const count = await prisma.adminUser.count()
  if (count > 0) {
    return NextResponse.json({ ok: true, created: false })
  }

  const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'admin12345'
  const passwordHash = await hashPassword(password)

  await prisma.adminUser.create({
    data: {
      name: 'Admin',
      username,
      passwordHash,
    },
  })

  return NextResponse.json({ ok: true, created: true })
}
