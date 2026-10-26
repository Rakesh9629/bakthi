import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { Badge, StarRating, PriceDisplay } from './ui'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { add } = useCart()
  const { toggle, has } = useWishlist()
  const wished = has(product.id)

  function handleAddToCart(e) {
    e.preventDefault()
    add({ ...product, selectedSize: product.sizes[0].label })
    toast.success(`${product.name} added to cart!`)
  }

  function handleWishlist(e) {
    e.preventDefault()
    toggle(product)
    toast(wished ? 'Removed from wishlist' : 'Added to wishlist ❤️')
  }

  return (
    <Link to={`/product/${product.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-stone-100">
      {/* Image */}
      <div className="relative overflow-hidden bg-amber-50 aspect-[4/5]">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isBestseller && <Badge variant="bestseller">Bestseller</Badge>}
          {product.isNewArrival && <Badge variant="new">New</Badge>}
          {product.discount > 0 && <Badge variant="sale">{product.discount}% OFF</Badge>}
        </div>
        {/* Actions overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={handleWishlist} className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors" title="Wishlist">
            <Heart size={15} className={wished ? 'fill-red-500 text-red-500' : 'text-stone-400'} />
          </button>
          <Link to={`/product/${product.slug}`} className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-orange-50 transition-colors" title="Quick view">
            <Eye size={15} className="text-stone-400" />
          </Link>
        </div>
        {/* Add to cart bar */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={handleAddToCart} className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2.5 flex items-center justify-center gap-2 transition-colors">
            <ShoppingCart size={15} /> Add to Cart
          </button>
        </div>
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-orange-600 font-medium mb-0.5">{product.deity}</p>
        <h3 className="text-sm font-semibold text-stone-800 line-clamp-2 leading-snug mb-1">{product.name}</h3>
        <StarRating rating={product.rating} count={product.reviewCount} size={12} />
        <div className="mt-2">
          <PriceDisplay price={product.price} mrp={product.mrp} discount={product.discount} size="sm" />
        </div>
      </div>
    </Link>
  )
}
