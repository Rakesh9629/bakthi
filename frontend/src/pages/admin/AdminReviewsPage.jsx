import { useState } from 'react'
import { Trash2, CheckCircle } from 'lucide-react'
import { useStoreData } from '../../context/StoreDataContext'
import { StarRating } from '../../components/ui'
import toast from 'react-hot-toast'

export default function AdminReviewsPage() {
  const { reviews, deleteReview } = useStoreData()
  const [filterRating, setFilterRating] = useState('all')

  const filtered = reviews.filter(r => {
    if (filterRating === 'all') return true
    return r.rating === Number(filterRating)
  })

  const handleDelete = (id) => {
    deleteReview(id)
    toast.success('Review removed')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Customer Testimonials & Reviews</h1>
          <p className="text-sm text-stone-500">Moderate and view customer reviews across all divine acrylic frames.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">Filter Stars:</span>
          <select
            value={filterRating}
            onChange={e => setFilterRating(e.target.value)}
            className="text-xs border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white outline-none focus:border-orange-500"
          >
            <option value="all">All Stars</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-900 text-sm">{r.name}</span>
                  {r.city && <span className="text-xs text-stone-400">({r.city})</span>}
                  <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                    <CheckCircle size={10} className="mr-1" /> Verified Buyer
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-stone-300 hover:text-rose-600 transition-colors p-1"
                  title="Remove Review"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="mb-2">
                <StarRating rating={r.rating} size={13} />
              </div>

              {r.product && (
                <p className="text-xs text-orange-600 font-medium mb-1.5">
                  Frame: {r.product}
                </p>
              )}

              <p className="text-xs text-stone-600 leading-relaxed italic">
                "{r.text || r.body}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}