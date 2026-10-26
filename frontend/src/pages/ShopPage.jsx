import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import { PRODUCTS, CATEGORIES, SHOP_BY } from '../data'
import { useStoreData } from '../context/StoreDataContext'
import ProductCard from '../components/ProductCard'
import { ProductCardSkeleton, EmptyState, Button, Badge } from '../components/ui'

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

const PAGE_SIZE = 12

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-stone-200 pb-4 mb-4">
      <button onClick={() => setOpen(v => !v)} className="flex items-center justify-between w-full text-sm font-semibold text-stone-800 mb-3">
        {title} {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && children}
    </div>
  )
}

function FilterList({ activeCategories, category, shape, priceRange, tag, setParam, activeFilters, clearAll }) {
  return (
    <div className="space-y-0">
      <FilterSection title="Deity / Category">
        {activeCategories.map(cat => (
          <label key={cat.id} className="flex items-center gap-2 py-1 cursor-pointer group">
            <input type="radio" name="category" checked={category === cat.slug} onChange={() => setParam('category', cat.slug)} className="accent-orange-600" />
            <span className="text-sm text-stone-700 group-hover:text-orange-600">{cat.icon} {cat.name}</span>
            <span className="ml-auto text-xs text-stone-400">{cat.count}</span>
          </label>
        ))}
      </FilterSection>
      <FilterSection title="Frame Shape">
        {SHOP_BY.shape.map(s => (
          <label key={s.value} className="flex items-center gap-2 py-1 cursor-pointer">
            <input type="radio" name="shape" checked={shape === s.value} onChange={() => setParam('shape', s.value)} className="accent-orange-600" />
            <span className="text-sm text-stone-700">{s.icon} {s.label}</span>
          </label>
        ))}
      </FilterSection>
      <FilterSection title="Price Range">
        {SHOP_BY.price.map(p => (
          <label key={p.value} className="flex items-center gap-2 py-1 cursor-pointer">
            <input type="radio" name="price" checked={priceRange === p.value} onChange={() => setParam('price', p.value)} className="accent-orange-600" />
            <span className="text-sm text-stone-700">{p.label}</span>
          </label>
        ))}
      </FilterSection>
      <FilterSection title="Collections">
        {[['featured', '⭐ Featured'], ['bestseller', '🏆 Bestsellers'], ['new', '✨ New Arrivals']].map(([v, l]) => (
          <label key={v} className="flex items-center gap-2 py-1 cursor-pointer">
            <input type="radio" name="tag" checked={tag === v} onChange={() => setParam('tag', v)} className="accent-orange-600" />
            <span className="text-sm text-stone-700">{l}</span>
          </label>
        ))}
      </FilterSection>
      {activeFilters.length > 0 && (
        <button onClick={clearAll} className="text-sm text-red-600 hover:underline mt-2">Clear all filters</button>
      )}
    </div>
  )
}

