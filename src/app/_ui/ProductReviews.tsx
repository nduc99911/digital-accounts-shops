'use client'

import { useEffect, useState } from 'react'
import { useToast } from './ToastProvider'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: { name: string | null }
}

export default function ProductReviews({ 
  productId, 
  isLoggedIn 
}: { 
  productId: string
  isLoggedIn: boolean 
}) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [avgRating, setAvgRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`)
      const data = await res.json()
      setReviews(data.reviews || [])
      setAvgRating(data.avgRating || 0)
      setTotalReviews(data.totalReviews || 0)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment }),
      })

      const data = await res.json()
      
      if (res.ok) {
        showToast('Đánh giá thành công!', 'success')
        setShowForm(false)
        setComment('')
        fetchReviews()
      } else {
        showToast(data.error || 'Không thể đánh giá', 'error')
      }
    } catch {
      showToast('Có lỗi xảy ra', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false, onRate?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate?.(star)}
            disabled={!interactive}
            className={`${interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} transition-transform`}
          >
            <svg
              className={`h-5 w-5 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return <div className="py-8 text-center text-slate-500">Đang tải đánh giá...</div>
  }

  return (
    <div className="mt-12 rounded-3xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg dark:bg-slate-900/80 dark:border-white/10">
      {/* Header */}
      <div className="border-b border-slate-100 p-6 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Đánh giá sản phẩm
            </h3>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-3xl font-bold text-amber-500">{avgRating}</span>
                <span className="text-slate-400">/5</span>
              </div>
              {renderStars(Math.round(avgRating))}
              <span className="text-sm text-slate-500">({totalReviews} đánh giá)</span>
            </div>
          </div>

          {isLoggedIn && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
            >
              {showForm ? 'Đóng' : '✍️ Viết đánh giá'}
            </button>
          )}
        </div>

        {!isLoggedIn && (
          <p className="mt-3 text-sm text-slate-500">
            <a href="/login" className="text-violet-600 hover:underline">Đăng nhập</a> để viết đánh giá
          </p>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={submitReview} className="border-b border-slate-100 p-6 dark:border-slate-800">
          <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">Viết đánh giá của bạn</h4>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-600">Đánh giá</label>
              {renderStars(rating, true, setRating)}
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600">Nhận xét</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 focus:border-violet-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="p-6">
        {reviews.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            <p>Chưa có đánh giá nào.</p>
            <p className="text-sm">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white font-bold">
                      {review.user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {review.user.name || 'Người dùng'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                {review.comment && (
                  <p className="mt-3 text-slate-600 dark:text-slate-300">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
