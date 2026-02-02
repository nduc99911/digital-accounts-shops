'use client'

import { useState } from 'react'
import { useToast } from '@/app/_ui/ToastProvider'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: { name: string | null }
}

export default function ReviewSection({ productId, reviews }: { productId: string; reviews: Review[] }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0'

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment }),
      })
      if (res.ok) {
        showToast('Đánh giá thành công!', 'success')
        setComment('')
        window.location.reload()
      } else {
        showToast('Bạn cần mua sản phẩm để đánh giá', 'error')
      }
    } catch {
      showToast('Có lỗi xảy ra', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-8 rounded-3xl bg-white/80 p-6 shadow-lg">
      <h3 className="text-xl font-bold">Đánh giá ({reviews.length})</h3>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-3xl font-bold text-violet-600">{averageRating}</span>
        <span className="text-yellow-500">{'★'.repeat(Math.round(Number(averageRating)))}</span>
      </div>

      {/* Review Form */}
      <form onSubmit={submitReview} className="mt-6 space-y-4 border-t pt-6">
        <div>
          <label className="text-sm font-medium">Đánh giá</label>
          <div className="mt-2 flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-slate-200'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Viết đánh giá của bạn..."
          className="w-full rounded-xl border border-slate-200 p-4"
          rows={4}
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-violet-600 px-6 py-3 font-bold text-white disabled:opacity-50"
        >
          {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </form>

      {/* Review List */}
      <div className="mt-8 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-t pt-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">{review.user.name || 'Ẩn danh'}</span>
              <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
              <span className="text-sm text-slate-400">
                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <p className="mt-2 text-slate-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
