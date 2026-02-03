import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  // Total stats
  const [
    totalOrders,
    totalRevenue,
    todayOrders,
    todayRevenue,
    monthOrders,
    monthRevenue,
    pendingOrders,
    totalProducts,
    lowStockProducts,
    totalCustomers,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { totalVnd: true },
    }),
    prisma.order.count({
      where: { createdAt: { gte: today } },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: today }, status: 'SUCCESS' },
      _sum: { totalVnd: true },
    }),
    prisma.order.count({
      where: { createdAt: { gte: thisMonth } },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: thisMonth }, status: 'SUCCESS' },
      _sum: { totalVnd: true },
    }),
    prisma.order.count({
      where: { status: 'PENDING_PAYMENT' },
    }),
    prisma.product.count(),
    prisma.product.count({
      where: {
        OR: [
          { stockQty: { lte: 5 } },
          { stockItems: { none: { usedAt: null } } },
        ],
      },
    }),
    prisma.customerUser.count(),
  ])

  // Top products
  const topProducts = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: { qty: true },
    orderBy: { _sum: { qty: 'desc' } },
    take: 5,
  })

  const topProductsWithDetails = await Promise.all(
    topProducts.map(async (p) => {
      const product = await prisma.product.findUnique({
        where: { id: p.productId },
        select: { name: true, imageUrl: true },
      })
      return {
        name: product?.name || 'Unknown',
        imageUrl: product?.imageUrl,
        sold: p._sum.qty || 0,
      }
    })
  )

  // Recent orders
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      items: { include: { product: { select: { name: true } } } },
    },
  })

  // Daily revenue for chart (last 30 days)
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const dailyRevenue = await prisma.order.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: { gte: thirtyDaysAgo },
      status: 'SUCCESS',
    },
    _sum: { totalVnd: true },
  })

  return NextResponse.json({
    stats: {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalVnd || 0,
      todayOrders,
      todayRevenue: todayRevenue._sum.totalVnd || 0,
      monthOrders,
      monthRevenue: monthRevenue._sum.totalVnd || 0,
      pendingOrders,
      totalProducts,
      lowStockProducts,
      totalCustomers,
    },
    topProducts: topProductsWithDetails,
    recentOrders,
    dailyRevenue: dailyRevenue.map((d) => ({
      date: d.createdAt.toISOString().split('T')[0],
      revenue: d._sum.totalVnd || 0,
    })),
  })
}
