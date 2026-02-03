'use client'

import { useEffect, useState } from 'react'

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    const res = await fetch('/api/admin/coupons')
    const data = await res.json()
    setCoupons(data.coupons || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        code: form.get('code'),
        discount: Number(form.get('discount')),
        type: form.get('type'),
        minOrder: Number(form.get('minOrder')),
        maxDiscount: Number(form.get('maxDiscount')) || undefined,
        usageLimit: Number(form.get('usageLimit')),
        expiresAt: form.get('expiresAt') || undefined,
      }),
    })

    if (res.ok) {
      setMessage('✅ Tạo mã giảm giá thành công!')
      setShowForm(false)
      fetchCoupons()
    } else {
      setMessage('❌ Tạo thất bại')
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/admin/coupons/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ active }),
    })
    fetchCoupons()
  }

  const deleteCoupon = async (id: string) => {
    if (!confirm('Xóa mã giảm giá này?')) return
    await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' })
    fetchCoupons()
  }

  if (loading) return <div className="p-6 text-center text-white">Đang tải...</div>

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">🎫 Mã giảm giá</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          {showForm ? 'Đóng' : '➕ Tạo mã mới'}
        </button>
      </div>

      {message && (
        <div className={`rounded-lg p-3 text-sm ${message.includes('✅') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-slate-900/60 p-5 ring-1 ring-white/10">
          <h3 className="mb-4 text-lg font-semibold text-white">Tạo mã giảm giá mới</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm text-slate-300">Mã code</label>
              <input name="code" required className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white uppercase" placeholder="SALE50" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Giảm giá</label>
              <input name="discount" type="number" required className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white" placeholder="50" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Loại</label>
              <select name="type" className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white">
                <option value="PERCENT">%</option>
                <option value="FIXED">VND</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Đơn tối thiểu</label>
              <input name="minOrder" type="number" defaultValue={0} className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Giảm tối đa</label>
              <input name="maxDiscount" type="number" className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white" placeholder="Không giới hạn" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Số lần dùng</label>
              <input name="usageLimit" type="number" defaultValue={100} className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Hết hạn</label>
              <input name="expiresAt" type="datetime-local" className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white" />
            </div>
          </div>
          <button type="submit" className="mt-4 rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-500">
            💾 Tạo mã
          </button>
        </form>
      )}

      <div className="rounded-xl bg-slate-900/60 ring-1 ring-white/10">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-left text-slate-300">
            <tr>
              <th className="p-3">Mã</th>
              <th className="p-3">Giảm</th>
              <th className="p-3">Đã dùng</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Hết hạn</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-white/5">
                <td className="p-3 font-mono font-bold text-white">{c.code}</td>
                <td className="p-3 text-slate-300">
                  {c.discount}{c.type === 'PERCENT' ? '%' : 'đ'}
                  {c.maxDiscount && <span className="text-xs text-slate-500"> (tối đa {c.maxDiscount.toLocaleString()}đ)</span>}
                </td>
                <td className="p-3 text-slate-300">{c.usedCount}/{c.usageLimit}</td>
                <td className="p-3">
                  <button
                    onClick={() => toggleActive(c.id, !c.active)}
                    className={`rounded-full px-2 py-1 text-xs ${c.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-400'}`}
                  >
                    {c.active ? 'Hoạt động' : 'Tắt'}
                  </button>
                </td>
                <td className="p-3 text-slate-400">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('vi-VN') : 'Không'}</td>
                <td className="p-3">
                  <button onClick={() => deleteCoupon(c.id)} className="text-rose-400 hover:text-rose-300">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
