import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, X, AlertCircle } from 'lucide-react'
import { useStoreData } from '../../context/StoreDataContext'
import { Button } from '../../components/ui'
import toast from 'react-hot-toast'

export default function AdminCategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStoreData()

  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const initialForm = {
    name: '',
    slug: '',
    icon: '🕉️',
    description: '',
  }
  const [formData, setFormData] = useState(initialForm)

  // Calculate live product count for each category
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: products.filter(p => p.category === cat.slug).length,
  }))

  const filteredCategories = categoriesWithCounts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenAdd = () => {
    setEditingCategory(null)
    setFormData(initialForm)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon || '🕉️',
      description: category.description || '',
    })
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, formData)
      toast.success('Category updated')
    } else {
      addCategory(formData)
      toast.success('Category created')
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id) => {
    deleteCategory(id)
    toast.success('Category deleted')
    setDeleteConfirmId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Deity Categories</h1>
          <p className="text-sm text-stone-500">
            Organize devotional acrylic frame collections by God, Goddess, and themes.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2 shadow-sm self-start sm:self-auto">
          <Plus size={16} /> Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-lg outline-none focus:border-orange-500"
          />
        </div>
        <span className="text-xs text-stone-500 font-medium">
          {filteredCategories.length} categories total
        </span>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map(cat => (
          <div
            key={cat.id}
            className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs hover:border-orange-300 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl border border-amber-100">
                    {cat.icon || '🕉️'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 group-hover:text-orange-600 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-xs font-mono text-stone-400">/{cat.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-stone-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(cat.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-stone-500 line-clamp-2 mb-4 leading-relaxed">
                {cat.description || 'No description provided.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
              <span className="text-stone-400 font-medium">Assigned Products</span>
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                {cat.count} frames
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl animate-fade-in">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertCircle size={24} />
              <h3 className="font-bold text-stone-900">Delete Category?</h3>
            </div>
            <p className="text-sm text-stone-600 mb-6">
              Are you sure? Products in this category will keep their records, but this category slug will be removed.
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

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="text-lg font-bold font-serif text-stone-900">
                {editingCategory ? 'Edit Category' : 'Create Deity Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => {
                    const name = e.target.value
                    setFormData({
                      ...formData,
                      name,
                      slug: editingCategory ? formData.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                    })
                  }}
                  placeholder="e.g. Lord Murugan"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. lord-murugan"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Deity Icon / Emoji
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={e => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g. 🐘, 🦚, 🔱, 🕉️"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Auspicious frames for pooja room..."
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Update' : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
