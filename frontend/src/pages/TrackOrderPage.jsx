import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  Search,
  Truck,
  Package,
  MapPin,
  Copy,
  Phone,
  MessageCircle,
  CheckCircle,
} from 'lucide-react'
import { useStoreData } from '../context/StoreDataContext'
import { Button, Badge } from '../components/ui'
import { BUSINESS_CONFIG } from '../config/business'
import toast from 'react-hot-toast'

export default function TrackOrderPage() {
  const { orderId: paramOrderId } = useParams()
  const [searchParams] = useSearchParams()
  const queryOrderId = searchParams.get('id') || paramOrderId || ''

  const { orders } = useStoreData()

  const [searchId, setSearchId] = useState(queryOrderId)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const lookupOrder = useCallback(async (idToSearch) => {
    if (!idToSearch || !idToSearch.trim()) return
    setLoading(true)
    setHasSearched(true)

    const cleanId = idToSearch.trim().toUpperCase()

    // 1. Try backend API
    try {
      const url = `/api/orders/track/${encodeURIComponent(cleanId)}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setOrder(data)
        setLoading(false)
        return
      }
    } catch {
      // fallback to store data
    }

    // 2. Fallback to storeData / demo orders
    const found = orders.find(
      (o) => o.id.toUpperCase() === cleanId || o.id.toUpperCase().includes(cleanId)
    )
    if (found) {
      setOrder(found)
    } else {
      setOrder(null)
    }
    setLoading(false)
  }, [orders])

  useEffect(() => {
    if (!queryOrderId) return
    let active = true
    const cleanId = queryOrderId.trim().toUpperCase()

    fetch(`/api/orders/track/${encodeURIComponent(cleanId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return
        if (data) {
          setOrder(data)
        } else {
          const found = orders.find(
            (o) => o.id.toUpperCase() === cleanId || o.id.toUpperCase().includes(cleanId)
          )
          setOrder(found || null)
        }
        setHasSearched(true)
        setLoading(false)
      })
      .catch(() => {
        if (!active) return
        const found = orders.find(
          (o) => o.id.toUpperCase() === cleanId || o.id.toUpperCase().includes(cleanId)
        )
        setOrder(found || null)
        setHasSearched(true)
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [queryOrderId, orders])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchId.trim()) {
      toast.error('Please enter an Order ID.')
      return
    }
    lookupOrder(searchId)
  }

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text)
    toast.success('Tracking number copied!')
  }

  // Determine timeline progress
  let activeStep = 1
  if (order) {
    const status = (order.status || '').toLowerCase()
    const trkStatus = (order.tracking?.status || '').toLowerCase()
    if (status === 'delivered' || trkStatus.includes('delivered')) activeStep = 4
    else if (status === 'shipped' || trkStatus.includes('transit') || trkStatus.includes('shipped')) activeStep = 3
    else if (trkStatus.includes('dispatched')) activeStep = 2
    else if (trkStatus.includes('packed') || status === 'processing') activeStep = 1
  }

  const steps = order
    ? [
        {
          title: 'Order Confirmed',
          desc: 'Devotional frame order received & verified',
          date: order.date,
          completed: activeStep >= 0,
        },
        {
          title: 'Laser Cutting & UV Printing',
          desc: '5mm high-gloss acrylic crafted and inspected',
          date: order.date,
          completed: activeStep >= 1,
        },
        {
          title: 'Dispatched & Handed Over',
          desc: `Handed over to ${order.tracking?.courier || 'Express Courier'}`,
          date: order.tracking?.updatedAt || 'In Process',
          completed: activeStep >= 2,
        },
        {
          title: 'In Transit',
          desc: 'Safe journey with protective multi-layer packaging',
          date: activeStep >= 3 ? order.tracking?.updatedAt : 'Pending',
          completed: activeStep >= 3,
        },
        {
          title: 'Delivered',
          desc: 'Safely arrived for your sacred pooja space',
          date: activeStep >= 4 ? order.tracking?.updatedAt : 'Estimated 2–4 days',
          completed: activeStep >= 4,
        },
      ]
    : []

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold">
          <Truck size={14} />
          <span>Real-time Courier Tracking</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          Track Your Devotional Order
        </h1>
        <p className="text-sm text-stone-600">
          Enter your Order ID (from your confirmation screen or SMS) to check live dispatch and courier transit status.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/70 shadow-xs">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="e.g. BKT-2026-0001"
              className="w-full border border-stone-200 rounded-xl pl-4 pr-10 py-3 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 uppercase tracking-wide font-medium bg-stone-50/50 focus:bg-white"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs">
              ORDER ID
            </span>
          </div>
          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="w-full justify-center bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-amber-50 gap-2"
          >
            <Search size={16} />
            <span>Track Order</span>
          </Button>
        </form>

        <p className="text-xs text-stone-400 mt-3 text-center sm:text-left">
          Demo IDs for testing: <span className="font-mono text-amber-800 font-semibold cursor-pointer" onClick={() => { setSearchId('BKT-2026-001'); lookupOrder('BKT-2026-001'); }}>BKT-2026-001</span> or <span className="font-mono text-amber-800 font-semibold cursor-pointer" onClick={() => { setSearchId('BKT-2026-002'); lookupOrder('BKT-2026-002'); }}>BKT-2026-002</span>
        </p>
      </div>

      {/* Result Card */}
      {hasSearched && !order && !loading && (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Package size={24} />
          </div>
          <h3 className="font-serif font-bold text-stone-900 text-lg">No Order Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            We could not find an order matching <span className="font-mono font-semibold text-stone-800">{searchId}</span>. Please verify your order ID or contact our helpline on WhatsApp.
          </p>
          <a
            href={`${BUSINESS_CONFIG.whatsappUrl}&text=${encodeURIComponent(
              `Hello Bhakthi Printings, I need help tracking my order: ${searchId}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold text-xs px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle size={15} />
            <span>Ask Support on WhatsApp</span>
          </a>
        </div>
      )}

      {order && (
        <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden space-y-6 p-6 sm:p-8">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-lg text-stone-900">{order.id}</span>
                <Badge variant={order.status === 'delivered' ? 'green' : order.status === 'shipped' ? 'blue' : 'amber'}>
                  {order.status ? order.status.toUpperCase() : 'PROCESSING'}
                </Badge>
              </div>
              <p className="text-xs text-stone-500 mt-1">Placed on {order.date}</p>
            </div>

            {order.tracking && (
              <div className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Courier Partner</p>
                  <p className="text-xs font-bold text-stone-800">{order.tracking.courier}</p>
                </div>
                <div className="h-6 w-px bg-stone-200" />
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Tracking AWB</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-medium text-stone-700">{order.tracking.trackingNo}</span>
                    <button
                      onClick={() => handleCopy(order.tracking.trackingNo)}
                      className="text-stone-400 hover:text-amber-800"
                      title="Copy"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-4 py-2">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Sacred Dispatch Progress</h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {steps.map((st) => (
                <div key={st.title} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      st.completed
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-stone-300'
                    }`}
                  >
                    {st.completed && <CheckCircle size={10} className="stroke-[3]" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-bold ${st.completed ? 'text-stone-900' : 'text-stone-400'}`}>
                        {st.title}
                      </p>
                      <span className="text-[10px] text-stone-400">• {st.date}</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
            {/* Items */}
            <div>
              <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wider mb-3">
                Items in This Order
              </h4>
              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={item.thumbnail || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=120&q=80'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                    />
                    <div className="text-xs flex-1">
                      <p className="font-semibold text-stone-800 line-clamp-1">{item.name}</p>
                      <p className="text-stone-500">
                        {item.selectedSize || '12×16 in'} • Qty: {item.qty}
                      </p>
                      <p className="font-semibold text-amber-900">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery destination */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 text-xs space-y-2">
              <h4 className="font-semibold text-stone-900 flex items-center gap-1.5">
                <MapPin size={14} className="text-amber-800" />
                <span>Delivery Address</span>
              </h4>
              <div className="text-stone-600 leading-relaxed">
                <p className="font-medium text-stone-800">{order.address?.name}</p>
                <p>{order.address?.line1}</p>
                {order.address?.line2 && <p>{order.address?.line2}</p>}
                <p>{order.address?.city}, {order.address?.state} – {order.address?.pincode}</p>
                <p className="mt-1 flex items-center gap-1 text-stone-500">
                  <Phone size={12} /> {order.address?.phone}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs font-semibold">
                <span className="text-stone-700">Total Order Value:</span>
                <span className="text-base text-red-950 font-serif">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Need help footer */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-stone-500">Have questions about your frame delivery?</span>
            <a
              href={`${BUSINESS_CONFIG.whatsappUrl}&text=${encodeURIComponent(
                `Hello Bhakthi Printings, I have a query about my order ${order.id}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:underline"
            >
              <MessageCircle size={14} />
              <span>WhatsApp Helpline: +91 {BUSINESS_CONFIG.phone}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
