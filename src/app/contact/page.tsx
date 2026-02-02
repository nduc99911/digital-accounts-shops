'use client'

import { useState } from 'react'
import { useToast } from '@/app/_ui/ToastProvider'

export const metadata = {
  title: 'Liên hệ - Hỗ trợ khách hàng',
  description: 'Liên hệ với chúng tôi để được hỗ trợ. Zalo, Facebook, Email, Hotline.',
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showToast('Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm.', 'success')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  const contactInfo = [
    {
      icon: '💬',
      title: 'Zalo',
      value: '0987 654 321',
      href: 'https://zalo.me/0987654321',
      color: 'bg-blue-500',
    },
    {
      icon: '📱',
      title: 'Hotline',
      value: '1900 1234',
      href: 'tel:19001234',
      color: 'bg-emerald-500',
    },
    {
      icon: '📧',
      title: 'Email',
      value: 'support@shop.com',
      href: 'mailto:support@shop.com',
      color: 'bg-violet-500',
    },
    {
      icon: '✈️',
      title: 'Telegram',
      value: '@shop_support',
      href: 'https://t.me/shop_support',
      color: 'bg-sky-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            Liên hệ với chúng tôi
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-8 shadow-xl border border-white/50 dark:bg-slate-900/80">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Thông tin liên hệ
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {contactInfo.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl bg-slate-50 p-4 transition-all hover:bg-violet-50 dark:bg-slate-800 dark:hover:bg-violet-900/20"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color} text-2xl shadow-lg`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{item.title}</div>
                      <div className="font-semibold text-slate-900 dark:text-white group-hover:text-violet-600">
                        {item.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Working hours */}
            <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 text-white">
              <h3 className="text-lg font-bold">⏰ Giờ làm việc</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Thứ 2 - Thứ 6:</span>
                  <span className="font-semibold">8:00 - 22:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Thứ 7 - Chủ nhật:</span>
                  <span className="font-semibold">9:00 - 20:00</span>
                </div>
                <div className="mt-4 rounded-xl bg-white/20 p-3 text-sm">
                  💡 Hỗ trợ ngoài giờ qua Zalo/Telegram
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-8 shadow-xl border border-white/50 dark:bg-slate-900/80">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Gửi tin nhắn
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700"
                    placeholder="Nhập họ tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700"
                    placeholder="Nhập email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Chủ đề
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700"
                >
                  <option value="">Chọn chủ đề</option>
                  <option value="support">Hỗ trợ kỹ thuật</option>
                  <option value="order">Về đơn hàng</option>
                  <option value="payment">Thanh toán</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nội dung
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 resize-none"
                  placeholder="Mô tả vấn đề của bạn..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-bold text-white shadow-lg disabled:opacity-50 hover:shadow-xl transition-all"
              >
                {loading ? 'Đang gửi...' : '📤 Gửi tin nhắn'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
