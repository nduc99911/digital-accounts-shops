import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'

export default function AdminHome() {
  if (!isAuthed()) {
    redirect('/admin/login')
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="text-sm text-slate-600">Quản lý nhanh</div>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white" href="/admin/products">
            Sản phẩm
          </Link>
          <Link className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white" href="/admin/categories">
            Danh mục
          </Link>
          <Link className="rounded-md bg-amber-600 px-3 py-2 text-sm font-medium text-white" href="/admin/settings/payment">
            Thanh toán
          </Link>
          <Link className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white" href="/admin/orders">
            Đơn hàng
          </Link>
        </div>
      </div>
    </div>
  )
}
