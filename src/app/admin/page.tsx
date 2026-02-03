import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'

export default async function AdminHome() {
  if (!(await isAuthed())) {
    redirect('/admin/login')
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-lg bg-slate-900/60 p-5 shadow-sm ring-1 ring-white/10">
        <div className="text-sm text-slate-300">Quản lý nhanh</div>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500" href="/admin/products">
            Sản phẩm
          </Link>
          <Link className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500" href="/admin/categories">
            Danh mục
          </Link>
          <Link className="rounded-md bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-500" href="/admin/settings/payment">
            Thanh toán
          </Link>
          <Link className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500" href="/admin/orders">
            Đơn hàng
          </Link>
          <Link className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15" href="/admin/payments/viettelpay">
            ViettelPay Log
          </Link>
          <Link className="rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-500" href="/admin/sepay">
            SePay Auto
          </Link>
          <Link className="rounded-md bg-pink-600 px-3 py-2 text-sm font-medium text-white hover:bg-pink-500" href="/admin/settings">
            ⚙️ Cài đặt
          </Link>
        </div>
      </div>
    </div>
  )
}
