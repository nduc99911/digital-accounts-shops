import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-md items-center justify-between p-4">
          <Link href="/" className="text-lg font-bold">Đăng ký</Link>
          <Link href="/login" className="text-sm text-slate-600 hover:underline">Đăng nhập</Link>
        </div>
      </header>

      <main className="mx-auto max-w-md p-4">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <form action="/api/auth/register" method="post" className="grid gap-3">
            <input className="rounded-md border px-3 py-2" name="email" placeholder="Email" type="email" required />
            <input className="rounded-md border px-3 py-2" name="password" placeholder="Mật khẩu" type="password" required />
            <input className="rounded-md border px-3 py-2" name="name" placeholder="Tên (tuỳ chọn)" />
            <button className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white">Tạo tài khoản</button>
          </form>

          <div className="mt-4 text-xs text-slate-500">Bằng việc đăng ký, bạn đồng ý với điều khoản shop (mẫu).</div>
        </div>
      </main>
    </div>
  )
}
