import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

// DEV ONLY helper: reset admin credentials from .env
// Call: POST /api/admin/reset?key=dev
export async function POST(req: Request) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key')

  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Disabled in production' }, { status: 403 })
  }

  if (!key || key !== (process.env.ADMIN_SEED_KEY || 'dev')) {
    return NextResponse.json({ error: 'Missing/invalid key' }, { status: 401 })
  }

  const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'admin12345'

  const passwordHash = await hashPassword(password)

  const existing = await prisma.adminUser.findUnique({ where: { username } })

  if (existing) {
    await prisma.adminUser.update({
      where: { id: existing.id },
      data: { passwordHash },
    })
  } else {
    // if an admin exists but different username, keep it and create a new one for this username
    await prisma.adminUser.create({
      data: {
        name: 'Admin',
        username,
        passwordHash,
      },
    })
  }

  return NextResponse.json({ ok: true, username, password })
}
