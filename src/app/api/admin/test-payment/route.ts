import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'

// Test SePay webhook - for development only
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Test endpoint not available in production' }, { status: 403 })
  }

  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { orderId, amount } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status === 'SUCCESS') {
      return NextResponse.json({ error: 'Order already paid' }, { status: 400 })
    }

    const paidAmount = amount || order.totalVnd

    // Simulate SePay webhook payload
    const mockTx = {
      gateway: 'TEST_BANK',
      transactionDate: new Date().toISOString(),
      accountNumber: 'TEST123456',
      code: null,
      content: `Thanh toan don ${order.code}`,
      transferType: 'in',
      transferAmount: paidAmount,
      accumulated: 9999999,
      subAccount: null,
      referenceCode: `TEST${Date.now()}`,
      description: `Test payment for order ${order.code}`,
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'SUCCESS',
        updatedAt: new Date(),
      },
    })

    // Create payment transaction
    await prisma.paymentTransaction.create({
      data: {
        provider: 'TEST',
        txId: mockTx.referenceCode,
        occurredAt: new Date(),
        amountInVnd: paidAmount,
        balanceVnd: mockTx.accumulated,
        description: mockTx.content,
        raw: JSON.stringify(mockTx),
      },
    })

    // Auto-fulfill
    const fulfillments = []
    for (const item of order.items) {
      const availableStock = await prisma.stockItem.findFirst({
        where: {
          productId: item.productId,
          usedAt: null,
        },
        orderBy: { createdAt: 'asc' },
      })

      if (availableStock) {
        const fulfillment = await prisma.orderFulfillment.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            stockItemId: availableStock.id,
            value: availableStock.value,
          },
        })
        fulfillments.push(fulfillment)

        await prisma.stockItem.update({
          where: { id: availableStock.id },
          data: { usedAt: new Date() },
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Test payment processed',
      orderCode: order.code,
      amount: paidAmount,
      fulfillments: fulfillments.length,
    })

  } catch (error) {
    console.error('Test payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
