import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentCustomer } from '@/lib/customerAuth'
import { formatVnd } from '@/lib/shop'

export default async function AccountOrders() {
  const user = await getCurrentCustomer()
  if (!user) redirect('/login')

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: { include: { product: true } },
      // show delivered stock after SUCCESS
      fulfillments: { include: { product: true } },
    },
    take: 50,
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
          <div>
            <div className="text-lg font-bold">Đơn hàng của tôi</div>
            <div className="text-xs text-slate-500">{user.email}</div>
          </div>
          <form action="/api/auth/logout" method="post">
            <button className="text-sm text-slate-600 hover:underline">Đăng xuất</button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-4">
        {orders.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="font-medium">Bạn chưa có đơn hàng</div>
            <Link href="/" className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              Mua ngay
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((o) => (
              <div key={o.id} className="rounded-lg bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">Mã đơn: {o.code}</div>
                    <div className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString('vi-VN')}</div>
                  </div>
                  <div className={
                    'rounded-full px-3 py-1 text-xs font-medium ' +
                    (o.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')
                  }>
                    {o.status === 'SUCCESS' ? 'Thành công' : 'Chờ thanh toán'}
                  </div>
                </div>

                <div className="mt-3 text-sm text-slate-700">
                  {o.items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between">
                      <div>
                        {it.product.name} <span className="text-xs text-slate-500">x{it.qty}</span>
                      </div>
                      <div className="font-medium">{formatVnd(it.unitVnd * it.qty)}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between border-t pt-3">
                  <div className="text-sm text-slate-600">Tổng</div>
                  <div className="text-lg font-semibold">{formatVnd(o.totalVnd)}</div>
                </div>

                {o.status === 'SUCCESS' ? (
                  <div className="mt-4 rounded-md border bg-emerald-50 p-4">
                    <div className="text-sm font-semibold text-emerald-800">Thông tin đã cấp</div>
                    {o.fulfillments.length === 0 ? (
                      <div className="mt-2 text-sm text-emerald-800/80">Đang xử lý cấp hàng...</div>
                    ) : (
                      <div className="mt-2 grid gap-2 text-sm">
                        {o.fulfillments.map((f) => (
                          <div key={f.id} className="rounded-md bg-white p-3">
                            <div className="text-xs text-slate-500">{f.product.name}</div>
                            <div className="mt-1 font-mono text-xs whitespace-pre-wrap break-all">{f.value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
