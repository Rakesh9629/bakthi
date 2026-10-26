import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, Tag, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Button, EmptyState, Badge } from '../components/ui'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, subtotal, coupon, couponDiscount, shipping, total, remove, updateQty, applyCoupon, removeCoupon } = useCart()
  const [couponInput, setCouponInput] = useState('')

  function handleApplyCoupon() {
    const result = applyCoupon(couponInput)
    if (result.ok) toast.success(result.message)
    else toast.error(result.message)
  }

  if (items.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <EmptyState icon="🛒" title="Your cart is empty" description="Add some divine frames to your cart and bring blessings home!"
        action={<Link to="/shop"><Button>Browse Frames</Button></Link>} />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-2xl font-bold text-stone-900 mb-6">Shopping Cart ({items.length} items)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => {
            const key = `${item.id}-${item.selectedSize}`
            return (
              <div key={key} className="bg-white rounded-xl p-4 flex gap-4 shadow-sm border border-stone-100">
                <Link to={`/product/${item.slug}`} className="flex-shrink-0">
                  <img src={item.thumbnail} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.slug}`} className="font-semibold text-stone-800 text-sm hover:text-orange-600 line-clamp-2">{item.name}</Link>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="default">{item.selectedSize}</Badge>
                    {item.selectedShape && <Badge variant="default">{item.selectedShape}</Badge>}
                  </div>
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(key, item.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-stone-100 text-stone-600"><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                      <button onClick={() => updateQty(key, item.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-stone-100 text-stone-600"><Plus size={14} /></button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-stone-900">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                      <button onClick={() => { remove(key); toast('Item removed from cart') }} className="text-stone-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2"><Tag size={16} className="text-orange-600" /> Apply Coupon</h3>
            {coupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-green-700">{coupon.code}</p>
                  <p className="text-xs text-green-600">{coupon.description}</p>
                </div>
                <button onClick={removeCoupon} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())} placeholder="Enter coupon code" className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400" onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()} />
                <Button onClick={handleApplyCoupon} size="sm">Apply</Button>
              </div>
            )}
            <p className="text-xs text-stone-400 mt-2">Try: WELCOME10, DIWALI20, FLAT100</p>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
            <h3 className="font-semibold text-stone-800 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
              {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span>−₹{couponDiscount.toLocaleString('en-IN')}</span></div>}
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}</span>
              </div>
              {shipping > 0 && <p className="text-xs text-orange-600">Add ₹{(999 - (subtotal - couponDiscount)).toLocaleString('en-IN')} more for free shipping</p>}
              <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-900 text-base">
                <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button className="w-full mt-4" size="lg">
                <ShoppingBag size={18} /> Proceed to Checkout
              </Button>
            </Link>
            <Link to="/shop" className="block text-center text-sm text-orange-600 hover:underline mt-3">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
