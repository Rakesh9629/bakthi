import { Link } from 'react-router-dom'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { Button, EmptyState, Badge } from '../components/ui'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const { items, toggle } = useWishlist()
  const { add } = useCart()

  const handleAddToCart = (product) => {
    add({
      ...product,
      selectedSize: product.sizes?.[0]?.label || '12×16 in',
      selectedShape: product.shapes?.[0] || 'vertical',
      qty: 1,
    })
    toast.success(`${product.name} added to cart!`)
  }

  const handleMoveAllToCart = () => {
    items.forEach(p => {
      add({
        ...p,
        selectedSize: p.sizes?.[0]?.label || '12×16 in',
        selectedShape: p.shapes?.[0] || 'vertical',
        qty: 1,
      })
    })
    toast.success(`Moved all ${items.length} items to cart!`)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon="❤️"
          title="Your Wishlist is Empty"
          description="Save divine frames you love to your wishlist and revisit them anytime."
          action={
            <Link to="/shop">
              <Button size="lg">Explore Divine Frames</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-xs text-stone-400 mb-6 flex items-center gap-1.5">
        <Link to="/" className="hover:text-orange-600">Home</Link>
        <span>/</span>
        <span className="text-stone-700 font-medium">My Wishlist</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">
            My Wishlist ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-sm text-stone-500">Your curated devotional collection.</p>
        </div>

        <Button onClick={handleMoveAllToCart} size="sm" className="gap-2 self-start sm:self-auto">
          <ShoppingCart size={16} /> Move All to Cart
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map(product => (
          <div
            key={product.id}
            className="group bg-white rounded-xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Image & overlay */}
              <div className="relative aspect-[4/5] bg-amber-50 overflow-hidden">
                <img
                  src={product.thumbnail || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => {
                    toggle(product)
                    toast('Removed from wishlist')
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-red-500 hover:bg-white hover:text-red-700 transition-colors"
                  title="Remove"
                >
                  <Trash2 size={15} />
                </button>

                {product.discount > 0 && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="sale">{product.discount}% OFF</Badge>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <span className="text-[11px] text-orange-600 font-semibold">{product.deity}</span>
                <Link to={`/product/${product.slug}`} className="block">
                  <h3 className="text-sm font-semibold text-stone-900 hover:text-orange-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-bold text-stone-900 text-sm">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-xs text-stone-400 line-through">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Add to cart bottom button */}
            <div className="p-3 pt-0">
              <Button
                onClick={() => handleAddToCart(product)}
                variant="primary"
                size="sm"
                className="w-full gap-1.5 text-xs"
              >
                <ShoppingCart size={14} /> Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}