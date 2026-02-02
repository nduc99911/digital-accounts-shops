export const metadata = {
  title: 'Điều khoản sử dụng - Terms of Service',
  description: 'Điều khoản và điều kiện sử dụng dịch vụ của chúng tôi.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-8 shadow-xl border border-white/50 dark:bg-slate-900/80">
          <h1 className="text-3xl font-black text-center bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-8">
            Điều khoản sử dụng
          </h1>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-400">
              Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">
              1. Chấp nhận điều khoản
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ các điều khoản 
              và điều kiện được quy định tại đây. Nếu không đồng ý, vui lòng không sử dụng dịch vụ.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">
              2. Dịch vụ cung cấp
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              Chúng tôi cung cấp dịch vụ mua bán tài khoản digital (Netflix, Spotify, etc.). 
              Các tài khoản đều là tài khoản chính hãng, được mua từ nhà cung cấp uy tín.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">
              3. Quy định về tài khoản
            </h2>
            <ul className="mt-4 list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Bạn phải cung cấp thông tin chính xác khi đăng ký</li>
              <li>Mỗi ngườii chỉ được sử dụng một tài khoản</li>
              <li>Không chia sẻ tài khoản đăng nhập cho ngườii khác</li>
              <li>Chúng tôi có quyền khóa tài khoản nếu phát hiện gian lận</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">
              4. Thanh toán và hoàn tiền
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              <strong>Thanh toán:</strong> Chấp nhận chuyển khoản ngân hàng, ví điện tử.
              Đơn hàng được xử lý sau khi thanh toán được xác nhận.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              <strong>Hoàn tiền:</strong> 
            </p>
            <ul className="mt-2 list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Hoàn 100% nếu tài khoản không hoạt động trong vòng 24h</li>
              <li>Hoàn 50% nếu báo lỗi trong vòng 7 ngày</li>
              <li>Không hoàn tiền nếu đã sử dụng quá 50% thờii hạn</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">
              5. Bảo hành
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              Mỗi sản phẩm có chính sách bảo hành riêng ghi rõ trên trang sản phẩm:
            </p>
            <ul className="mt-4 list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li><strong>Full:</strong> Bảo hành toàn bộ thờii hạn sử dụng</li>
              <li><strong>Limited:</strong> Bảo hành 7-30 ngày tùy sản phẩm</li>
              <li><strong>None:</strong> Không bảo hành (giá rẻ nhất)</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">
              6. Hành vi cấm
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              Nghiêm cấm các hành vi sau:
            </p>
            <ul className="mt-4 list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Sử dụng dịch vụ vào mục đích bất hợp pháp</li>
              <li>Đăng tải nội dung vi phạm pháp luật</li>
              <li>Tấn công, phá hoại hệ thống</li>
              <li>Mạo danh, giả mạo thông tin</li>
              <li>Spam, lừa đảo ngườii dùng khác</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">
              7. Giới hạn trách nhiệm
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              Chúng tôi không chịu trách nhiệm cho các trường hợp:
            </p>
            <ul className="mt-4 list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Lỗi từ phía nhà cung cấp gốc (Netflix, Spotify...)</li>
              <li>Mất tài khoản do bạn chia sẻ cho ngườii khác</li>
              <li>Thiệt hại gián tiếp từ việc sử dụng dịch vụ</li>
              <li>Sự cố ngoài tầm kiểm soát (thiên tai, mất điện...)</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">
              8. Thay đổi điều khoản
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              Chúng tôi có quyền thay đổi điều khoản bất kỳ lúc nào. 
              Thay đổi sẽ có hiệu lực ngay khi đăng tải. 
              Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận điều khoản mới.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">
              9. Liên hệ
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ:
            </p>
            <div className="mt-4 rounded-xl bg-violet-50 p-4 dark:bg-violet-900/20">
              <p className="text-slate-700 dark:text-slate-300">
                📧 Email: support@shop.com<br />
                📱 Hotline: 1900 1234
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
