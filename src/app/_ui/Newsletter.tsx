'use client'

import { useState } from 'react'
import { useToast } from '@/app/_ui/ToastProvider'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        showToast('Đăng ký thành công!', 'success')
        setEmail('')
      } else {
        showToast('Email đã đăng ký hoặc không hợp lệ', 'error')
      }
    } catch {
      showToast('Có lỗi xảy ra', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6">
      <h3 className="text-lg font-bold text-white">📧 Đăng ký nhận ưu đãi</h3>
      <p className="mt-2 text-sm text-white/80">
        Nhận thông báo khuyến mãi và mã giảm giá mới nhất
      </p>
      <form onSubmit={subscribe} className="mt-4 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email"
          required
          className="flex-1 rounded-xl px-4 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-violet-600 disabled:opacity-50"
        >
          {loading ? '...' : 'Đăng ký'}
        </button>
      </form>
    </div>
  )
}
