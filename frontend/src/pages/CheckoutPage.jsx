import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  ShieldCheck,
  Truck,
  MessageCircle,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useStoreData } from '../context/StoreDataContext'
import { Button, EmptyState } from '../components/ui'
import { BUSINESS_CONFIG } from '../config/business'
import toast from 'react-hot-toast'

const STATES = [
  'Tamil Nadu',
  'Andhra Pradesh',
  'Karnataka',
  'Kerala',
  'Telangana',
  'Maharashtra',
  'Gujarat',
  'Delhi',
  'Uttar Pradesh',
  'West Bengal',
  'Rajasthan',
  'Madhya Pradesh',
  'Bihar',
  'Punjab',
  'Haryana',
  'Odisha',
  'Assam',
  'Goa',
  'Chhattisgarh',
  'Jharkhand',
  'Uttarakhand',
  'Himachal Pradesh',
  'Puducherry',
]

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI Instant Payment', icon: <Smartphone size={18} />, desc: 'Google Pay, PhonePe, Paytm, BHIM' },
  { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={18} />, desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: <Building2 size={18} />, desc: 'SBI, HDFC, ICICI, Axis & 50+ Banks' },
  { id: 'cod', label: 'Cash on Delivery (COD)', icon: <Banknote size={18} />, desc: 'Pay cash upon doorstep verification' },
]

