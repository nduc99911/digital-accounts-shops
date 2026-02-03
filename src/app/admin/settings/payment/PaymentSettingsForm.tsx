'use client'

import { useState } from 'react'

interface PaymentSetting {
  id: string
  bankName: string
  accountNumber: string
  accountName: string
  qrImageUrl: string | null
  note: string | null
  active: boolean
}

export default function PaymentSettingsForm({ setting }: { setting?: PaymentSetting | null }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [previewUrl, setPreviewUrl] = useState(setting?.qrImageUrl || '')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/admin/settings/payment', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setMessage('✅ Lưu thành công!')
        // Update preview if new file uploaded
        const qrFile = formData.get('qrImage') as File
        if (qrFile && qrFile.size > 0) {
          setPreviewUrl(URL.createObjectURL(qrFile))
        }
      } else {
        setMessage('❌ Lưu thất bại')
      }
    } catch (err) {
      setMessage('❌ Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg bg-slate-900/60 p-5 shadow-sm ring-1 ring-white/10">
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="bankName"
          placeholder="Ngân hàng (vd: MB Bank)"
          defaultValue={setting?.bankName ?? ''}
          required
        />
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="accountNumber"
          placeholder="Số tài khoản"
          defaultValue={setting?.accountNumber ?? ''}
          required
        />
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="accountName"
          placeholder="Tên chủ tài khoản"
          defaultValue={setting?.accountName ?? ''}
          required
        />

        <div className="space-y-2">
          <label className="text-sm text-slate-300">Ảnh QR Code (tải lên)</label>
          {previewUrl && (
            <div className="mb-2">
              <img src={previewUrl} alt="QR Current" className="h-32 rounded border border-white/10" />
              <p className="text-xs text-slate-500 mt-1">QR hiện tại</p>
            </div>
          )}
          <input
            type="file"
            name="qrImage"
            accept="image/*"
            className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-sm file:text-white hover:file:bg-blue-500"
          />
          <p className="text-xs text-slate-500">Chọn ảnh mới để thay thế (PNG, JPG)</p>
        </div>

        <textarea
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="note"
          placeholder="Ghi chú/ nội dung chuyển khoản (tuỳ chọn)"
          rows={3}
          defaultValue={setting?.note ?? ''}
        />

        <label className="flex items-center gap-2 text-sm text-slate-200">
          <input 
            type="checkbox" 
            name="active" 
            defaultChecked={setting?.active ?? true} 
          />
          Bật thanh toán chuyển khoản
        </label>

        {message && (
          <div className={`rounded-md px-3 py-2 text-sm ${message.includes('✅') ? 'bg-emerald-900/30 text-emerald-300' : 'bg-red-900/30 text-red-300'}`}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="mt-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang lưu...' : '💾 Lưu'}
        </button>
      </form>

      <div className="mt-4 text-xs text-slate-400">
        Checkout sẽ hiển thị thông tin này để khách chuyển khoản. Xác nhận thanh toán vẫn do admin đổi trạng thái đơn.
      </div>
    </div>
  )
}
