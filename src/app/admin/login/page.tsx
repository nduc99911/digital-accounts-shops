'use client'

import { useEffect, useState } from 'react'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    // bootstrap default admin once
    fetch('/api/admin/bootstrap', { method: 'POST' }).catch(() => {})
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    const r = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!r.ok) {
      setErr('Sai tài khoản hoặc mật khẩu')
      return
    }
    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-md flex-col gap-4 p-6 pt-16">
        <h1 className="text-2xl font-semibold">Đăng nhập Admin</h1>
        <form onSubmit={onSubmit} className="rounded-lg bg-white p-5 shadow-sm">
          <div className="grid gap-3">
            <input
              className="w-full rounded-md border px-3 py-2"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <input
              className="w-full rounded-md border px-3 py-2"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {err && <div className="text-sm text-red-600">{err}</div>}
            <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white">
              Đăng nhập
            </button>
          </div>
        </form>
        <div className="text-xs text-slate-500">
          Mặc định: admin / admin12345 (đổi trong .env)
        </div>
      </div>
    </div>
  )
}