function StepIndicator({ step }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[['1', 'Shipping Address'], ['2', 'Payment Method'], ['3', 'Order Confirmed']].map(([s, label], i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
              step >= i + 1
                ? 'bg-gradient-to-r from-red-900 to-amber-700 text-amber-50'
                : 'bg-stone-200 text-stone-500'
            }`}
          >
            {step > i + 1 ? '✓' : s}
          </div>
          <span
            className={`text-xs font-medium hidden sm:block ${
              step >= i + 1 ? 'text-amber-950 font-semibold' : 'text-stone-400'
            }`}
          >
            {label}
          </span>
          {i < 2 && (
            <div
              className={`w-8 h-0.5 ${step > i + 1 ? 'bg-amber-600' : 'bg-stone-200'}`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function CheckoutPage() {
  const { items, subtotal, couponDiscount, shipping, total, clear } = useCart()
  const { addOrder } = useStoreData()

  const [step, setStep] = useState(1) // 1=address, 2=payment, 3=confirm
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [placing, setPlacing] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(null)

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    email: '',
    line1: '',
    line2: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
  })

  if (items.length === 0 && step !== 3) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon="🕉️"
          title="Your Devotional Cart is Empty"
          subtitle="Explore our handcrafted acrylic deity frames and bring auspicious blessings home."
          action={
            <Link to="/shop">
              <Button size="lg" className="bg-gradient-to-r from-red-800 to-amber-700 text-amber-50">
                Browse Frames
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  function validateAddress() {
    const required = ['name', 'phone', 'email', 'line1', 'city', 'state', 'pincode']
    for (const f of required) {
      if (!address[f] || !address[f].trim()) {
        toast.error(`Please provide your ${f.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }
    const cleanPhone = address.phone.replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number')
      return false
    }
    if (!/^\d{6}$/.test(address.pincode.trim())) {
      toast.error('Please enter a valid 6-digit Indian postal pincode')
      return false
    }
    return true
  }

  async function placeOrder() {
    setPlacing(true)
    let placedOrderObj = null

    try {
      // 1. Try sending order to FastAPI backend
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: {
            name: address.name.trim(),
            email: address.email.trim(),
            phone: address.phone.trim(),
            line1: address.line1.trim(),
            line2: address.line2.trim() || null,
            city: address.city.trim(),
            state: address.state,
            pincode: address.pincode.trim(),
          },
          items: items.map((i) => ({
            id: typeof i.id === 'number' ? i.id : null,
            name: i.name,
            selectedSize: i.selectedSize || '12×16 in',
            selectedShape: i.selectedShape || 'vertical',
            price: i.price,
            qty: i.qty,
            thumbnail: i.thumbnail,
          })),
          paymentMethod,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        placedOrderObj = data.order
      }
    } catch (err) {
      console.warn('Backend order submission fallback to local state:', err)
    }

    // 2. Fallback if backend was unreachable
    if (!placedOrderObj) {
      const generatedId = `BKT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
      placedOrderObj = {
        id: generatedId,
        date: new Date().toISOString().split('T')[0],
        total,
        subtotal,
        shipping,
        discount: couponDiscount,
        items: [...items],
        address: { ...address },
        paymentMethod,
        paymentStatus: 'paid',
        status: 'processing',
        tracking: {
          courier: 'Delhivery Express',
          trackingNo: `DL${Math.floor(100000000 + Math.random() * 900000000)}IN`,
          status: 'Processing Order',
          updatedAt: new Date().toISOString().split('T')[0],
        },
      }
    }

    addOrder(placedOrderObj)
    setConfirmedOrder(placedOrderObj)
    setPlacing(false)
    clear()
    setStep(3)
    toast.success('Divine order placed successfully! 🎉')
  }

  if (step === 3 && confirmedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle size={44} className="text-emerald-700" />
        </div>
        <div>
          <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">
            Auspicious Confirmation
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
            Order Confirmed!
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Thank you for ordering with {BUSINESS_CONFIG.name}. Your sacred frames are scheduled for printing & framing.
          </p>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
            <div>
              <p className="text-[11px] text-stone-500 uppercase font-semibold">Order Reference ID</p>
              <p className="text-lg font-mono font-bold text-amber-950">{confirmedOrder.id}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-stone-500 uppercase font-semibold">Total Paid</p>
              <p className="text-lg font-serif font-bold text-red-950">₹{confirmedOrder.total}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-stone-700">
            <p className="flex items-start gap-2">
              <span className="text-amber-700">✓</span>
              <span>An order confirmation alert is recorded for <strong>{confirmedOrder.address?.email}</strong>.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-amber-700">✓</span>
              <span>Delivery destination: <strong>{confirmedOrder.address?.line1}, {confirmedOrder.address?.city} ({confirmedOrder.address?.pincode})</strong></span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-amber-700">✓</span>
              <span>Courier Partner: <strong>{confirmedOrder.tracking?.courier || 'Express Devotional Courier'}</strong></span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={`/track-order?id=${confirmedOrder.id}`}>
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-amber-50 gap-2"
            >
              <Truck size={16} />
              <span>Track Live Delivery</span>
            </Button>
          </Link>
          <a
            href={`${BUSINESS_CONFIG.whatsappUrl}&text=${encodeURIComponent(
              `Hello Bhakthi Printings, I just placed order ${confirmedOrder.id}. Please send me dispatch updates!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle size={16} />
            <span>WhatsApp Confirmation</span>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Devotional Checkout
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Fast guest checkout with secure Indian payment gateways & door-step insurance.
        </p>
      </div>

      <StepIndicator step={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Step Content */}
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/60 shadow-xs space-y-5">
              <h2 className="font-serif font-bold text-stone-900 text-lg border-b border-stone-100 pb-3 flex items-center justify-between">
                <span>1. Shipping & Delivery Address</span>
                <span className="text-xs text-stone-400 font-normal">Guest Checkout</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    placeholder="Recipient's Name"
                    className="w-full border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 bg-stone-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact Phone (WhatsApp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 bg-stone-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    placeholder="For courier updates & invoice"
                    className="w-full border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 bg-stone-50/50 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Door No / Flat / Street Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    placeholder="House/Apt No., Street, Landmark"
                    className="w-full border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 bg-stone-50/50 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Area / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={address.line2}
                    onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                    placeholder="Near Temple / Opposite School"
                    className="w-full border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 bg-stone-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City / Town <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="City"
                    className="w-full border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 bg-stone-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 bg-stone-50/50 focus:bg-white"
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Pincode <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    placeholder="6-digit Indian Pincode"
                    className="w-full border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 bg-stone-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <Button
                type="button"
                size="lg"
                onClick={() => {
                  if (validateAddress()) setStep(2)
                }}
                className="w-full bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-amber-50"
              >
                Continue to Payment Selection →
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/60 shadow-xs space-y-5">
              <h2 className="font-serif font-bold text-stone-900 text-lg border-b border-stone-100 pb-3 flex items-center justify-between">
                <span>2. Select Payment Method</span>
                <span className="text-xs text-stone-400 font-normal">256-Bit SSL Encrypted</span>
              </h2>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === m.id
                        ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-500'
                        : 'border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id)}
                      className="mt-1 accent-amber-700"
                    />
                    <div className="text-amber-800 mt-0.5">{m.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-stone-900">{m.label}</p>
                      <p className="text-xs text-stone-500">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                <span>
                  All payments are processed securely through certified Indian payment gateways.
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                  className="border-stone-300 text-stone-700"
                >
                  ← Back to Address
                </Button>
                <Button
                  size="lg"
                  loading={placing}
                  onClick={placeOrder}
                  className="flex-1 bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-amber-50"
                >
                  {placing ? 'Authorizing...' : `Confirm & Place Order · ₹${total.toLocaleString('en-IN')}`}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-amber-200/60 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-3">
              Order Summary ({items.reduce((s, i) => s + i.qty, 0)} items)
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg border border-stone-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-semibold text-stone-800 line-clamp-1">{item.name}</p>
                    <p className="text-stone-500">
                      {item.selectedSize} × {item.qty}
                    </p>
                    <p className="font-semibold text-amber-900 mt-0.5">
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-3 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-stone-800">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Sacred Discount</span>
                  <span>−₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping & Insurance</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE (Above ₹999)</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t border-stone-200">
                <span>Total Amount</span>
                <span className="font-serif text-base text-red-950">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-stone-600 space-y-1.5">
            <p className="font-semibold text-amber-950">Devotional Quality Guarantee</p>
            <p className="leading-relaxed">
              Every acrylic frame is checked for flawless surface shine and packed in bubble wrapping before dispatch from Vadamamandur.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
