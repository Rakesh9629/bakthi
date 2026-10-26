import { useParams, Link } from 'react-router-dom'
import {
  Truck,
  Package,
  MapPin,
  ChevronLeft,
  Copy,
  PhoneCall
} from 'lucide-react'
import { useStoreData } from '../../context/StoreDataContext'
import { Button, Badge } from '../../components/ui'
import toast from 'react-hot-toast'

export default function OrderTrackingPage() {
  const { orderId } = useParams()
  const { orders } = useStoreData()

  const order = orders.find(o => o.id === orderId) || orders[0]

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold font-serif mb-2">Order Not Found</h2>
        <p className="text-stone-500 mb-6">We could not locate this order id in our records.</p>
        <Link to="/account/orders"><Button>Back to Orders</Button></Link>
      </div>
    )
  }

  const tracking = order.tracking || {
    courier: 'Delhivery Express',
    trackingNo: 'DL893049281IN',
    status: order.status === 'delivered' ? 'Delivered' : order.status === 'shipped' ? 'In Transit' : 'Processing',
    updatedAt: order.date
  }

  // Determine active step (0 to 4)
  let activeStep = 1
  if (order.status === 'delivered' || tracking.status === 'Delivered') activeStep = 4
  else if (order.status === 'shipped' || tracking.status === 'In Transit') activeStep = 3
  else if (tracking.status === 'Dispatched') activeStep = 2
  else if (tracking.status === 'Packed') activeStep = 1

  const steps = [
    { title: 'Order Confirmed', desc: 'Divine frame order registered', date: order.date, completed: activeStep >= 0 },
    { title: 'Printed & UV Cured', desc: '5mm acrylic laser cut and cured', date: order.date, completed: activeStep >= 1 },
    { title: 'Dispatched & Handed Over', desc: `Handed over to ${tracking.courier}`, date: tracking.updatedAt, completed: activeStep >= 2 },
    { title: 'In Transit', desc: 'Arrived at distribution hub', date: activeStep >= 3 ? tracking.updatedAt : 'Pending', completed: activeStep >= 3 },
    { title: 'Delivered', desc: 'Safely delivered to your doorstep', date: activeStep >= 4 ? tracking.updatedAt : 'Estimated 2-3 days', completed: activeStep >= 4 },
  ]

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text)
    toast.success('Tracking number copied!')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link to="/account/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-orange-600 mb-6 transition-colors">
        <ChevronLeft size={16} /> Back to My Orders
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Live Package Tracker</span>
            <h1 className="text-2xl font-bold font-serif text-stone-900 mt-0.5">Order #{order.id}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400">Current Status:</span>
            <Badge variant={order.status === 'delivered' ? 'green' : 'blue'} className="text-xs uppercase">
              {tracking.status || order.status}
            </Badge>
          </div>
        </div>

        {/* Courier details banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
            <span className="text-stone-400 block mb-0.5">Logistics Partner</span>
            <strong className="text-stone-900 text-sm flex items-center gap-1.5">
              <Truck size={15} className="text-orange-600" /> {tracking.courier}
            </strong>
          </div>

          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-stone-400 block mb-0.5">AWB / Tracking Number</span>
              <span className="text-stone-900 font-mono text-sm font-semibold">{tracking.trackingNo}</span>
            </div>
            <button
              onClick={() => handleCopy(tracking.trackingNo)}
              className="text-stone-400 hover:text-orange-600 p-1.5 rounded-lg hover:bg-stone-200/60"
              title="Copy AWB"
            >
              <Copy size={15} />
            </button>
          </div>

          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
            <span className="text-stone-400 block mb-0.5">Estimated Delivery</span>
            <strong className="text-stone-900 text-sm">
              {order.status === 'delivered' ? 'Delivered' : 'Within 3-5 Business Days'}
            </strong>
          </div>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs mb-6">
        <h3 className="font-semibold text-stone-900 mb-6">Shipment Journey</h3>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-stone-200 space-y-8 ml-3 sm:ml-4">
          {steps.map((st, i) => (
            <div key={i} className="relative">
              {/* Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  st.completed
                    ? 'bg-orange-600 text-white ring-4 ring-orange-100'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                {st.completed ? '✓' : i + 1}
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-bold ${st.completed ? 'text-stone-900' : 'text-stone-400'}`}>
                    {st.title}
                  </h4>
                  <span className="text-xs text-stone-400">{st.date}</span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ordered Items & Delivery Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
          <h3 className="font-semibold text-stone-900 mb-4 text-sm flex items-center gap-1.5">
            <Package size={16} className="text-orange-600" /> Package Contents
          </h3>
          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <img
                  src={item.thumbnail || 'https://picsum.photos/seed/product/80/80'}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover border border-stone-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-stone-900 truncate">{item.name}</p>
                  <p className="text-[11px] text-stone-400">Qty: {item.qty} • {item.selectedSize}</p>
                </div>
                <span className="text-xs font-semibold text-stone-800">
                  ₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-stone-900 mb-3 text-sm flex items-center gap-1.5">
              <MapPin size={16} className="text-orange-600" /> Destination Address
            </h3>
            <p className="font-semibold text-stone-800 text-sm">{order.address?.name}</p>
            <p className="text-xs text-stone-600 mt-1">{order.address?.line1}</p>
            {order.address?.line2 && <p className="text-xs text-stone-600">{order.address?.line2}</p>}
            <p className="text-xs text-stone-600">
              {order.address?.city}, {order.address?.state} - {order.address?.pincode}
            </p>
            <p className="text-xs text-stone-500 mt-2">Phone: +91 {order.address?.phone}</p>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-400">Delivery assistance needed?</span>
            <Link to="/contact" className="text-orange-600 hover:underline font-semibold flex items-center gap-1">
              <PhoneCall size={12} /> Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}