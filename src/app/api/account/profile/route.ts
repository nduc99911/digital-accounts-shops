import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentCustomer } from '@/lib/customerAuth'

export async function POST(req: Request) {
  const user = await getCurrentCustomer()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await req.formData()
  const name = String(form.get('name') || '').trim()
  const phone = String(form.get('phone') || '').trim()

  try {
    await prisma.customerUser.update({
      where: { id: user.id },
      data: {
        name: name || null,
        phone: phone || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Có lỗi xảy ra khi cập nhật thông tin' }, { status: 500 })
  }
}
