'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/app/_ui/ToastProvider'

export default function SePaySettingsPage() {
  const [settings, setSettings] = useState({
    sepaySecret: '',
    bankAccount: '',
    bankName: '',
    accountName: '',
  })
  const [loading, setLoading] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState('')
  const { showToast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/god/sepay')
      const data = await res.json()
      setSettings(prev => ({
        ...prev,
        bankAccount: data.bankAccount || '',
        bankName: data.bankName || '',
      }))
      setWebhookUrl(data.webhookUrl)
    } catch {
      showToast('Không thể tải cài đặt', 'error')
    }
  }

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/god/sepay', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        showToast('Lưu cài đặt SePay thành công!', 'success')
      } else {
        showToast('Lưu thất bại', 'error')
      }
    } catch {
      showToast('Có lỗi xảy ra', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-8">
          ⚡ Cài đặt SePay Auto-Confirm
        </h1>

        <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-8 shadow-xl border border-white/50">
          {/* Instructions */}
          <div className="mb-8 rounded-2xl bg-blue-50 p-6">
            <h2 className="font-bold text-blue-900 mb-4">Hướng dẫn cài đặt SePay:</h2>
            <ol className="space-y-2 text-blue-800 text-sm list-decimal list-inside">
              <li>Đăng ký tài khoản tại <a href="https://sepay.vn" target="_blank" rel="noopener noreferrer" className="underline font-semibold">sepay.vn</a></li>
              <li>Kết nối tài khoản ngân hàng với SePay</li>
              <li>Vào <strong>Developer → Webhook</strong></li>
              <li>Thêm URL webhook bên dưới</li>
              <li>Copy Secret Key và dán vào đây</li>
              <li>Lưu cài đặt - Done!</li>
            </ol>
          </div>

          {/* Webhook URL */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Webhook URL (copy và dán vào SePay)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={webhookUrl}
                readOnly
                className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-slate-600"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(webhookUrl)
                  showToast('Đã sao chép!', 'success')
                }}
                className="rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white"
              >
                Copy
              </button>
            </div>
          </div>

          <form onSubmit={saveSettings} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                SePay Secret Key
              </label>
              <input
                type="password"
                value={settings.sepaySecret}
                onChange={(e) => setSettings({ ...settings, sepaySecret: e.target.value })}
                placeholder="Nhập secret key từ SePay"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ngân hàng
                </label>
                <select
                  value={settings.bankName}
                  onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none"
                >
                  <option value="">Chọn ngân hàng</option>
                  <option value="Vietcombank">Vietcombank</option>
                  <option value="Techcombank">Techcombank</option>
                  <option value="ACB">ACB</option>
                  <option value="MB Bank">MB Bank</option>
                  <option value="TPBank">TPBank</option>
                  <option value="VPBank">VPBank</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Số tài khoản
                </label>
                <input
                  type="text"
                  value={settings.bankAccount}
                  onChange={(e) => setSettings({ ...settings, bankAccount: e.target.value })}
                  placeholder="1234567890"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tên chủ tài khoản
              </label>
              <input
                type="text"
                value={settings.accountName}
                onChange={(e) => setSettings({ ...settings, accountName: e.target.value })}
                placeholder="NGUYEN VAN A"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-bold text-white shadow-lg disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : '💾 Lưu cài đặt SePay'}
            </button>
          </form>

          {/* Test section */}
          <div className="mt-8 border-t pt-8">
            <h3 className="font-bold text-slate-900 mb-4">🧪 Test tích hợp</h3>
            <p className="text-sm text-slate-600 mb-4">
              Sau khi lưu, tạo một đơn hàng test và chuyển khoản để kiểm tra tích hợp.
            </p>
            <a
              href="https://my.sepay.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white"
            >
              Mở SePay Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
