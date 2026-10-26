import { useState, useMemo } from 'react'
import {
  Search,
  AlertTriangle,
  Plus,
  Minus,
  CheckCircle,
  Package
} from 'lucide-react'
import { useStoreData } from '../../context/StoreDataContext'
import toast from 'react-hot-toast'

export default function AdminInventoryPage() {
  const { products, updateStock } = useStoreData()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | low | out | healthy
  const [editingStockId, setEditingStockId] = useState(null)
  const [tempStockValue, setTempStockValue] = useState(0)

  // Quick stats
  const totalUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0)
  const outOfStockCount = products.filter(p => p.stock === 0).length
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 15).length
  const healthyCount = products.filter(p => p.stock >= 15).length

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase()) ||
        p.deity?.toLowerCase().includes(search.toLowerCase())

      let matchFilter = true
      if (filter === 'low') matchFilter = p.stock > 0 && p.stock < 15
      else if (filter === 'out') matchFilter = p.stock === 0
      else if (filter === 'healthy') matchFilter = p.stock >= 15

      return matchSearch && matchFilter
    })
  }, [products, search, filter])

  const handleAdjust = (product, delta) => {
    const nextStock = Math.max(0, (product.stock || 0) + delta)
    updateStock(product.id, nextStock)
    toast.success(`Updated ${product.name} stock to ${nextStock}`)
  }

  const handleQuickAdd = (product, count) => {
    const nextStock = (product.stock || 0) + count
    updateStock(product.id, nextStock)
    toast.success(`Added ${count} units to ${product.name}`)
  }

  const handleStartEdit = (product) => {
    setEditingStockId(product.id)
    setTempStockValue(product.stock)
  }

  const handleSaveEdit = (product) => {
    updateStock(product.id, Math.max(0, Number(tempStockValue)))
    setEditingStockId(null)
    toast.success('Stock quantity updated')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-stone-900">Inventory & Stock Tracking</h1>
        <p className="text-sm text-stone-500">
          Monitor acrylic frame units, threshold alerts, and perform real-time restocks.
        </p>
      </div>

      {/* Stock Health KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Total Units in Stock</span>
            <Package size={16} className="text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900">{totalUnits}</div>
          <p className="text-[11px] text-stone-400 mt-1">Across {products.length} catalog frames</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Healthy Stock (&gt;=15)</span>
            <CheckCircle size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{healthyCount}</div>
          <p className="text-[11px] text-stone-400 mt-1">Frames ready to ship</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Low Stock Alert (&lt;15)</span>
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{lowStockCount}</div>
          <p className="text-[11px] text-stone-400 mt-1">Reorder suggested soon</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Out of Stock</span>
            <AlertTriangle size={16} className="text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{outOfStockCount}</div>
          <p className="text-[11px] text-stone-400 mt-1">Immediate restock required</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, SKU, deity..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-lg outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'low', label: 'Low Stock Only' },
            { id: 'out', label: 'Out of Stock' },
            { id: 'healthy', label: 'Healthy' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === f.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Frame Product</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Quick Adjust</th>
                <th className="py-3 px-4 text-right">Add Bulk Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-stone-400">
                    No inventory records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-amber-50/30 transition-colors">
                    {/* Frame Item */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.thumbnail || p.images?.[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200 flex-shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-stone-900 truncate">{p.name}</p>
                          <p className="text-xs text-stone-400">{p.deity}</p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-4 font-mono text-xs text-stone-600">
                      {p.sku}
                    </td>

                    {/* Current Stock with Click-to-Edit */}
                    <td className="py-3 px-4">
                      {editingStockId === p.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            autoFocus
                            value={tempStockValue}
                            onChange={e => setTempStockValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSaveEdit(p)}
                            className="w-16 px-2 py-1 border border-orange-500 rounded text-sm text-center"
                          />
                          <button
                            onClick={() => handleSaveEdit(p)}
                            className="text-xs bg-orange-600 text-white px-2 py-1 rounded"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="font-bold text-base text-stone-900 hover:text-orange-600 underline decoration-dotted underline-offset-4"
                          title="Click to manually enter quantity"
                        >
                          {p.stock} units
                        </button>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {p.stock === 0 ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                          Out of Stock
                        </span>
                      ) : p.stock < 15 ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          In Stock
                        </span>
                      )}
                    </td>

                    {/* Quick Adjust Buttons (-1, +1) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleAdjust(p, -1)}
                          disabled={p.stock <= 0}
                          className="w-8 h-8 rounded-lg border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Decrease 1 unit"
                        >
                          <Minus size={14} />
                        </button>
                        <button
                          onClick={() => handleAdjust(p, 1)}
                          className="w-8 h-8 rounded-lg border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-600"
                          title="Increase 1 unit"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>

                    {/* Quick Restock (+10, +25) */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex gap-1.5">
                        <button
                          onClick={() => handleQuickAdd(p, 10)}
                          className="text-xs px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-medium transition-colors"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleQuickAdd(p, 25)}
                          className="text-xs px-2.5 py-1 rounded bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 font-medium transition-colors"
                        >
                          +25
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}