'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useToast } from '@/app/_ui/ToastProvider'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setSent(true)
        showToast('Email đã được gửi!', 'success')
      } else {
        showToast('Email không tồn tại', 'error')
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
          Quên mật khẩu?
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Nhập email để nhận link đặt lại mật khẩu
        </p>

        {sent ? (
          <div className="mt-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="mt-4 text-slate-600">Vui lòng kiểm tra email của bạn!</p>
            <Link href="/login" className="mt-4 inline-block text-violet-600 hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 font-bold text-white shadow-lg disabled:opacity-50"
            >
              {loading ? 'Đang gửi...' : 'Gửi link đặt lại'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link href="/login" className="text-violet-600 hover:underline">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}
