import { useState } from 'react'
import { Plus, Trash2, X, Tag } from 'lucide-react'
import { useStoreData } from '../../context/StoreDataContext'
import { Button } from '../../components/ui'
import toast from 'react-hot-toast'

export default function AdminCouponsPage() {
  const { coupons, addCoupon, deleteCoupon } = useStoreData()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    code: '',
    discount: 15,
    type: 'percent', // percent | flat
    minOrder: 500,
    description: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.code.trim()) {
      toast.error('Coupon code is required')
      return
    }
    addCoupon({
      ...form,
      discount: Number(form.discount),
      minOrder: Number(form.minOrder),
    })
    toast.success(`Coupon ${form.code.toUpperCase()} created!`)
    setIsModalOpen(false)
    setForm({ code: '', discount: 15, type: 'percent', minOrder: 500, description: '' })
  }

  const handleDelete = (code) => {
    deleteCoupon(code)
    toast.success(`Coupon ${code} removed`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Discount Coupons</h1>
          <p className="text-sm text-stone-500">Manage promotional promo codes, percent discounts, and flat discounts.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 self-start sm:self-auto">
          <Plus size={16} /> Create Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((c, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs relative group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-lg text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200 flex items-center gap-1.5">
                  <Tag size={16} /> {c.code}
                </span>
                <button
                  onClick={() => handleDelete(c.code)}
                  className="text-stone-300 hover:text-rose-600 p-1 rounded transition-colors"
                  title="Delete Coupon"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="text-xl font-bold text-stone-900 mb-1">
                {c.type === 'percent' ? `${c.discount}% OFF` : `₹${c.discount} OFF`}
              </div>
              <p className="text-xs text-stone-500 mb-4">{c.description || 'No description'}</p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Min Order Required:</span>
              <span className="font-semibold text-stone-800">₹{c.minOrder}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="text-lg font-bold font-serif text-stone-900">Create New Coupon</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FESTIVE20"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 uppercase font-mono outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Discount Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500 bg-white"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Value {form.type === 'percent' ? '(%)' : '(₹)'} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.discount}
                    onChange={e => setForm({ ...form, discount: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={form.minOrder}
                  onChange={e => setForm({ ...form, minOrder: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. 20% off during Diwali festival"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Coupon
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}