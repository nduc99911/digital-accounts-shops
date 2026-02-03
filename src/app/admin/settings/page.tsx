'use client'

import { useEffect, useState } from 'react'

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState({
    shopName: '',
    shopDescription: '',
    contactPhone: '',
    contactZalo: '',
    contactEmail: '',
    facebookPage: '',
    facebookMessenger: '',
    telegram: '',
    bannerText: '',
    bannerImage: '',
    footerText: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      setSettings(data)
    } catch {
      setMessage('❌ Không thể tải cài đặt')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setMessage('✅ Lưu thành công!')
        fetchSettings()
      } else {
        setMessage('❌ Lưu thất bại')
      }
    } catch {
      setMessage('❌ Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Đang tải...</div>
  }

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold text-white">⚙️ Cài đặt Website</h2>

      {message && (
        <div className={`rounded-lg p-3 text-sm ${message.includes('✅') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Shop Info */}
        <div className="rounded-xl bg-slate-900/60 p-5 ring-1 ring-white/10">
          <h3 className="mb-4 text-lg font-semibold text-white">🏪 Thông tin shop</h3>
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-300">Tên shop</label>
              <input
                name="shopName"
                defaultValue={settings.shopName}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-500"
                placeholder="taikhoanso.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Mô tả shop</label>
              <textarea
                name="shopDescription"
                defaultValue={settings.shopDescription}
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-500"
                placeholder="Shop tài khoản số hàng đầu..."
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="rounded-xl bg-slate-900/60 p-5 ring-1 ring-white/10">
          <h3 className="mb-4 text-lg font-semibold text-white">📞 Thông tin liên hệ</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-slate-300">Số điện thoại</label>
              <input
                name="contactPhone"
                defaultValue={settings.contactPhone}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-500"
                placeholder="0987654321"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Zalo</label>
              <input
                name="contactZalo"
                defaultValue={settings.contactZalo}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-500"
                placeholder="0987654321"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Email</label>
              <input
                name="contactEmail"
                defaultValue={settings.contactEmail}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-500"
                placeholder="support@taikhoanso.com"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-xl bg-slate-900/60 p-5 ring-1 ring-white/10">
          <h3 className="mb-4 text-lg font-semibold text-white">🔗 Mạng xã hội</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-slate-300">Facebook Page</label>
              <input
                name="facebookPage"
                defaultValue={settings.facebookPage}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-500"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Facebook Messenger</label>
              <input
                name="facebookMessenger"
                defaultValue={settings.facebookMessenger}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-500"
                placeholder="https://m.me/..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Telegram</label>
              <input
                name="telegram"
                defaultValue={settings.telegram}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-500"
                placeholder="@username hoặc https://t.me/..."
              />
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="rounded-xl bg-slate-900/60 p-5 ring-1 ring-white/10">
          <h3 className="mb-4 text-lg font-semibold text-white">🖼️ Banner</h3>
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-300">Text banner</label>
              <input
                name="bannerText"
                defaultValue={settings.bannerText}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-500"
                placeholder="🎉 Khuyến mãi đặc biệt!"
              />
            </div>
            {settings.bannerImage && (
              <div>
                <p className="mb-2 text-sm text-slate-400">Banner hiện tại:</p>
                <img src={settings.bannerImage} alt="Banner" className="h-32 rounded-lg object-cover" />
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm text-slate-300">Upload banner mới</label>
              <input
                type="file"
                name="bannerImage"
                accept="image/*"
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-sm file:text-white"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="rounded-xl bg-slate-900/60 p-5 ring-1 ring-white/10">
          <h3 className="mb-4 text-lg font-semibold text-white">📋 Footer</h3>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Text footer</label>
            <textarea
              name="footerText"
              defaultValue={settings.footerText}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-500"
              placeholder="© 2024 taikhoanso.com - Tài khoản số chính hãng"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg disabled:opacity-50"
        >
          {saving ? '💾 Đang lưu...' : '💾 Lưu cài đặt'}
        </button>
      </form>
    </div>
  )
}
