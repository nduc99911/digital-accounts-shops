import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatVnd } from '@/lib/shop'

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
    take: 12,
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link href="/" className="text-lg font-bold">{process.env.NEXT_PUBLIC_SHOP_NAME || process.env.SHOP_NAME || 'Bùi Lê Digital'}</Link>
          <div className="flex items-center gap-3">
            <Link href="/cart" className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white">Giỏ hàng</Link>
            <Link href="/admin" className="text-sm text-slate-600 hover:underline">Admin</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4">
        <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="text-2xl font-semibold">Tài khoản số dùng ngay</div>
          <div className="mt-2 text-sm text-white/90">Chuyển khoản QR • Xác nhận nhanh • Hỗ trợ 1-1</div>
        </div>

        <h2 className="mb-3 text-lg font-semibold">Sản phẩm nổi bật</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="rounded-lg bg-white p-4 shadow-sm hover:shadow"
            >
              <div className="font-medium">{p.name}</div>
              <div className="mt-1 text-xs text-slate-500">{p.duration || 'Gói'}</div>
              <div className="mt-3 text-blue-600 font-semibold">{formatVnd(p.priceVnd)}</div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="mt-10 border-t bg-white">
        <div className="mx-auto max-w-6xl p-4 text-xs text-slate-500">© {new Date().getFullYear()} {process.env.SHOP_NAME || 'Bùi Lê Digital'}</div>
      </footer>
    </div>
  )
}
