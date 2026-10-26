import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, ShoppingCart, Heart, Menu, X, ChevronDown, Sparkles } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useStoreData } from '../../context/StoreDataContext'
import { SHOP_BY, PRODUCTS, CATEGORIES } from '../../data'
import { BUSINESS_CONFIG } from '../../config/business'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [megaMenu, setMegaMenu] = useState(null) // 'categories' | 'shop'
  const { count } = useCart()
  const { count: wishCount } = useWishlist()
  const { products: storeProducts, categories: storeCategories } = useStoreData()
  const productList = storeProducts || PRODUCTS
  const categoryList = storeCategories || CATEGORIES
  const navigate = useNavigate()
  const location = useLocation()
  const searchRef = useRef(null)

  const [prevPath, setPrevPath] = useState(location.pathname)
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
    setMobileOpen(false)
    setMegaMenu(null)
  }

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const searchResults = searchQuery.length > 1
    ? productList.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.deity.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : []

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      {/* Main Nav (Top Announcement Bar removed per requirement #1) */}
      <nav className="bg-[#fffdfa] border-b border-amber-900/10 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-11 h-11 bg-gradient-to-br from-red-950 via-red-900 to-amber-950 rounded-xl flex items-center justify-center text-amber-300 font-bold text-2xl font-serif shadow-sm border border-amber-500/40 group-hover:border-amber-400 transition-colors">
              🕉️
            </div>
            <div>
              <div className="font-serif text-2xl font-bold tracking-tight text-red-950 leading-none flex items-center gap-1.5">
                {BUSINESS_CONFIG.name}
              </div>
              <div className="text-[10px] text-amber-700 font-semibold tracking-widest uppercase mt-0.5">
                DIVINE ACRYLIC FRAMES
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                location.pathname === '/' ? 'text-red-950 border-b-2 border-red-900' : 'text-stone-700 hover:text-red-900'
              }`}
            >
              Home
            </Link>

            {/* Deities mega menu */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenu('categories')}
              onMouseLeave={() => setMegaMenu(null)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                  megaMenu === 'categories' ? 'text-red-950' : 'text-stone-700 hover:text-red-900'
                }`}
              >
                Deities{' '}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    megaMenu === 'categories' ? 'rotate-180 text-amber-600' : ''
                  }`}
                />
              </button>

              {megaMenu === 'categories' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[680px] bg-white border border-amber-900/15 rounded-2xl shadow-xl p-6 animate-slide-down z-50">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
                    <p className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-600" /> Sacred Deities Collection
                    </p>
                    <Link
                      to="/shop"
                      onClick={() => setMegaMenu(null)}
                      className="text-xs font-semibold text-red-900 hover:text-red-700 hover:underline"
                    >
                      View All Deity Frames →
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {categoryList.map(cat => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${cat.slug}`}
                        onClick={() => setMegaMenu(null)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors group border border-transparent hover:border-amber-200/60"
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <div className="text-sm font-semibold text-stone-800 group-hover:text-red-950">
                            {cat.name}
                          </div>
                          <div className="text-xs text-stone-400">
                            {cat.count ? `${cat.count} frames` : 'Devotional art'}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shop mega menu */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenu('shop')}
              onMouseLeave={() => setMegaMenu(null)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                  megaMenu === 'shop' ? 'text-red-950' : 'text-stone-700 hover:text-red-900'
                }`}
              >
                Shop{' '}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    megaMenu === 'shop' ? 'rotate-180 text-amber-600' : ''
                  }`}
                />
              </button>

              {megaMenu === 'shop' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[540px] bg-white border border-amber-900/15 rounded-2xl shadow-xl p-6 animate-slide-down z-50">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2.5">
                        Shop By Space
                      </p>
                      {SHOP_BY.room.map(r => (
                        <Link
                          key={r.value}
                          to={`/shop?room=${r.value}`}
                          onClick={() => setMegaMenu(null)}
                          className="flex items-center gap-2.5 py-1.5 text-sm font-medium text-stone-700 hover:text-red-950 transition-colors"
                        >
                          <span className="text-base">{r.icon}</span> {r.label}
                        </Link>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2.5">
                        Frame Formats
                      </p>
                      {SHOP_BY.shape.map(s => (
                        <Link
                          key={s.value}
                          to={`/shop?shape=${s.value}`}
                          onClick={() => setMegaMenu(null)}
                          className="flex items-center gap-2 py-1.5 text-sm font-medium text-stone-700 hover:text-red-950 transition-colors"
                        >
                          <span className="text-stone-400 font-mono">{s.icon}</span> {s.label}
                        </Link>
                      ))}
                      <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 mt-4">
                        Curated Highlights
                      </p>
                      <Link
                        to="/shop?tag=bestseller"
                        onClick={() => setMegaMenu(null)}
                        className="block py-1 text-sm font-semibold text-amber-900 hover:text-red-950"
                      >
                        🏆 Bestsellers
                      </Link>
                      <Link
                        to="/shop?tag=new"
                        onClick={() => setMegaMenu(null)}
                        className="block py-1 text-sm font-semibold text-amber-900 hover:text-red-950"
                      >
                        ✨ New Creations
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/shop"
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                location.pathname === '/shop' ? 'text-red-950 border-b-2 border-red-900' : 'text-stone-700 hover:text-red-900'
              }`}
            >
              All Frames
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                location.pathname === '/about' ? 'text-red-950 border-b-2 border-red-900' : 'text-stone-700 hover:text-red-900'
              }`}
            >
              About
            </Link>
            <Link
              to="/reviews"
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                location.pathname === '/reviews' ? 'text-red-950 border-b-2 border-red-900' : 'text-stone-700 hover:text-red-900'
              }`}
            >
              Reviews
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                location.pathname === '/contact' ? 'text-red-950 border-b-2 border-red-900' : 'text-stone-700 hover:text-red-900'
              }`}
            >
              Contact
            </Link>
            <Link
              to="/track-order"
              className="px-3 py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200/80 transition-colors ml-1"
            >
              Track Order
            </Link>
          </div>

          {/* Right Action Icons (NO customer login / register / account icon) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-stone-700 hover:text-red-950 hover:bg-amber-50 rounded-full transition-colors cursor-pointer"
              title="Search Devotional Frames"
              aria-label="Search"
            >
              <Search size={21} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 text-stone-700 hover:text-red-950 hover:bg-amber-50 rounded-full transition-colors"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={21} />
              {wishCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-800 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 text-stone-700 hover:text-red-950 hover:bg-amber-50 rounded-full transition-colors"
              title="Shopping Cart"
              aria-label="Cart"
            >
              <ShoppingCart size={21} />
              {count > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden p-2 text-stone-700 hover:text-red-950 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer (NO customer login/register links) */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-amber-900/10 bg-[#fffdfa] animate-slide-down max-h-[85vh] overflow-y-auto shadow-lg">
            <div className="px-5 py-4 space-y-2">
              <Link to="/" className="block py-2 text-base font-semibold text-stone-800 border-b border-stone-100">
                Home
              </Link>
              <Link to="/shop" className="block py-2 text-base font-semibold text-stone-800 border-b border-stone-100">
                All Frames
              </Link>
              <Link to="/track-order" className="block py-2 text-base font-semibold text-amber-900 border-b border-stone-100">
                📦 Track Order
              </Link>

              <p className="pt-3 pb-1 text-xs font-bold text-amber-800 uppercase tracking-wider">
                Shop by Sacred Deity
              </p>
              <div className="grid grid-cols-2 gap-1.5 pb-2">
                {categoryList.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.slug}`}
                    className="flex items-center gap-2 py-1.5 text-sm text-stone-700 hover:text-red-950"
                  >
                    <span>{cat.icon}</span> <span className="truncate">{cat.name}</span>
                  </Link>
                ))}
              </div>

              <p className="pt-2 pb-1 text-xs font-bold text-amber-800 uppercase tracking-wider border-t border-stone-100">
                Collections
              </p>
              <Link to="/shop?tag=bestseller" className="block py-1.5 text-sm font-medium text-stone-700">
                🏆 Bestselling Frames
              </Link>
              <Link to="/shop?tag=new" className="block py-1.5 text-sm font-medium text-stone-700">
                ✨ New Creations
              </Link>

              <div className="pt-3 border-t border-stone-100 space-y-2">
                <Link to="/about" className="block py-1.5 text-sm font-semibold text-stone-800">
                  About Bhakthi Printings
                </Link>
                <Link to="/reviews" className="block py-1.5 text-sm font-semibold text-stone-800">
                  Devotee Reviews
                </Link>
                <Link to="/contact" className="block py-1.5 text-sm font-semibold text-stone-800">
                  Contact & Support
                </Link>
                <a
                  href={BUSINESS_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors mt-3"
                >
                  💬 WhatsApp: {BUSINESS_CONFIG.phoneFormatted}
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[100] flex items-start justify-center pt-20 px-4 backdrop-blur-xs"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in border border-amber-900/15"
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="flex items-center gap-3 p-4 border-b border-stone-200">
              <Search size={20} className="text-amber-700 flex-shrink-0" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for Lord Ganesha, Krishna, Shiva, Lakshmi frames..."
                className="flex-1 text-base outline-none text-stone-900 placeholder-stone-400 bg-transparent font-medium"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="p-3 max-h-80 overflow-y-auto divide-y divide-stone-100">
                {searchResults.map(p => (
                  <Link
                    key={p.id}
                    to={`/product/${p.slug}`}
                    onClick={() => {
                      setSearchOpen(false)
                      setSearchQuery('')
                    }}
                    className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-amber-50/70 transition-colors group"
                  >
                    <img
                      src={p.thumbnail || p.images?.[0]}
                      alt={p.name}
                      className="w-13 h-13 object-cover rounded-lg border border-amber-900/10 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-stone-900 group-hover:text-red-950 truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-amber-800 font-medium">{p.deity} · ₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                  </Link>
                ))}
                <button
                  onClick={handleSearch}
                  className="w-full text-center py-2.5 text-sm text-red-950 font-bold hover:bg-amber-50 rounded-xl mt-1 cursor-pointer"
                >
                  See all results for "{searchQuery}" →
                </button>
              </div>
            )}

            {searchQuery.length > 1 && searchResults.length === 0 && (
              <div className="p-8 text-center text-stone-500 text-sm">
                No devotional frames found for "{searchQuery}". Try searching for Ganesha, Krishna, or Shiva.
              </div>
            )}

            {searchQuery.length === 0 && (
              <div className="p-5 bg-amber-50/40">
                <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2.5">
                  Popular Devotional Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Lord Ganesha', 'Radha Krishna', 'Lord Shiva', 'Goddess Lakshmi', 'Lord Murugan', 'Ram Darbar', 'Tirupati Balaji'].map(t => (
                    <button
                      key={t}
                      onClick={() => setSearchQuery(t)}
                      className="px-3 py-1.5 bg-white border border-amber-200 text-amber-900 text-xs font-semibold rounded-full hover:bg-amber-100 hover:border-amber-400 transition-colors cursor-pointer"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
