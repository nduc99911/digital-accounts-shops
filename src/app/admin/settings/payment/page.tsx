import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function PaymentSettingsPage() {
  if (!isAuthed()) redirect('/admin/login')

  const s = await prisma.paymentSetting.findFirst({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold">Cài đặt thanh toán (Chuyển khoản)</h2>

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <form action="/api/admin/settings/payment" method="post" className="grid gap-3">
          <input className="rounded-md border px-3 py-2" name="bankName" placeholder="Ngân hàng (vd: MB Bank)" defaultValue={s?.bankName ?? ''} required />
          <input className="rounded-md border px-3 py-2" name="accountNumber" placeholder="Số tài khoản" defaultValue={s?.accountNumber ?? ''} required />
          <input className="rounded-md border px-3 py-2" name="accountName" placeholder="Tên chủ tài khoản" defaultValue={s?.accountName ?? ''} required />
          <input className="rounded-md border px-3 py-2" name="qrImageUrl" placeholder="Link ảnh QR (tuỳ chọn)" defaultValue={s?.qrImageUrl ?? ''} />
          <textarea className="rounded-md border px-3 py-2" name="note" placeholder="Ghi chú/ nội dung chuyển khoản (tuỳ chọn)" rows={3} defaultValue={s?.note ?? ''} />

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={s?.active ?? true} />
            Bật thanh toán chuyển khoản
          </label>

          <button className="mt-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">Lưu</button>
        </form>

        <div className="mt-4 text-xs text-slate-500">
          Checkout sẽ hiển thị thông tin này để khách chuyển khoản. Xác nhận thanh toán vẫn do admin đổi trạng thái đơn.
        </div>
      </div>
    </div>
  )
}
