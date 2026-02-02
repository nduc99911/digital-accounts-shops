import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentCustomer } from '@/lib/customerAuth'

export async function GET() {
  const user = await getCurrentCustomer()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(user)
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentCustomer()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { name, phone } = await request.json()
  
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name, phone },
  })
  
  return NextResponse.json(updated)
}
