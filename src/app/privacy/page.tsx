export const metadata = {
  title: 'Chính sách bảo mật - Privacy Policy',
  description: 'Chính sách bảo mật và bảo vệ thông tin cá nhân của khách hàng.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-8 shadow-xl border border-white/50 dark:bg-slate-900/80">
          <h1 className="text-3xl font-black text-center bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-8">
            Chính sách bảo mật
          </h1>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-400">
              Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">
              1. Thu thập thông tin
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              Chúng tôi thu thập các thông tin sau khi bạn sử dụng dịch vụ:
            </p>
            <ul className="mt-4 list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Thông tin cá nhân: họ tên, email, số điện thoại</li>
              <li>Thông tin đơn hàng: sản phẩm đã mua, lịch sử giao dịch</li>
              <li>Thông tin thiết bị: IP, trình duyệt, hệ điều hành</li>
              <li>Cookie và dữ liệu tương tự</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">
              2. Mục đích sử dụng
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              Thông tin của bạn được sử dụng cho các mục đích:
            </p>
            <ul className="mt-4 list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Xử lý và giao hàng đơn hàng</li>
              <li>Hỗ trợ khách hàng</li>
              <li>Gửi thông báo về đơn hàng và khuyến mãi</li>
              <li>Cải thiện chất lượng dịch vụ</li>
              <li>Phòng chống gian lận</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">
              3. Bảo mật thông tin
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              Chúng tôi cam kết bảo vệ thông tin của bạn bằng các biện pháp:
            </p>
            <ul className="mt-4 list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Mã hóa SSL cho tất cả kết nối</li>
              <li>Lưu trữ mật khẩu đã được hash</li>
              <li>Giới hạn truy cập thông tin nhạy cảm</li>
              <li>Sao lưu dữ liệu định kỳ</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">
              4. Chia sẻ thông tin
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              Chúng tôi KHÔNG bán, trao đổi hoặc chuyển nhượng thông tin cá nhân 
              cho bên thứ ba. Thông tin chỉ được chia sẻ trong các trường hợp:
            </p>
            <ul className="mt-4 list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Theo yêu cầu của pháp luật</li>
              <li>Bảo vệ quyền lợi của công ty và ngườii dùng</li>
              <li>Phòng chống gian lận và hành vi bất hợp pháp</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">
              5. Quyền của bạn
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              Bạn có quyền:
            </p>
            <ul className="mt-4 list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Truy cập và cập nhật thông tin cá nhân</li>
              <li>Yêu cầu xóa dữ liệu</li>
              <li>Từ chối nhận email marketing</li>
              <li>Khiếu nại về việc sử dụng dữ liệu</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">
              6. Liên hệ
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              Nếu có câu hỏi về chính sách bảo mật, vui lòng liên hệ:
            </p>
            <div className="mt-4 rounded-xl bg-violet-50 p-4 dark:bg-violet-900/20">
              <p className="text-slate-700 dark:text-slate-300">
                📧 Email: privacy@shop.com<br />
                📱 Hotline: 1900 1234
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
