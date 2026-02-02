import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const { code, orderTotal } = await request.json()

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  })

  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: 'Mã không hợp lệ' }, { status: 400 })
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Mã đã hết hạn' }, { status: 400 })
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return NextResponse.json({ error: 'Mã đã hết lượt sử dụng' }, { status: 400 })
  }

  if (orderTotal < coupon.minOrder) {
    return NextResponse.json({ 
      error: `Đơn hàng tối thiểu ${coupon.minOrder.toLocaleString()}đ` 
    }, { status: 400 })
  }

  let discountAmount = coupon.type === 'PERCENT'
    ? Math.floor(orderTotal * (coupon.discount / 100))
    : coupon.discount

  if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
    discountAmount = coupon.maxDiscount
  }

  return NextResponse.json({
    code: coupon.code,
    discount: discountAmount,
    type: coupon.type,
  })
}
