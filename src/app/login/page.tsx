import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-md items-center justify-between p-4">
          <Link href="/" className="text-lg font-bold">Đăng nhập</Link>
          <Link href="/register" className="text-sm text-slate-600 hover:underline">Tạo tài khoản</Link>
        </div>
      </header>

      <main className="mx-auto max-w-md p-4">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <form action="/api/auth/login" method="post" className="grid gap-3">
            <input className="rounded-md border px-3 py-2" name="email" placeholder="Email" type="email" required />
            <input className="rounded-md border px-3 py-2" name="password" placeholder="Mật khẩu" type="password" required />
            <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white">Đăng nhập</button>
          </form>

          <div className="mt-4 text-xs text-slate-500">
            Nếu quên mật khẩu: bản MVP chưa có reset (mình sẽ bổ sung sau nếu bạn cần).
          </div>
        </div>
      </main>
    </div>
  )
}
