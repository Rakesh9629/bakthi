import { useState } from 'react'
import { Star, CheckCircle2, MessageSquarePlus, X, ThumbsUp } from 'lucide-react'
import { useStoreData } from '../context/StoreDataContext'
import { Button, StarRating } from '../components/ui'
import toast from 'react-hot-toast'

export default function ReviewsPage() {
  const { reviews, addReview, products } = useStoreData()

  const [ratingFilter, setRatingFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    city: '',
    rating: 5,
    product: products[0]?.name || 'Lord Ganesha Blessing',
    text: '',
  })

  const averageRating = (
    reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / (reviews.length || 1)
  ).toFixed(1)

  const starCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  }

  const filteredReviews = reviews.filter(r => {
    if (ratingFilter === 'all') return true
    return r.rating === Number(ratingFilter)
  })

  const handleSubmitReview = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.text.trim()) {
      toast.error('Please enter your name and review experience')
      return
    }
    addReview({
      ...form,
      rating: Number(form.rating),
    })
    toast.success('Thank you for sharing your divine experience! Review submitted.')
    setIsModalOpen(false)
    setForm({ name: '', city: '', rating: 5, product: products[0]?.name || '', text: '' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
          Voices of Devotion
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-1">
          Customer Reviews & Blessings
        </h1>
        <p className="text-sm text-stone-500 mt-2">
          Discover genuine experiences from over 10,000+ happy homes across India.
        </p>
      </div>

      {/* Ratings Summary Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Big Score */}
        <div className="text-center md:border-r border-stone-100 md:pr-8">
          <div className="text-5xl font-serif font-bold text-stone-900">{averageRating}</div>
          <div className="flex justify-center my-2">
            <StarRating rating={Number(averageRating)} size={20} />
          </div>
          <p className="text-xs text-stone-500">Based on {reviews.length} verified devotee reviews</p>
          <Button onClick={() => setIsModalOpen(true)} className="mt-4 gap-1.5 text-xs">
            <MessageSquarePlus size={15} /> Write a Review
          </Button>
        </div>

        {/* Breakdown Bars */}
        <div className="space-y-2 md:col-span-2">
          {[5, 4, 3, 2, 1].map(stars => {
            const count = starCounts[stars] || 0
            const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-stone-600 font-medium flex items-center gap-1">
                  {stars} <Star size={11} className="fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 bg-stone-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-stone-400">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filter and Count */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500">Filter by Rating:</span>
          {['all', '5', '4', '3'].map(r => (
            <button
              key={r}
              onClick={() => setRatingFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                ratingFilter === r
                  ? 'bg-orange-600 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {r === 'all' ? 'All Reviews' : `${r} Stars`}
            </button>
          ))}
        </div>
        <span className="text-xs text-stone-400">
          Showing {filteredReviews.length} reviews
        </span>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map(rev => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">{rev.name}</h4>
                  <p className="text-[11px] text-stone-400">{rev.city || 'India'}</p>
                </div>
                <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={11} className="mr-1 text-emerald-600" /> Verified Devotee
                </span>
              </div>

              <div className="mb-3">
                <StarRating rating={rev.rating} size={14} />
              </div>

              {rev.product && (
                <div className="text-[11px] font-medium text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md mb-3 inline-block">
                  Framed: {rev.product}
                </div>
              )}

              <p className="text-xs text-stone-600 leading-relaxed italic">
                "{rev.text || rev.body}"
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>Acrylic 5mm UV Gloss</span>
              <span className="flex items-center gap-1 hover:text-stone-600 cursor-pointer">
                <ThumbsUp size={12} /> Helpful
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="text-lg font-bold font-serif text-stone-900">
                Share Your Divine Experience
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 pt-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Rating *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setForm({ ...form, rating: st })}
                      className="p-1 focus:outline-hidden"
                    >
                      <Star
                        size={24}
                        className={st <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-stone-600 ml-2">{form.rating} out of 5</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Anand Sharma"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">City / State</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Bangalore"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Product Purchased</label>
                <select
                  value={form.product}
                  onChange={e => setForm({ ...form, product: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500 bg-white text-sm"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.name}>{p.name} ({p.deity})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Review & Devotional Feedback *</label>
                <textarea
                  rows="4"
                  required
                  value={form.text}
                  onChange={e => setForm({ ...form, text: e.target.value })}
                  placeholder="Share details about the acrylic clarity, colors, packaging, and pooja placement..."
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}