export default function ShopPage() {
  const { products: storeProducts, categories: storeCategories } = useStoreData()
  const activeProducts = storeProducts || PRODUCTS
  const activeCategories = storeCategories || CATEGORIES
  const [params, setParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const category = params.get('category') || ''
  const tag = params.get('tag') || ''
  const shape = params.get('shape') || ''
  const room = params.get('room') || ''
  const q = params.get('q') || ''
  const sort = params.get('sort') || 'popular'
  const priceRange = params.get('price') || ''
  const page = parseInt(params.get('page') || '1')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 200)
    return () => clearTimeout(t)
  }, [category, tag, shape, q, sort, priceRange])

  function setParam(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value); else next.delete(key)
    next.delete('page')
    setParams(next)
  }

  function clearAll() { setParams({}) }

  const filtered = useMemo(() => {
    let list = [...activeProducts]
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.deity.toLowerCase().includes(q.toLowerCase()))
    if (category) list = list.filter(p => p.category === category)
    if (tag === 'featured') list = list.filter(p => p.isFeatured)
    if (tag === 'bestseller') list = list.filter(p => p.isBestseller)
    if (tag === 'new') list = list.filter(p => p.isNewArrival)
    if (shape) list = list.filter(p => p.shapes?.includes(shape))
    if (room) list = list.filter(p => p.room?.includes(room))
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number)
      list = list.filter(p => p.price >= min && p.price <= max)
    }
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    else if (sort === 'newest') list.sort((a, b) => b.id - a.id)
    return list
  }, [activeProducts, q, category, tag, shape, room, priceRange, sort])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeFilters = [
    category && { key: 'category', label: CATEGORIES.find(c => c.slug === category)?.name },
    tag && { key: 'tag', label: tag },
    shape && { key: 'shape', label: shape },
    room && { key: 'room', label: room },
    priceRange && { key: 'price', label: `₹${priceRange.replace('-', '–')}` },
    q && { key: 'q', label: `"${q}"` },
  ].filter(Boolean)

  const pageTitle = category ? CATEGORIES.find(c => c.slug === category)?.name
    : tag === 'bestseller' ? 'Bestselling Frames'
    : tag === 'new' ? 'New Arrivals'
    : tag === 'featured' ? 'Featured Frames'
    : q ? `Search: "${q}"`
    : 'All Frames'

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="text-xs text-stone-400 mb-4 flex items-center gap-1">
        <Link to="/" className="hover:text-orange-600">Home</Link> / <span className="text-stone-600">{pageTitle}</span>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white rounded-xl p-4 shadow-sm sticky top-20">
            <h3 className="font-semibold text-stone-800 mb-4">Filters</h3>
            <FilterList
              activeCategories={activeCategories}
              category={category}
              shape={shape}
              priceRange={priceRange}
              tag={tag}
              setParam={setParam}
              activeFilters={activeFilters}
              clearAll={clearAll}
            />
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-serif font-bold text-stone-900">{pageTitle}</h1>
              <p className="text-sm text-stone-500">{filtered.length} products</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setFiltersOpen(true)} className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium">
                <SlidersHorizontal size={15} /> Filters {activeFilters.length > 0 && <Badge variant="saffron">{activeFilters.length}</Badge>}
              </button>
              <select value={sort} onChange={e => setParam('sort', e.target.value)} className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm outline-none cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.map(f => (
                <button key={f.key} onClick={() => setParam(f.key, '')} className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full hover:bg-orange-200 transition-colors">
                  {f.label} <X size={12} />
                </button>
              ))}
              <button onClick={clearAll} className="px-3 py-1 text-xs text-stone-500 hover:text-red-600">Clear all</button>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(PAGE_SIZE)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : paginated.length === 0 ? (
            <EmptyState icon="🔍" title="No products found" description="Try adjusting your filters or search query" action={<Button onClick={clearAll}>Clear Filters</Button>} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginated.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button disabled={page === 1} onClick={() => setParam('page', String(page - 1))} className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm disabled:opacity-40 hover:border-orange-400 transition-colors">← Prev</button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setParam('page', String(i + 1))} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-orange-600 text-white' : 'bg-white border border-stone-200 hover:border-orange-400'}`}>{i + 1}</button>
              ))}
              <button disabled={page === totalPages} onClick={() => setParam('page', String(page + 1))} className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm disabled:opacity-40 hover:border-orange-400 transition-colors">Next →</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto p-4 animate-slide-down">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-stone-800">Filters</h3>
              <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
            </div>
            <FilterList
              activeCategories={activeCategories}
              category={category}
              shape={shape}
              priceRange={priceRange}
              tag={tag}
              setParam={setParam}
              activeFilters={activeFilters}
              clearAll={clearAll}
            />
            <Button className="w-full mt-4" onClick={() => setFiltersOpen(false)}>Apply Filters</Button>
          </div>
        </div>
      )}
    </div>
  )
}
