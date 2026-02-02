import Link from 'next/link'
import { getCurrentCustomer } from '@/lib/customerAuth'
import SearchAutocomplete from './SearchAutocomplete'

export default async function SiteHeader({
  initialQuery,
}: {
  initialQuery?: string
}) {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || process.env.SHOP_NAME || 'Divine Style Shop'
  const customer = await getCurrentCustomer()

  return (
    <header className="sticky top-0 z-50 bg-blue-700 text-white shadow dark:bg-slate-950/90 dark:text-slate-100 dark:shadow-lg dark:shadow-black/20 dark:backdrop-blur dark:supports-[backdrop-filter]:bg-slate-950/75">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="shrink-0 text-base font-extrabold tracking-tight text-white sm:text-lg">
          {shopName}
        </Link>

        <SearchAutocomplete initialQuery={initialQuery} />

        <nav className="hidden items-center gap-2 text-sm sm:flex">
          <Link
            href="/cart"
            className="rounded-md bg-white/15 px-3 py-2 font-semibold hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/15"
          >
            Giỏ hàng
          </Link>

          {customer ? (
            <>
              <Link
                href="/account/orders"
                className="rounded-md bg-white/15 px-3 py-2 font-semibold hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/15"
              >
                Đơn hàng
              </Link>
              <form action="/api/auth/logout" method="post">
                <button className="rounded-md bg-white/15 px-3 py-2 font-semibold hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/15">
                  Đăng xuất
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-white/15 px-3 py-2 font-semibold hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/15"
            >
              Đăng nhập
            </Link>
          )}

          <Link
            href="/admin"
            className="rounded-md bg-white/15 px-3 py-2 font-semibold hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/15"
          >
            Admin
          </Link>
        </nav>

        {/* Mobile quick actions */}
        <div className="flex items-center gap-2 sm:hidden">
          <Link
            href="/cart"
            className="rounded-md bg-white/15 px-3 py-2 text-sm font-semibold hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/15"
          >
            Giỏ
          </Link>
          <Link
            href="/admin"
            className="rounded-md bg-white/15 px-3 py-2 text-sm font-semibold hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/15"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  )
}
