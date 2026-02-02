import Link from 'next/link'

export const metadata = {
  title: 'Hướng dẫn mua hàng - Cách thanh toán & Nhận hàng',
  description: 'Hướng dẫn chi tiết cách mua hàng, thanh toán và nhận tài khoản tại shop. Đơn giản, nhanh chóng, an toàn.',
}

const steps = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: 'Chọn sản phẩm',
    description: 'Duyệt qua danh mục sản phẩm và chọn tài khoản phù hợp với nhu cầu của bạn. Xem kỹ thông tin gói dịch vụ, thờii hạn và giá cả.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Thêm vào giỏ',
    description: 'Nhấn "Thêm vào giỏ" để lưu sản phẩm. Bạn có thể tiếp tục mua sắm hoặc đi đến thanh toán ngay.',
    color: 'from-fuchsia-500 to-pink-600',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Điền thông tin',
    description: 'Cung cấp thông tin liên hệ chính xác (tên, SĐT, email) để chúng tôi có thể hỗ trợ bạn nhanh chóng nếu có vấn đề.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Thanh toán',
    description: 'Chuyển khoản theo thông tin được cung cấp. Nội dung chuyển khoản ghi rõ mã đơn hàng để đối soát nhanh.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    title: 'Nhận hàng',
    description: 'Sau khi thanh toán được xác nhận (5-15 phút), tài khoản sẽ được gửi tự động qua email hoặc hiển thị trong mục "Đơn hàng".',
    color: 'from-amber-500 to-orange-600',
  },
]

const paymentMethods = [
  {
    name: 'Chuyển khoản ngân hàng',
    icon: '🏦',
    description: 'Chuyển khoản qua Vietcombank, Techcombank, MB Bank, ACB... Phí 0đ, xác nhận tự động.',
    time: '5-15 phút',
  },
  {
    name: 'Ví MoMo',
    icon: '💜',
    description: 'Quét mã QR MoMo hoặc chuyển đến số điện thoại. Nhanh chóng, tiện lợi.',
    time: '1-5 phút',
  },
  {
    name: 'ZaloPay',
    icon: '💙',
    description: 'Thanh toán qua ZaloPay với mã QR riêng. An toàn, bảo mật cao.',
    time: '1-5 phút',
  },
  {
    name: 'Thẻ cào điện thoại',
    icon: '💳',
    description: 'Nạp bằng thẻ cào Viettel, Mobifone, Vinaphone. Phí 20-25%.',
    time: '1-3 phút',
  },
]

const faqs = [
  {
    question: 'Thanh toán xong bao lâu thì nhận được hàng?',
    answer: 'Thông thường 5-15 phút sau khi thanh toán được xác nhận. Trong giờ cao điểm có thể lâu hơn chút nhưng không quá 30 phút.',
  },
  {
    question: 'Tài khoản nhận được dùng được ngay không?',
    answer: 'Có, tài khoản đều đã được kích hoạt sẵn. Bạn chỉ cần đăng nhập và sử dụng ngay lập tức.',
  },
  {
    question: 'Có bảo hành không?',
    answer: 'Có, tất cả tài khoản đều có bảo hành theo thờii hạn ghi trên sản phẩm. Nếu có lỗi, chúng tôi sẽ đổi mới hoặc hoàn tiền.',
  },
  {
    question: 'Thanh toán nhầm số tiền thì sao?',
    answer: 'Liên hệ ngay qua Zalo/Fanpage để được hỗ trợ. Chúng tôi sẽ kiểm tra và xử lý trong vòng 24h.',
  },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 opacity-10" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                Hướng dẫn mua hàng
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Chỉ 5 bước đơn giản để sở hữu tài khoản premium. Nhanh chóng, an toàn, bảo mật.
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Steps Section */}
        <section className="mb-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl p-8 shadow-xl shadow-slate-200/50 border border-white/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-900/80 dark:border-white/10 dark:shadow-black/20"
              >
                {/* Step number */}
                <div className={`absolute -right-4 -top-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${step.color} opacity-10 text-6xl font-black text-white transition-transform duration-500 group-hover:scale-110`}>
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  {step.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                  Bước {index + 1}: {step.title}
                </h3>
                <p className="mt-3 text-slate-600 leading-relaxed dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Methods */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              💳 Phương thức thanh toán
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Đa dạng phương thức, phù hợp với mọi nhu cầu
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="flex items-start gap-4 rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-slate-900/70 dark:border-white/10"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-3xl dark:from-slate-800 dark:to-slate-700">
                  {method.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {method.name}
                    </h3>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {method.time}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {method.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Delivery Info */}
        <section className="mb-20">
          <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 p-1">
            <div className="rounded-[22px] bg-white/95 backdrop-blur-xl p-8 dark:bg-slate-900/95">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    📦 Nhận hàng như thế nào?
                  </h2>
                  <p className="mt-4 text-slate-600 dark:text-slate-400">
                    Sau khi thanh toán thành công, bạn có thể nhận tài khoản theo 2 cách:
                  </p>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-4 rounded-xl bg-violet-50 p-4 dark:bg-violet-900/20">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500 text-white">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Email tự động</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Tài khoản sẽ được gửi đến email bạn đã cung cấp trong vòng 5-15 phút.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 rounded-xl bg-fuchsia-50 p-4 dark:bg-fuchsia-900/20">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fuchsia-500 text-white">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Trang đơn hàng</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Vào mục "Đơn hàng" để xem tài khoản ngay lập tức sau khi thanh toán.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-3xl blur-2xl opacity-20" />
                    <div className="relative rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">Đơn hàng #ORD123456</span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">Thành công</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600" />
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 dark:text-white">Netflix Premium 4K</div>
                            <div className="text-xs text-slate-500">1 tháng</div>
                          </div>
                          <div className="font-bold text-slate-900 dark:text-white">79.000đ</div>
                        </div>
                        <div className="rounded-lg bg-violet-50 p-4 dark:bg-violet-900/20">
                          <div className="text-xs font-medium text-violet-600 mb-1">Tài khoản của bạn:</div>
                          <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">email@example.com:password123</div>
                          <button className="mt-2 text-xs font-medium text-violet-600 hover:text-violet-700">
                            📋 Sao chép
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              ❓ Câu hỏi thường gặp
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl dark:bg-slate-900/70 dark:border-white/10"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="mt-3 text-slate-600 dark:text-slate-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-white">
              Sẵn sàng mua sắm chưa?
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Hàng ngàn tài khoản premium đang chờ bạn. Giá tốt nhất thị trường!
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-violet-600 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                🛒 Bắt đầu mua sắm
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/account/orders"
                className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all hover:bg-white/30"
              >
                📦 Xem đơn hàng của tôi
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
