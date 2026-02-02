import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''

  if (!q || q.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  const suggestions = await prisma.product.findMany({
    where: {
      active: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { shortDesc: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      slug: true,
      name: true,
      salePriceVnd: true,
      listPriceVnd: true,
      imageUrl: true,
      soldQty: true,
    },
    orderBy: [{ soldQty: 'desc' }, { createdAt: 'desc' }],
    take: 6,
  })

  return NextResponse.json({ suggestions })
}
