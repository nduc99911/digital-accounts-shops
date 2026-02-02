import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  try {
    await prisma.subscriber.create({
      data: { email },
    })
    return NextResponse.json({ success: true })
  } catch {
    // Email already exists
    return NextResponse.json({ error: 'Email đã đăng ký' }, { status: 400 })
  }
}
