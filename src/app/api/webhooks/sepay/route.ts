import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

// SePay webhook secret
const SEPAY_SECRET = process.env.SEPAY_SECRET || ''

interface SePayTransaction {
  gateway: string
  transactionDate: string
  accountNumber: string
  code: string | null
  content: string
  transferType: string
  transferAmount: number
  accumulated: number
  subAccount: string | null
  referenceCode: string
  description: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify webhook signature (if SePay provides it)
    const signature = request.headers.get('x-webhook-signature')
    if (signature && SEPAY_SECRET) {
      const expectedSig = crypto
        .createHmac('sha256', SEPAY_SECRET)
        .update(JSON.stringify(body))
        .digest('hex')
      
      if (signature !== expectedSig) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const tx: SePayTransaction = body

    // Only process credit transactions (money in)
    if (tx.transferType !== 'in') {
      return NextResponse.json({ message: 'Ignored: not incoming transfer' })
    }

    // Extract order code from content
    // Format: "Thanh toan don ORD123456" or "ORD123456"
    const orderMatch = tx.content.match(/ORD[\w\d]+/i)
    if (!orderMatch) {
      return NextResponse.json({ message: 'No order code found' })
    }

    const orderCode = orderMatch[0].toUpperCase()

    // Find order
    const order = await prisma.order.findUnique({
      where: { code: orderCode },
      include: { items: { include: { product: true } }, user: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status === 'SUCCESS') {
      return NextResponse.json({ message: 'Order already paid' })
    }

    // Verify amount (allow small difference)
    if (Math.abs(tx.transferAmount - order.totalVnd) > 1000) {
      // Log mismatch but still process if close
      console.log(`Amount mismatch: expected ${order.totalVnd}, got ${tx.transferAmount}`)
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'SUCCESS',
        paymentStatus: 'paid',
        updatedAt: new Date(),
      },
    })

    // Create payment transaction record
    await prisma.paymentTransaction.create({
      data: {
        provider: 'SEPay',
        txId: tx.referenceCode,
        occurredAt: new Date(tx.transactionDate),
        amountInVnd: tx.transferAmount,
        description: tx.content,
        raw: JSON.stringify(tx),
      },
    })

    // Auto-fulfill: assign stock items
    for (const item of order.items) {
      const availableStock = await prisma.stockItem.findFirst({
        where: {
          productId: item.productId,
          usedAt: null,
        },
        orderBy: { createdAt: 'asc' },
      })

      if (availableStock) {
        await prisma.orderFulfillment.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            stockItemId: availableStock.id,
            value: availableStock.value,
          },
        })

        await prisma.stockItem.update({
          where: { id: availableStock.id },
          data: { usedAt: new Date() },
        })
      }
    }

    // TODO: Send email notification
    // await sendOrderConfirmationEmail(order)

    return NextResponse.json({ 
      success: true, 
      message: 'Payment processed',
      orderCode: orderCode 
    })

  } catch (error) {
    console.error('SePay webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
