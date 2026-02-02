import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentCustomer } from '@/lib/customerAuth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')
  
  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(reviews)
}

export async function POST(request: NextRequest) {
  const user = await getCurrentCustomer()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { productId, rating, comment } = await request.json()

  // Check if user bought this product
  const order = await prisma.order.findFirst({
    where: {
      userId: user.id,
      items: { some: { productId } },
      status: 'SUCCESS',
    },
  })

  if (!order) {
    return NextResponse.json({ error: 'Must buy product to review' }, { status: 403 })
  }

  const review = await prisma.review.create({
    data: {
      productId,
      userId: user.id,
      rating,
      comment,
    },
  })

  return NextResponse.json(review)
}
