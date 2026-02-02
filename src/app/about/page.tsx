import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Về chúng tôi - Shop Tài Khoản Premium',
  description: 'Shop tài khoản số hàng đầu Việt Nam. Uy tín, giá tốt, bảo hành đầy đủ.',
}

const stats = [
  { number: '50K+', label: 'Khách hàng' },
  { number: '100+', label: 'Sản phẩm' },
  { number: '99%', label: 'Hài lòng' },
  { number: '5 phút', label: 'Giao hàng' },
]

const values = [
  {
    icon: '🔒',
    title: 'Uy tín',
    description: 'Cam kết cung cấp tài khoản chính hãng, hoạt động 100%. Hoàn tiền nếu có lỗi.',
  },
  {
    icon: '⚡',
    title: 'Nhanh chóng',
    description: 'Giao hàng tự động sau 5 phút. Không phải chờ đợi lâu.',
  },
  {
    icon: '🛡️',
    title: 'Bảo hành',
    description: 'Bảo hành đầy đủ theo thờii hạn gói dịch vụ. Hỗ trợ 24/7.',
  },
  {
    icon: '💰',
    title: 'Giá tốt',
    description: 'Giá cả cạnh tranh nhất thị trường. Nhiều ưu đãi hấp dẫn.',
  },
]

const team = [
  { name: 'Nguyễn Văn A', role: 'Founder', avatar: '👨‍💼' },
  { name: 'Trần Thị B', role: 'CSKH', avatar: '👩‍💼' },
  { name: 'Lê Văn C', role: 'Kỹ thuật', avatar: '👨‍💻' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-pink-600/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                Về chúng tôi
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Shop tài khoản số hàng đầu Việt Nam. Chúng tôi cung cấp tài khoản premium 
              chất lượng cao với giá tốt nhất thị trường.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-violet-600 dark:text-violet-400">
                  {stat.number}
                </div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Câu chuyện của chúng tôi
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              Được thành lập năm 2020, chúng tôi bắt đầu với sứ mệnh đơn giản: 
              mang đến cho ngườii dùng Việt Nam cách tiếp cận dễ dàng, giá cả phải chăng 
              với các dịch vụ digital premium.
            </p>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              Từ những ngày đầu chỉ có vài sản phẩm, giờ đây chúng tôi đã phục vụ 
              hơn 50,000 khách hàng với hơn 100+ loại tài khoản khác nhau.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-20 blur-2xl" />
            <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl p-8 shadow-xl dark:bg-slate-900/80">
              <div className="text-center">
                <div className="text-6xl">🚀</div>
                <p className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                  "Mang dịch vụ premium đến với mọi ngườii"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-slate-200/60 bg-white/50 py-16 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-white">
            Giá trị cốt lõi
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900/80"
              >
                <div className="text-4xl">{value.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold text-white">
            Sẵn sàng trải nghiệm?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
            Hàng ngàn tài khoản premium đang chờ bạn. Mua ngay hôm nay!
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-violet-600 shadow-xl transition-all hover:scale-105"
          >
            🛒 Bắt đầu mua sắm
          </Link>
        </div>
      </section>
    </div>
  )
}
