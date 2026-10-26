import { useState } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Share2, Shield, Truck, RefreshCw, Star } from 'lucide-react'
import { PRODUCTS } from '../data'
import { useStoreData } from '../context/StoreDataContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { Button, Badge, StarRating, PriceDisplay } from '../components/ui'
import ProductCard from '../components/ProductCard'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { products: storeProducts } = useStoreData()
  const productList = storeProducts || PRODUCTS
  const product = productList.find(p => p.slug === slug)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || { label: '12×16 in', price: 999 })
  const [selectedShape, setSelectedShape] = useState(product?.shapes?.[0] || 'vertical')
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' })

  const { add } = useCart()
  const { toggle, has } = useWishlist()
  const wished = product ? has(product.id) : false

  if (!product) return <Navigate to="/shop" replace />

  const currentPrice = selectedSize.price
  const currentMrp = Math.round(currentPrice * (product.mrp / product.price))
  const currentDiscount = Math.round(((currentMrp - currentPrice) / currentMrp) * 100)

  function handleAddToCart() {
    add({ ...product, price: currentPrice, mrp: currentMrp, discount: currentDiscount, selectedSize: selectedSize.label, selectedShape, qty })
    toast.success(`${product.name} (${selectedSize.label}) added to cart!`)
  }

  function handleBuyNow() {
    handleAddToCart()
    navigate('/cart')
  }

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const related = productList.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  // Demo reviews
  const reviews = [
    { id: 1, name: 'Priya S.', rating: 5, date: '2024-12-10', title: 'Absolutely beautiful!', body: 'The quality is outstanding. Colors are vibrant and the acrylic is thick and premium. Highly recommend!', verified: true },
    { id: 2, name: 'Rajesh K.', rating: 4, date: '2024-11-28', title: 'Great product', body: 'Very happy with the purchase. Packaging was excellent. Slight delay in delivery but worth the wait.', verified: true },
    { id: 3, name: 'Meena I.', rating: 5, date: '2024-11-15', title: 'Perfect for pooja room', body: 'Exactly as shown in the picture. The frame looks divine in our pooja room. Will order more!', verified: true },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="text-xs text-stone-400 mb-6 flex items-center gap-1 flex-wrap">
        <Link to="/" className="hover:text-orange-600">Home</Link> /
        <Link to="/shop" className="hover:text-orange-600">Shop</Link> /
        <Link to={`/shop?category=${product.category}`} className="hover:text-orange-600">{product.deity}</Link> /
        <span className="text-stone-600">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="bg-amber-50 rounded-2xl overflow-hidden aspect-square">
            <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)} className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-orange-500' : 'border-stone-200'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="text-sm text-orange-600 font-medium mb-1">{product.deity}</p>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-stone-900">{product.name}</h1>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => { toggle(product); toast(wished ? 'Removed from wishlist' : 'Added to wishlist ❤️') }} className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${wished ? 'bg-red-50 border-red-200' : 'bg-white border-stone-200 hover:border-red-200'}`}>
                <Heart size={18} className={wished ? 'fill-red-500 text-red-500' : 'text-stone-400'} />
              </button>
              <button onClick={handleShare} className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center hover:border-orange-200 transition-colors">
                <Share2 size={18} className="text-stone-400" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating} count={product.reviewCount} />
            <span className="text-xs text-stone-400">SKU: {product.sku}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {product.isBestseller && <Badge variant="bestseller">🏆 Bestseller</Badge>}
            {product.isNewArrival && <Badge variant="new">✨ New Arrival</Badge>}
            {product.isFeatured && <Badge variant="gold">⭐ Featured</Badge>}
            {product.stock < 10 && <Badge variant="red">Only {product.stock} left!</Badge>}
          </div>

          <div className="mb-5">
            <PriceDisplay price={currentPrice} mrp={currentMrp} discount={currentDiscount} size="lg" />
            <p className="text-xs text-green-600 mt-1">✓ Inclusive of all taxes · Free shipping above ₹999</p>
          </div>

          {/* Size selector */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-stone-700 mb-2">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(s => (
                <button key={s.value} onClick={() => setSelectedSize(s)} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selectedSize.value === s.value ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-stone-200 text-stone-700 hover:border-orange-300'}`}>
                  {s.label}
                  <span className="block text-xs text-stone-400">₹{s.price.toLocaleString('en-IN')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Shape selector */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-stone-700 mb-2">Frame Orientation</p>
            <div className="flex gap-2">
              {product.shapes.map(s => (
                <button key={s} onClick={() => setSelectedShape(s)} className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${selectedShape === s ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-stone-200 text-stone-700 hover:border-orange-300'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="flex items-center gap-3 mb-6">
            <p className="text-sm font-semibold text-stone-700">Quantity:</p>
            <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-stone-100 text-stone-600 font-bold">−</button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-9 h-9 flex items-center justify-center hover:bg-stone-100 text-stone-600 font-bold">+</button>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3 mb-6">
            <Button onClick={handleAddToCart} variant="outline" size="lg" className="flex-1">
              <ShoppingCart size={18} /> Add to Cart
            </Button>
            <Button onClick={handleBuyNow} size="lg" className="flex-1">
              Buy Now
            </Button>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-amber-50 rounded-xl">
            {[
              { icon: <Truck size={16} className="text-orange-600" />, text: 'Free shipping above ₹999' },
              { icon: <Shield size={16} className="text-orange-600" />, text: '100% authentic product' },
              { icon: <RefreshCw size={16} className="text-orange-600" />, text: '7-day easy returns' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex flex-col items-center text-center gap-1">
                {icon}
                <span className="text-xs text-stone-600">{text}</span>
              </div>
            ))}
          </div>

          {/* Specs */}
          <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
            {[['Material', product.material], ['Thickness', product.thickness], ['Finish', product.finish], ['In Stock', `${product.stock} units`]].map(([k, v]) => (
              <div key={k} className="flex gap-2"><span className="text-stone-400">{k}:</span><span className="font-medium text-stone-700">{v}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex border-b border-stone-200 gap-6">
          {[['description', 'Description'], ['features', 'Features'], ['reviews', `Reviews (${reviews.length})`]].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-orange-600 text-orange-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="py-6">
          {activeTab === 'description' && <p className="text-stone-600 leading-relaxed max-w-2xl">{product.description}</p>}
          {activeTab === 'features' && (
            <ul className="space-y-2 max-w-md">
              {product.features.map(f => <li key={f} className="flex items-center gap-2 text-stone-600"><span className="text-green-500">✓</span> {f}</li>)}
            </ul>
          )}
          {activeTab === 'reviews' && (
            <div className="max-w-2xl space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="bg-white rounded-xl p-4 border border-stone-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-stone-800 text-sm">{r.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={r.rating} size={12} />
                        {r.verified && <Badge variant="green">✓ Verified</Badge>}
                      </div>
                    </div>
                    <span className="text-xs text-stone-400">{r.date}</span>
                  </div>
                  <p className="font-medium text-stone-700 text-sm mb-1">{r.title}</p>
                  <p className="text-stone-500 text-sm">{r.body}</p>
                </div>
              ))}
              <Button variant="outline" onClick={() => setReviewOpen(v => !v)}>Write a Review</Button>
              {reviewOpen && (
                <div className="bg-white rounded-xl p-4 border border-stone-200 space-y-3">
                  <h4 className="font-semibold text-stone-800">Your Review</h4>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => <button key={s} onClick={() => setReviewForm(f => ({...f, rating: s}))}><Star size={20} className={s <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'} /></button>)}
                  </div>
                  <input value={reviewForm.title} onChange={e => setReviewForm(f => ({...f, title: e.target.value}))} placeholder="Review title" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400" />
                  <textarea value={reviewForm.body} onChange={e => setReviewForm(f => ({...f, body: e.target.value}))} placeholder="Share your experience..." rows={3} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 resize-none" />
                  <Button onClick={() => { toast.success('Review submitted! (Demo — not saved to backend yet)'); setReviewOpen(false) }}>Submit Review</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-8">
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
