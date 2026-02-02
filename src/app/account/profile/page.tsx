'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/app/_ui/ToastProvider'

interface User {
  id: string
  email: string
  name: string | null
  phone: string | null
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data)
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
        })
      }
    } catch {
      showToast('Không thể tải thông tin', 'error')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        showToast('Cập nhật thành công!', 'success')
      } else {
        showToast('Cập nhật thất bại', 'error')
      }
    } catch {
      showToast('Có lỗi xảy ra', 'error')
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Mật khẩu mới không khớp', 'error')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })
      if (res.ok) {
        showToast('Đổi mật khẩu thành công!', 'success')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        showToast('Mật khẩu hiện tại không đúng', 'error')
      }
    } catch {
      showToast('Có lỗi xảy ra', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Tài khoản của tôi
        </h1>

        {/* Profile Info */}
        <div className="mt-6 rounded-3xl bg-white/80 backdrop-blur-xl p-6 shadow-xl border border-white/50">
          <h2 className="text-xl font-bold text-slate-900">Thông tin cá nhân</h2>
          <form onSubmit={updateProfile} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="mt-1 w-full rounded-xl bg-slate-100 px-4 py-3 text-slate-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Họ tên</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none"
                placeholder="Nhập họ tên"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Số điện thoại</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 font-bold text-white shadow-lg disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="mt-6 rounded-3xl bg-white/80 backdrop-blur-xl p-6 shadow-xl border border-white/50">
          <h2 className="text-xl font-bold text-slate-900">Đổi mật khẩu</h2>
          <form onSubmit={changePassword} className="mt-4 space-y-4">
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              placeholder="Mật khẩu hiện tại"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none"
            />
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="Mật khẩu mới"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none"
            />
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="Xác nhận mật khẩu mới"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 font-bold text-white shadow-lg disabled:opacity-50"
            >
              {saving ? 'Đang đổi...' : 'Đổi mật khẩu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
