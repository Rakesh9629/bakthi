import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Truck,
  RotateCcw,
  Clock
} from 'lucide-react'
import { useStoreData } from '../../context/StoreDataContext'
import { useCart } from '../../context/CartContext'
import { Badge, Button, EmptyState } from '../../components/ui'
import toast from 'react-hot-toast'

export default function OrdersPage() {
  const { orders } = useStoreData()
  const { add } = useCart()
  const [filter, setFilter] = useState('all')

  const filteredOrders = orders.filter(o => {
    if (filter === 'active') return o.status === 'processing' || o.status === 'shipped'
    if (filter === 'delivered') return o.status === 'delivered'
    return true
  })

  const handleBuyAgain = (item) => {
    add({ ...item, selectedSize: item.selectedSize || '12×16 in' })
    toast.success(`${item.name} added to cart!`)
  }

  const statusBadgeVariant = (status) => {
    switch (status) {
      case 'delivered': return 'green'
      case 'shipped': return 'blue'
      case 'processing': return 'gold'
      case 'cancelled': return 'red'
      default: return 'default'
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-xs text-stone-400 mb-6 flex items-center gap-1.5">
        <Link to="/" className="hover:text-orange-600">Home</Link>
        <span>/</span>
        <Link to="/account" className="hover:text-orange-600">Account</Link>
        <span>/</span>
        <span className="text-stone-700 font-medium">Orders</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Your Orders</h1>
          <p className="text-sm text-stone-500">Track shipments, download invoices, and reorder favourite frames.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {['all', 'active', 'delivered'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                filter === f
                  ? 'bg-orange-600 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {f === 'all' ? 'All Orders' : f}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders found"
          description="You haven't placed any orders matching this category yet."
          action={
            <Link to="/shop">
              <Button>Browse Divine Frames</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-stone-50/80 px-5 py-3.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <span className="text-stone-400 block text-[11px]">ORDER PLACED</span>
                    <span className="font-semibold text-stone-800">{order.date}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">TOTAL AMOUNT</span>
                    <span className="font-semibold text-stone-900">₹{order.total?.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">SHIP TO</span>
                    <span className="font-semibold text-stone-800">{order.address?.name || 'Customer'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-stone-500 text-[11px]">ID: {order.id}</span>
                  <Badge variant={statusBadgeVariant(order.status)}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Card Body: Items */}
              <div className="p-5 divide-y divide-stone-100">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={item.thumbnail || 'https://picsum.photos/seed/product/100/100'}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover border border-stone-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/product/${item.slug || 'frame'}`}
                          className="font-semibold text-stone-900 text-sm hover:text-orange-600 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Size: {item.selectedSize} {item.selectedShape ? `• ${item.selectedShape}` : ''} • Qty: {item.qty}
                        </p>
                        <p className="text-xs font-bold text-stone-900 mt-1">
                          ₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleBuyAgain(item)}
                        className="text-xs gap-1.5"
                      >
                        <RotateCcw size={13} /> Buy Again
                      </Button>
                      <Link to={`/product/${item.slug || 'frame'}`}>
                        <Button variant="ghost" size="sm" className="text-xs">
                          View Frame
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer: Tracking & Courier Action */}
              <div className="bg-amber-50/40 px-5 py-3 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  {order.tracking ? (
                    <span className="text-stone-600 flex items-center gap-1.5">
                      <Truck size={14} className="text-orange-600" />
                      Shipped via <strong>{order.tracking.courier}</strong> ({order.tracking.trackingNo}) — Status: <strong className="text-orange-700">{order.tracking.status}</strong>
                    </span>
                  ) : (
                    <span className="text-stone-500 flex items-center gap-1.5">
                      <Clock size={14} className="text-amber-500" /> Order is currently being framed and prepared for dispatch.
                    </span>
                  )}
                </div>

                <Link to={`/account/orders/${order.id}/track`}>
                  <Button size="sm" className="gap-1.5 text-xs">
                    <Truck size={14} /> Full Tracking Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}