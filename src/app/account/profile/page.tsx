import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentCustomer } from '@/lib/customerAuth'
import SiteHeader from '../../_ui/SiteHeader'
import ProfileClient from './ProfileClient'

export default async function ProfilePage() {
  const user = await getCurrentCustomer()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <SiteHeader />

      {/* Page header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-fuchsia-600/5 to-cyan-600/5" />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/30">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Thông tin tài khoản</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Quản lý thông tin cá nhân và bảo mật</p>
              </div>
            </div>

            <Link
              href="/account/orders"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-violet-100 hover:text-violet-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-violet-900/30 dark:hover:text-violet-400 animate-fade-in"
              style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Đơn hàng của tôi
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <ProfileClient 
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
          }} 
        />
      </main>
    </div>
  )
}
