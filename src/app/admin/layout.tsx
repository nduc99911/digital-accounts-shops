import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Admin</h1>
          <form action="/api/admin/logout" method="post">
            <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white">
              Logout
            </button>
          </form>
        </div>
        {children}
      </div>
    </div>
  )
}
