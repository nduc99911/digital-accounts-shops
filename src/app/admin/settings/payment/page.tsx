import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function PaymentSettingsPage() {
  if (!(await isAuthed())) redirect('/admin/login')

  const s = await prisma.paymentSetting.findFirst({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold tracking-tight text-white">Cài đặt thanh toán (Chuyển khoản)</h2>

      <div className="rounded-lg bg-slate-900/60 p-5 shadow-sm ring-1 ring-white/10">
        <form action="/api/admin/settings/payment" method="post" className="grid gap-3">
          <input
            className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
            name="bankName"
            placeholder="Ngân hàng (vd: MB Bank)"
            defaultValue={s?.bankName ?? ''}
            required
          />
          <input
            className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
            name="accountNumber"
            placeholder="Số tài khoản"
            defaultValue={s?.accountNumber ?? ''}
            required
          />
          <input
            className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
            name="accountName"
            placeholder="Tên chủ tài khoản"
            defaultValue={s?.accountName ?? ''}
            required
          />
          <input
            className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
            name="qrImageUrl"
            placeholder="Link ảnh QR (tuỳ chọn)"
            defaultValue={s?.qrImageUrl ?? ''}
          />
          <textarea
            className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
            name="note"
            placeholder="Ghi chú/ nội dung chuyển khoản (tuỳ chọn)"
            rows={3}
            defaultValue={s?.note ?? ''}
          />

          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input type="checkbox" name="active" defaultChecked={s?.active ?? true} />
            Bật thanh toán chuyển khoản
          </label>

          <button className="mt-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500">Lưu</button>
        </form>

        <div className="mt-4 text-xs text-slate-400">
          Checkout sẽ hiển thị thông tin này để khách chuyển khoản. Xác nhận thanh toán vẫn do admin đổi trạng thái đơn.
        </div>
      </div>
    </div>
  )
}
