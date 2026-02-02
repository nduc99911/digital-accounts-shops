import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-white">Admin</h1>
          <form action="/api/admin/logout" method="post">
            <button className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15">
              Logout
            </button>
          </form>
        </div>
        {children}
      </div>
    </div>
  )
}
