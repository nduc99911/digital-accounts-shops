import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '../_ui/ProductCard'

export const metadata = {
  title: '🔥 Flash Sale - Giảm 50% Tài Khoản Premium',
  description: 'Flash Sale cuối tuần! Netflix, Spotify, ChatGPT giá sốc. Chỉ từ 29K. Số lượng có hạn!',
}

export default async function LandingPage() {
  const hotProducts = await prisma.product.findMany({
    where: { active: true, stockQty: { gt: 0 } },
    orderBy: { soldQty: 'desc' },
    take: 8,
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section for Ads */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-red-400 animate-pulse" />
            ⚡ Flash Sale - Chỉ còn 24h
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">
            Tài Khoản Premium
            <span className="block text-yellow-300">Giảm Đến 70%</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-xl text-white/90">
            Netflix, Spotify, ChatGPT, Canva Pro... Dùng ngay sau 5 phút thanh toán.
            Bảo hành đầy đủ - Hoàn tiền nếu lỗi.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-black text-violet-600 shadow-2xl hover:scale-105 transition-transform"
            >
              🛒 Mua Ngay - Giá Sốc
            </Link>
            <a
              href="https://zalo.me/your-id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-8 py-4 text-lg font-bold text-white shadow-2xl hover:scale-105 transition-transform"
            >
              💬 Tư Vấn Zalo
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/80 text-sm">
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              50K+ Khách hàng
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Bảo hành 100%
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Giao 5 phút
            </span>
          </div>
        </div>
      </div>

      {/* Urgency Section */}
      <div className="bg-amber-400 py-3 text-center">
        <p className="font-bold text-slate-900">
          🔥 Đã bán 1,234 tài khoản hôm nay - Còn 47 slot cuối cùng!
        </p>
      </div>

      {/* Products */}
      <section id="products" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center text-3xl font-black text-slate-900">
          🔥 Sản Phẩm Bán Chạy
        </h2>
        <p className="mt-2 text-center text-slate-600">
          Giá ưu đãi chỉ trong hôm nay
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {hotProducts.map((product) => (
            <ProductCard
              key={product.id}
              p={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                duration: product.duration,
                listPriceVnd: product.listPriceVnd,
                salePriceVnd: product.salePriceVnd,
                soldQty: product.soldQty,
                imageUrl: product.imageUrl,
              }}
            />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-black text-slate-900">
            💬 Khách Hàng Nói Gì?
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { name: 'Anh Minh', text: 'Mua Netflix xong dùng ngay luôn. Giá rẻ hơn mua chính chủ nhiều!', rating: 5 },
              { name: 'Chị Hương', text: 'Support nhiệt tình, giao hàng nhanh. Sẽ quay lại mua thêm!', rating: 5 },
              { name: 'Bạn Nam', text: 'ChatGPT Plus dùng mượt, không bị dis. Recommend!', rating: 5 },
            ].map((review, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow-lg">
                <div className="flex text-yellow-400">{'★'.repeat(review.rating)}</div>
                <p className="mt-3 text-slate-600">{review.text}</p>
                <p className="mt-4 font-bold text-slate-900">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ for Ads */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center text-3xl font-black text-slate-900">
          ❓ Câu Hỏi Thường Gặp
        </h2>
        <div className="mt-8 space-y-4">
          {[
            { q: 'Thanh toán xong bao lâu nhận hàng?', a: '5-15 phút. Tài khoản gửi tự động qua email hoặc hiện trong trang đơn hàng.' },
            { q: 'Có bảo hành không?', a: 'Có! Bảo hành đầy đủ theo gói. Lỗi đổi mới hoặc hoàn tiền 100%.' },
            { q: 'Thanh toán như thế nào?', a: 'Chuyển khoản ngân hàng, MoMo, ZaloPay. Hỗ trợ nhiều ngân hàng.' },
          ].map((faq, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="font-bold text-slate-900">{faq.q}</h3>
              <p className="mt-2 text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="bg-gradient-to-r from-violet-600 to-fuchsia-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-black text-white">
            Sẵn sàng tiết kiệm 70%?
          </h2>
          <p className="mt-4 text-xl text-white/90">
            Đừng bỏ lỡ Flash Sale. Số lượng có hạn mỗi ngày!
          </p>
          <Link
            href="/#products"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-5 text-xl font-black text-violet-600 shadow-2xl hover:scale-105 transition-transform"
          >
            🛒 Mua Ngay - Không Thể Rẻ Hơn!
          </Link>
        </div>
      </section>
    </div>
  )
}
