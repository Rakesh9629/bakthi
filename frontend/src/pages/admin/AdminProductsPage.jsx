import { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  ExternalLink
} from 'lucide-react'
import { useStoreData } from '../../context/StoreDataContext'
import { Button, Badge } from '../../components/ui'
import toast from 'react-hot-toast'

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStoreData()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [stockFilter, setStockFilter] = useState('all') // all | low | out | in
  const [editingProduct, setEditingProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // Form state
  const initialForm = {
    name: '',
    deity: '',
    category: categories[0]?.slug || 'lord-ganesha',
    price: 799,
    mrp: 1299,
    stock: 25,
    images: ['https://picsum.photos/seed/product/400/500'],
    description: '',
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    isActive: true,
  }
  const [formData, setFormData] = useState(initialForm)

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = search.trim() === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.deity?.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase())

      const matchCat = !selectedCategory || p.category === selectedCategory

      let matchStock = true
      if (stockFilter === 'low') matchStock = p.stock > 0 && p.stock < 15
      else if (stockFilter === 'out') matchStock = p.stock === 0
      else if (stockFilter === 'in') matchStock = p.stock >= 15

      return matchSearch && matchCat && matchStock
    })
  }, [products, search, selectedCategory, stockFilter])

  const handleOpenAdd = () => {
    setEditingProduct(null)
    setFormData({
      ...initialForm,
      category: categories[0]?.slug || 'lord-ganesha'
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      deity: product.deity || '',
      category: product.category,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock,
      images: product.images || [product.thumbnail],
      description: product.description || '',
      isFeatured: !!product.isFeatured,
      isBestseller: !!product.isBestseller,
      isNewArrival: !!product.isNewArrival,
      isActive: product.isActive !== undefined ? product.isActive : true,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Please enter a product name')
      return
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
        price: Number(formData.price),
        mrp: Number(formData.mrp),
        stock: Number(formData.stock),
      })
      toast.success('Product updated successfully!')
    } else {
      addProduct({
        ...formData,
        price: Number(formData.price),
        mrp: Number(formData.mrp),
        stock: Number(formData.stock),
      })
      toast.success('New product added to catalog!')
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id) => {
    deleteProduct(id)
    toast.success('Product deleted')
    setDeleteConfirmId(null)
  }

  const toggleProductActive = (product) => {
    const nextState = !product.isActive
    updateProduct(product.id, { isActive: nextState })
    toast.success(`Product ${nextState ? 'activated' : 'deactivated'}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Products Catalog</h1>
          <p className="text-sm text-stone-500">Manage all divine acrylic frames, prices, and visibility.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2 shadow-sm self-start sm:self-auto">
          <Plus size={16} /> Add New Product
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, deity, or SKU..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-lg outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white text-stone-700 outline-none focus:border-orange-500"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={e => setStockFilter(e.target.value)}
            className="text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white text-stone-700 outline-none focus:border-orange-500"
          >
            <option value="all">All Stock Status</option>
            <option value="in">Healthy Stock (&gt;=15)</option>
            <option value="low">Low Stock (&lt;15)</option>
            <option value="out">Out of Stock (0)</option>
          </select>

          {(search || selectedCategory || stockFilter !== 'all') && (
            <button
              onClick={() => { setSearch(''); setSelectedCategory(''); setStockFilter('all') }}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Deity / Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-stone-400">
                    No products matched your criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-amber-50/30 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.thumbnail || p.images?.[0]}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-stone-200"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-stone-900 truncate">{p.name}</p>
                          <span className="text-[11px] text-stone-400 font-mono">SKU: {p.sku}</span>
                        </div>
                      </div>
                    </td>

                    {/* Deity & Category */}
                    <td className="py-3 px-4">
                      <p className="text-stone-800 font-medium">{p.deity || 'Devotional'}</p>
                      <p className="text-xs text-stone-400 capitalize">{p.category?.replace('-', ' ')}</p>
                    </td>

                    {/* Pricing */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">₹{p.price.toLocaleString('en-IN')}</div>
                      {p.mrp && p.mrp > p.price && (
                        <span className="text-xs text-stone-400 line-through">₹{p.mrp.toLocaleString('en-IN')}</span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      {p.stock === 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                          Out of Stock
                        </span>
                      ) : p.stock < 15 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          Low: {p.stock} units
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {p.stock} units
                        </span>
                      )}
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.isBestseller && <Badge variant="bestseller" className="text-[10px]">Bestseller</Badge>}
                        {p.isFeatured && <Badge variant="gold" className="text-[10px]">Featured</Badge>}
                        {p.isNewArrival && <Badge variant="new" className="text-[10px]">New</Badge>}
                        {!p.isBestseller && !p.isFeatured && !p.isNewArrival && (
                          <span className="text-xs text-stone-400">—</span>
                        )}
                      </div>
                    </td>

                    {/* Active toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleProductActive(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          p.isActive
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {p.isActive ? <CheckCircle size={13} /> : <XCircle size={13} />}
                        {p.isActive ? 'Active' : 'Draft'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/product/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Preview in Storefront"
                        >
                          <ExternalLink size={15} />
                        </a>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-stone-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl animate-fade-in">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertCircle size={24} />
              <h3 className="font-bold text-stone-900">Delete Product?</h3>
            </div>
            <p className="text-sm text-stone-600 mb-6">
              This will permanently remove this divine frame from the store catalog.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(deleteConfirmId)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-fade-in my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="text-lg font-bold font-serif text-stone-900">
                {editingProduct ? 'Edit Frame Details' : 'Add New Acrylic Devotional Frame'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Frame Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Lord Ganesha Blessing Frame"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Deity Name
                  </label>
                  <input
                    type="text"
                    value={formData.deity}
                    onChange={e => setFormData({ ...formData, deity: e.target.value })}
                    placeholder="e.g. Lord Ganesha, Radha Krishna"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.mrp}
                    onChange={e => setFormData({ ...formData, mrp: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Inventory Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.images[0] || ''}
                    onChange={e => setFormData({ ...formData, images: [e.target.value] })}
                    placeholder="https://..."
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Description & Specifications
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Crafted with 5mm acrylic glass, UV resistant..."
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                  />
                </div>

                {/* Badges toggles */}
                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2 border-t border-stone-100">
                  <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded accent-orange-600"
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestseller}
                      onChange={e => setFormData({ ...formData, isBestseller: e.target.checked })}
                      className="rounded accent-orange-600"
                    />
                    Bestseller
                  </label>
                  <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={e => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="rounded accent-orange-600"
                    />
                    New Arrival
                  </label>
                  <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded accent-orange-600"
                    />
                    Active / Live on Store
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}