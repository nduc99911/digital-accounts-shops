import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { prisma } from '@/lib/prisma'

// Generate VietQR string
function generateVietQR({
  bankBin,
  accountNumber,
  amount,
  content,
}: {
  bankBin: string
  accountNumber: string
  amount: number
  content: string
}): string {
  // Clean content (remove spaces, limit length)
  const cleanContent = content.replace(/\s+/g, '').slice(0, 25)
  
  // Build QR string according to VietQR standard
  const qrData = [
    '000201', // Payload Format Indicator
    '010212', // Point of Initiation Method (12 = static, 11 = dynamic)
    `38${32 + bankBin.length + accountNumber.length}`, // Merchant Account Information template
    '0010A000000727', // Global Unique Identifier
    `01${8 + bankBin.length}`, // Payment Network Specific
    `0006${bankBin}`, // BIN bank
    `01${8 + accountNumber.length}`,
    `0006${accountNumber}`,
    '0208QRIBFTTA', // Service Code
    `53${String(amount).length + 4}0384`, // Transaction Currency (VND = 704)
    `54${String(amount).length}`,
    `${amount}`,
    `58${'VN'.length}`,
    'VN', // Country Code
    `62${4 + cleanContent.length}`, // Additional Data Field
    `08${cleanContent.length}`,
    `${cleanContent}`,
    '6304', // CRC
  ].join('')
  
  return qrData
}

// Calculate CRC16-CCITT
function calculateCRC(payload: string): string {
  let crc = 0xFFFF
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1)
      crc &= 0xFFFF
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

// Bank BIN mapping
const BANK_BINS: Record<string, string> = {
  'Vietcombank': '970436',
  'Techcombank': '970407',
  'ACB': '970416',
  'MB Bank': '970422',
  'TPBank': '970423',
  'VPBank': '970432',
  'BIDV': '970418',
  'Sacombank': '970403',
  'VietinBank': '970415',
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }
    
    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    // Get payment settings
    const payment = await prisma.paymentSetting.findFirst({
      where: { active: true },
    })
    
    if (!payment) {
      return NextResponse.json({ error: 'Payment not configured' }, { status: 400 })
    }
    
    // Get bank BIN
    const bankBin = BANK_BINS[payment.bankName]
    if (!bankBin) {
      return NextResponse.json({ error: 'Unsupported bank' }, { status: 400 })
    }
    
    // Generate transfer content
    const transferContent = `Thanh toan don ${order.code}`
    
    // Generate QR data
    const qrPayload = generateVietQR({
      bankBin,
      accountNumber: payment.accountNumber,
      amount: order.totalVnd,
      content: transferContent,
    }) + 'XXXX' // Placeholder for CRC
    
    const crc = calculateCRC(qrPayload.slice(0, -4))
    const finalPayload = qrPayload.slice(0, -4) + crc
    
    // Generate QR image
    const qrDataUrl = await QRCode.toDataURL(finalPayload, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    
    return NextResponse.json({
      qrDataUrl,
      transferContent,
      bankName: payment.bankName,
      accountNumber: payment.accountNumber,
      accountName: payment.accountName,
      amount: order.totalVnd,
    })
    
  } catch (error) {
    console.error('QR generation error:', error)
    return NextResponse.json({ error: 'Failed to generate QR' }, { status: 500 })
  }
}
