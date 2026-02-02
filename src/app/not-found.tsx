import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
      <div className="text-center">
        {/* 404 Animation */}
        <div className="relative mx-auto h-48 w-48">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-200 to-fuchsia-200 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-100" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              404
            </span>
          </div>
        </div>

        <h1 className="mt-8 text-3xl font-black text-slate-900">
          Trang không tồn tại
        </h1>
        <p className="mt-4 text-slate-600 max-w-md mx-auto">
          Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-bold text-white shadow-lg hover:shadow-xl transition-all"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Về trang chủ
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-slate-700 shadow-lg border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Tìm sản phẩm
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12">
          <p className="text-sm text-slate-500">Có thể bạn quan tâm:</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {['Netflix', 'Spotify', 'ChatGPT', 'Canva'].map((item) => (
              <Link
                key={item}
                href={`/search?q=${item}`}
                className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm border border-slate-200 hover:bg-violet-50 hover:text-violet-600 transition-all"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
