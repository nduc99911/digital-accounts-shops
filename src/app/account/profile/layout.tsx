import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thông tin tài khoản',
  description: 'Quản lý thông tin cá nhân và bảo mật tài khoản.',
  robots: { index: false, follow: false },
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
