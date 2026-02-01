import Link from 'next/link'
import { getCurrentCustomer } from '@/lib/customerAuth'

export default async function SiteHeader({
  initialQuery,
}: {
  initialQuery?: string
}) {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || process.env.SHOP_NAME || 'Divine Style Shop'
  const customer = await getCurrentCustomer()

  return (
    <header className="sticky top-0 z-50 bg-blue-700 text-white shadow">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="shrink-0 text-base font-extrabold tracking-tight sm:text-lg">
          {shopName}
        </Link>

        <form action="/search" method="get" className="flex flex-1">
          <div className="flex w-full overflow-hidden rounded-md bg-white ring-1 ring-black/5">
            <input
              name="q"
              defaultValue={initialQuery || ''}
              className="w-full px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              placeholder="Tìm kiếm sản phẩm…"
              autoComplete="off"
            />
            <button
              type="submit"
              className="bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Tìm
            </button>
          </div>
        </form>

        <nav className="hidden items-center gap-2 text-sm sm:flex">
          <Link href="/cart" className="rounded-md bg-white/15 px-3 py-2 font-semibold hover:bg-white/20">
            Giỏ hàng
          </Link>

          {customer ? (
            <>
              <Link href="/account/orders" className="rounded-md bg-white/15 px-3 py-2 font-semibold hover:bg-white/20">
                Đơn hàng
              </Link>
              <form action="/api/auth/logout" method="post">
                <button className="rounded-md bg-white/15 px-3 py-2 font-semibold hover:bg-white/20">Đăng xuất</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="rounded-md bg-white/15 px-3 py-2 font-semibold hover:bg-white/20">
              Đăng nhập
            </Link>
          )}

          <Link href="/admin" className="rounded-md bg-white/15 px-3 py-2 font-semibold hover:bg-white/20">
            Admin
          </Link>
        </nav>

        {/* Mobile quick actions */}
        <div className="flex items-center gap-2 sm:hidden">
          <Link href="/cart" className="rounded-md bg-white/15 px-3 py-2 text-sm font-semibold hover:bg-white/20">
            Giỏ
          </Link>
          <Link href="/admin" className="rounded-md bg-white/15 px-3 py-2 text-sm font-semibold hover:bg-white/20">
            Admin
          </Link>
        </div>
      </div>
    </header>
  )
}
