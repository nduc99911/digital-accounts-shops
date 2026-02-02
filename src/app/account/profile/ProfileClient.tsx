'use client'

import { useState } from 'react'

interface User {
  id: string
  name: string | null
  email: string
  phone: string | null
}

export default function ProfileClient({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  const [profileMessage, setProfileMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Sidebar Navigation */}
      <div className="space-y-4">
        {/* User Info Card */}
        <div 
          className="overflow-hidden rounded-3xl animate-fade-in"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-6">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white text-2xl font-bold">
                {(user.name?.[0] || user.email[0]).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-white">{user.name || 'Khách hàng'}</h3>
                <p className="text-sm text-white/80">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div 
          className="overflow-hidden rounded-3xl animate-fade-in"
          style={{
            animationDelay: '0.1s',
            animationFillMode: 'both',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
          }}
        >
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30'
                  : 'text-slate-700 hover:bg-violet-50 hover:text-violet-600 dark:text-slate-300 dark:hover:bg-violet-500/10 dark:hover:text-violet-400'
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                activeTab === 'password'
                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30'
                  : 'text-slate-700 hover:bg-violet-50 hover:text-violet-600 dark:text-slate-300 dark:hover:bg-violet-500/10 dark:hover:text-violet-400'
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Đổi mật khẩu
            </button>
          </nav>
        </div>

        {/* Quick Links */}
        <div 
          className="overflow-hidden rounded-3xl animate-fade-in"
          style={{
            animationDelay: '0.2s',
            animationFillMode: 'both',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className="p-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Liên kết nhanh</h4>
            <div className="space-y-2">
              <a href="/" className="flex items-center gap-2 text-sm text-slate-600 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Về trang chủ
              </a>
              <a href="/account/orders" className="flex items-center gap-2 text-sm text-slate-600 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Đơn hàng của tôi
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        {activeTab === 'profile' ? (
          <ProfileForm 
            user={user} 
            message={profileMessage} 
            setMessage={setProfileMessage}
          />
        ) : (
          <PasswordForm 
            message={passwordMessage} 
            setMessage={setPasswordMessage}
          />
        )}
      </div>
    </div>
  )
}

function ProfileForm({ 
  user, 
  message, 
  setMessage 
}: { 
  user: User
  message: string
  setMessage: (msg: string) => void 
}) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch('/api/account/profile', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      
      if (res.ok) {
        setMessage('success:Cập nhật thông tin thành công!')
      } else {
        setMessage(`error:${data.error || 'Có lỗi xảy ra'}`)
      }
    } catch {
      setMessage('error:Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="overflow-hidden rounded-3xl"
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
      }}
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-5">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
        <h2 className="relative text-lg font-bold text-white">Thông tin cá nhân</h2>
        <p className="relative text-sm text-white/80">Cập nhật thông tin cá nhân của bạn</p>
      </div>

      <div className="p-6">
        {message && (
          <div 
            className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${
              message.startsWith('success:')
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
            }`}
          >
            {message.replace(/^(success|error):/, '')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Họ và tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  defaultValue={user.name || ''}
                  placeholder="Nhập họ và tên"
                  className="w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 py-3 pl-12 pr-4 text-slate-500 cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-500">Email không thể thay đổi</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Số điện thoại
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={user.phone || ''}
                  placeholder="Nhập số điện thoại"
                  className="w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-violet-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang lưu...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function PasswordForm({ 
  message, 
  setMessage 
}: { 
  message: string
  setMessage: (msg: string) => void 
}) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (newPassword !== confirmPassword) {
      setMessage('error:Mật khẩu mới không khớp')
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setMessage('error:Mật khẩu mới phải có ít nhất 6 ký tự')
      setIsLoading(false)
      return
    }
    
    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      
      if (res.ok) {
        setMessage('success:Đổi mật khẩu thành công!')
        ;(e.target as HTMLFormElement).reset()
      } else {
        setMessage(`error:${data.error || 'Có lỗi xảy ra'}`)
      }
    } catch {
      setMessage('error:Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="overflow-hidden rounded-3xl"
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
      }}
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-5">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
        <h2 className="relative text-lg font-bold text-white">Đổi mật khẩu</h2>
        <p className="relative text-sm text-white/80">Cập nhật mật khẩu để bảo vệ tài khoản</p>
      </div>

      <div className="p-6">
        {message && (
          <div 
            className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${
              message.startsWith('success:')
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
            }`}
          >
            {message.replace(/^(success|error):/, '')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                name="currentPassword"
                placeholder="Nhập mật khẩu hiện tại"
                required
                className="w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Mật khẩu mới
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Nhập mật khẩu mới"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-500">Ít nhất 6 ký tự</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-violet-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang lưu...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Cập nhật mật khẩu
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
