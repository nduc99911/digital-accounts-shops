'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const res = await fetch('/api/admin/blog')
    const data = await res.json()
    setPosts(data.posts || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    
    const res = await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: form.get('title'),
        slug: form.get('slug'),
        excerpt: form.get('excerpt'),
        content: form.get('content'),
        published: form.get('published') === 'on',
      }),
    })

    if (res.ok) {
      setShowForm(false)
      fetchPosts()
    }
  }

  const togglePublish = async (id: string, published: boolean) => {
    await fetch(`/api/admin/blog/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ published }),
    })
    fetchPosts()
  }

  if (loading) return <div className="p-6 text-center text-white">Đang tải...</div>

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">📝 Blog / SEO Content</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          {showForm ? 'Đóng' : '➕ Viết bài mới'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-slate-900/60 p-5 ring-1 ring-white/10">
          <h3 className="mb-4 text-lg font-semibold text-white">Viết bài mới</h3>
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-300">Tiêu đề</label>
              <input name="title" required className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white" placeholder="Cách mua Netflix giá rẻ..." />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Slug (URL)</label>
              <input name="slug" required className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white" placeholder="cach-mua-netflix-gia-re" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Tóm tắt</label>
              <input name="excerpt" required className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white" placeholder="Hướng dẫn chi tiết..." />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Nội dung (Markdown)</label>
              <textarea name="content" rows={10} required className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 font-mono text-sm text-white" placeholder="# Tiêu đề..." />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input name="published" type="checkbox" />
              Xuất bản ngay
            </label>
          </div>
          <button type="submit" className="mt-4 rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-500">
            💾 Đăng bài
          </button>
        </form>
      )}

      <div className="rounded-xl bg-slate-900/60 ring-1 ring-white/10">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-left text-slate-300">
            <tr>
              <th className="p-3">Tiêu đề</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Views</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Ngày tạo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-white/5">
                <td className="p-3 font-medium text-white">{p.title}</td>
                <td className="p-3 text-slate-400">{p.slug}</td>
                <td className="p-3 text-slate-300">{p.views}</td>
                <td className="p-3">
                  <button
                    onClick={() => togglePublish(p.id, !p.published)}
                    className={`rounded-full px-2 py-1 text-xs ${p.published ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-400'}`}
                  >
                    {p.published ? 'Đã xuất bản' : 'Nháp'}
                  </button>
                </td>
                <td className="p-3 text-slate-400">{new Date(p.createdAt).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
