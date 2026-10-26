import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Shield, Truck, RefreshCw, Star, ArrowRight } from 'lucide-react'
import { BANNERS, CATEGORIES, PRODUCTS, TESTIMONIALS } from '../data'
import { useStoreData } from '../context/StoreDataContext'
import ProductCard from '../components/ProductCard'
import { SectionTitle, Badge } from '../components/ui'
import { BUSINESS_CONFIG } from '../config/business'

function HeroBanner() {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % BANNERS.length), 5000)
    return () => clearInterval(t)
  }, [])
  const b = BANNERS[current]
  return (
    <div className={`relative bg-gradient-to-r ${b.bg} text-white overflow-hidden`} style={{ minHeight: 420 }}>
      <img src={b.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        <Badge variant="gold" className="mb-4 text-sm px-4 py-1">{b.badge}</Badge>
        <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 leading-tight">{b.title}</h1>
        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">{b.subtitle}</p>
        <Link to={b.ctaLink} className="inline-flex items-center gap-2 bg-white text-orange-700 font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors shadow-lg">
          {b.cta} <ArrowRight size={18} />
        </Link>
      </div>
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {BANNERS.map((_, i) => <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/40'}`} />)}
      </div>
      {/* Arrows */}
      <button onClick={() => setCurrent(c => (c - 1 + BANNERS.length) % BANNERS.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm"><ChevronLeft size={20} /></button>
      <button onClick={() => setCurrent(c => (c + 1) % BANNERS.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm"><ChevronRight size={20} /></button>
    </div>
  )
}

function TrustBar() {
  const items = [
    { icon: <Truck size={20} className="text-orange-600" />, title: 'Free Shipping', sub: 'On orders above ₹999' },
    { icon: <Shield size={20} className="text-orange-600" />, title: '100% Authentic', sub: 'Premium quality guaranteed' },
    { icon: <RefreshCw size={20} className="text-orange-600" />, title: '7-Day Returns', sub: 'Hassle-free returns' },
    { icon: <Star size={20} className="text-orange-600" />, title: '4.8★ Rated', sub: '10,000+ happy customers' },
  ]
  return (
    <div className="bg-white border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(({ icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">{icon}</div>
            <div><p className="text-sm font-semibold text-stone-800">{title}</p><p className="text-xs text-stone-500">{sub}</p></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const { products: storeProducts, categories: storeCategories, reviews: storeReviews } = useStoreData()
  const activeProducts = storeProducts || PRODUCTS
  const activeCategories = storeCategories || CATEGORIES
  const activeReviews = storeReviews || TESTIMONIALS

  const featured = activeProducts.filter(p => p.isFeatured).slice(0, 8)
  const bestsellers = activeProducts.filter(p => p.isBestseller).slice(0, 8)
  const newArrivals = activeProducts.filter(p => p.isNewArrival).slice(0, 8)

  return (
    <div>
      <HeroBanner />
      <TrustBar />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <SectionTitle title="Shop by Deity" subtitle="Find the perfect frame for your devotion" center />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {activeCategories.map(cat => (
            <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="group flex flex-col items-center p-3 bg-white rounded-xl border border-stone-100 hover:border-orange-200 hover:shadow-md transition-all text-center">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <p className="text-xs font-semibold text-stone-700 group-hover:text-orange-600 leading-tight">{cat.name}</p>
              <p className="text-[10px] text-stone-400 mt-0.5">{cat.count} frames</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <SectionTitle title="Featured Frames" subtitle="Handpicked premium selections" />
          <Link to="/shop?tag=featured" className="text-sm text-orange-600 font-medium hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Promo banner */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-gradient-to-r from-amber-800 to-orange-700 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-1">Personalized Frames Available!</h3>
            <p className="text-white/80">Custom photo frames with your family deity. WhatsApp us for custom orders.</p>
          </div>
          <a
            href={BUSINESS_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-white text-red-900 font-semibold px-6 py-3 rounded-full hover:bg-amber-50 transition-colors shadow-md"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <SectionTitle title="Bestselling Frames" subtitle="Most loved by our customers" />
          <Link to="/shop?tag=bestseller" className="text-sm text-orange-600 font-medium hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {bestsellers.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Shop by shape */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Shop by Frame Shape" center />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { shape: 'vertical', label: 'Vertical', desc: 'Classic portrait style', emoji: '▯', bg: 'bg-orange-50' },
              { shape: 'horizontal', label: 'Horizontal', desc: 'Wide landscape style', emoji: '▭', bg: 'bg-amber-50' },
              { shape: 'square', label: 'Square', desc: 'Balanced symmetry', emoji: '□', bg: 'bg-yellow-50' },
              { shape: 'round', label: 'Round', desc: 'Unique circular design', emoji: '○', bg: 'bg-red-50' },
            ].map(({ shape, label, desc, emoji, bg }) => (
              <Link key={shape} to={`/shop?shape=${shape}`} className={`${bg} rounded-xl p-6 text-center hover:shadow-md transition-shadow group`}>
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{emoji}</div>
                <h3 className="font-semibold text-stone-800 mb-1">{label}</h3>
                <p className="text-xs text-stone-500">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <SectionTitle title="New Arrivals" subtitle="Fresh additions to our collection" />
          <Link to="/shop?tag=new" className="text-sm text-orange-600 font-medium hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-amber-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="What Our Customers Say" subtitle="Real reviews from verified buyers" center />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeReviews.slice(0, 6).map(t => (
              <div key={t.id} className="bg-white rounded-xl p-5 shadow-sm border border-stone-100">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-stone-800">{t.name}</p>
                    <p className="text-xs text-stone-400">{t.city} · {t.product}</p>
                  </div>
                  {t.verified && <Badge variant="green">✓ Verified</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="font-serif text-3xl font-bold text-stone-900 mb-3">Ready to Bring Divinity Home?</h2>
        <p className="text-stone-500 mb-6">Browse our complete collection of premium acrylic devotional frames</p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-full transition-colors shadow-lg">
          Shop All Frames <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  )
}
