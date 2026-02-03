'use client'

import { useEffect, useState } from 'react'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    // bootstrap default admin once
    fetch('/api/god/bootstrap', { method: 'POST' }).catch(() => {})
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    const r = await fetch('/api/god/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!r.ok) {
      setErr('Sai tài khoản hoặc mật khẩu')
      return
    }
    window.location.href = '/god'
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-md flex-col gap-4 p-6 pt-16">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Đăng nhập Admin</h1>
        <form onSubmit={onSubmit} className="rounded-lg bg-slate-900/60 p-5 shadow-sm ring-1 ring-white/10">
          <div className="grid gap-3">
            <input
              className="w-full rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <input
              className="w-full rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {err && <div className="text-sm text-rose-400">{err}</div>}
            <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500">
              Đăng nhập
            </button>
          </div>
        </form>
        <div className="text-xs text-slate-400">Mặc định: admin / admin12345 (đổi trong .env)</div>
      </div>
    </div>
  )
}
