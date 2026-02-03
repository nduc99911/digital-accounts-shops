import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentCustomer } from '@/lib/customerAuth'

// Get reviews for a product
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

  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0

  return NextResponse.json({ 
    reviews,
    avgRating: Math.round(avgRating * 10) / 10,
    totalReviews: reviews.length 
  })
}

// Create a review (only for logged in users who purchased the product)
export async function POST(request: NextRequest) {
  const user = await getCurrentCustomer()
  if (!user) {
    return NextResponse.json({ error: 'Vui lòng đăng nhập để đánh giá' }, { status: 401 })
  }

  const body = await request.json()
  const { productId, rating, comment } = body

  if (!productId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Thông tin không hợp lệ' }, { status: 400 })
  }

  // Check if user purchased this product
  const hasPurchased = await prisma.order.findFirst({
    where: {
      userId: user.id,
      status: 'SUCCESS',
      items: {
        some: { productId }
      }
    }
  })

  if (!hasPurchased) {
    return NextResponse.json({ 
      error: 'Bạn cần mua sản phẩm này trước khi đánh giá' 
    }, { status: 403 })
  }

  // Check if user already reviewed
  const existingReview = await prisma.review.findFirst({
    where: { productId, userId: user.id }
  })

  if (existingReview) {
    // Update existing review
    const updated = await prisma.review.update({
      where: { id: existingReview.id },
      data: { rating, comment: comment || '' },
      include: { user: { select: { name: true } } }
    })
    return NextResponse.json({ review: updated })
  }

  // Create new review
  const review = await prisma.review.create({
    data: {
      productId,
      userId: user.id,
      rating,
      comment: comment || '',
    },
    include: { user: { select: { name: true } } }
  })

  return NextResponse.json({ review })
}
