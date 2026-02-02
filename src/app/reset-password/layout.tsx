import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đặt lại mật khẩu',
  description: 'Tạo mật khẩu mới cho tài khoản của bạn.',
  robots: { index: false, follow: false },
}

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
