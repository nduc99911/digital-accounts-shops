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
          <Link className="rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2 text-sm font-medium text-white hover:opacity-90" href="/admin/dashboard">
            📊 Dashboard
          </Link>
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
          <Link className="rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-500" href="/admin/sepay">
            SePay Auto
          </Link>
          <Link className="rounded-md bg-pink-600 px-3 py-2 text-sm font-medium text-white hover:bg-pink-500" href="/admin/settings">
            ⚙️ Cài đặt
          </Link>
          <Link className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-500" href="/admin/coupons">
            🎫 Mã giảm giá
          </Link>
          <Link className="rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-500" href="/admin/blog">
            📝 Blog
          </Link>
        </div>
      </div>
    </div>
  )
}
