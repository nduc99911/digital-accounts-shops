import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đơn hàng của tôi',
  description: 'Xem lịch sử đơn hàng và trạng thái đơn hàng của bạn.',
  robots: { index: false, follow: false },
}

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
