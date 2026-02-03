import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'

// In-memory notifications (in production, use Redis or database)
const notifications: any[] = []

export async function GET(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const since = searchParams.get('since')

  // Get recent orders as notifications
  const recentOrders = await prisma.order.findMany({
    where: since ? { createdAt: { gt: new Date(since) } } : {},
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      code: true,
      customerName: true,
      totalVnd: true,
      status: true,
      createdAt: true,
    },
  })

  const orderNotifications = recentOrders.map(order => ({
    id: `order-${order.id}`,
    type: 'order',
    title: 'Đơn hàng mới',
    message: `${order.customerName} - ${order.totalVnd.toLocaleString()}đ`,
    createdAt: order.createdAt,
    read: false,
    data: order,
  }))

  return NextResponse.json({ notifications: orderNotifications })
}

// Add notification manually (for testing or system events)
export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const notification = {
    id: Math.random().toString(36).substr(2, 9),
    ...body,
    createdAt: new Date().toISOString(),
    read: false,
  }
  notifications.unshift(notification)
  
  // Keep only last 100 notifications
  if (notifications.length > 100) {
    notifications.pop()
  }

  return NextResponse.json({ notification })
}
