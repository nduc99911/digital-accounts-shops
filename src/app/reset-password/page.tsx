'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/app/_ui/ToastProvider'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      showToast('Link không hợp lệ', 'error')
    }
  }, [token, showToast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      showToast('Mật khẩu không khớp', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      if (res.ok) {
        setSuccess(true)
        showToast('Đặt lại mật khẩu thành công!', 'success')
        setTimeout(() => router.push('/login'), 2000)
      } else {
        showToast('Link đã hết hạn hoặc không hợp lệ', 'error')
      }
    } catch {
      showToast('Có lỗi xảy ra', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white/80 backdrop-blur-xl p-8 shadow-2xl border border-white/50">
        <h1 className="text-2xl font-black text-center bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Đặt lại mật khẩu
        </h1>

        {success ? (
          <div className="mt-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="mt-4 text-slate-600">Thành công! Chuyển đến đăng nhập...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu mới"
              required
              minLength={6}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 font-bold text-white shadow-lg disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="text-violet-600 hover:underline">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}
