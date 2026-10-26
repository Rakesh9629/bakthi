import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  ShoppingBag,
  Heart,
  Phone,
  Shield,
  ArrowRight,
  LogOut,
  Truck,
  Edit2,
  Check
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { useStoreData } from '../../context/StoreDataContext'
import { Button } from '../../components/ui'
import toast from 'react-hot-toast'

export default function AccountDashboardPage() {
  const { user, logout, isAdmin } = useAuth()
  const { count: wishCount } = useWishlist()
  const { orders } = useStoreData()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Customer',
    phone: user?.phone || '9876543210',
    address: '123 Temple Street, Mylapore, Chennai, Tamil Nadu - 600004',
  })

  // Customer orders (filter by demo or show all)
  const customerOrders = orders.filter(o => !user?.email || o.address?.email === user.email || true)
  const recentOrder = customerOrders[0]

  const handleSaveProfile = (e) => {
    e.preventDefault()
    setIsEditing(false)
    toast.success('Profile details updated!')
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-700 text-white rounded-2xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl font-serif font-bold text-white border-2 border-white/40">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'B'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold">{user?.name || 'Devotee'}</h1>
              {isAdmin && (
                <span className="bg-amber-400 text-stone-900 text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                  Admin
                </span>
              )}
            </div>
            <p className="text-white/80 text-sm mt-0.5">{user?.email || 'demo@bakthi.in'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {isAdmin && (
            <Link to="/admin">
              <Button variant="secondary" size="sm" className="bg-white text-orange-800 border-none hover:bg-orange-50 font-bold">
                <Shield size={16} /> Open Admin Dashboard
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link to="/account/orders" className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-orange-400 transition-colors group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Total Orders</span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">{customerOrders.length}</div>
          <span className="text-xs text-orange-600 flex items-center gap-1 mt-1 font-medium">
            View Order History <ArrowRight size={12} />
          </span>
        </Link>

        <Link to="/wishlist" className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-orange-400 transition-colors group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Wishlist Items</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
              <Heart size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">{wishCount}</div>
          <span className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
            View Saved Frames <ArrowRight size={12} />
          </span>
        </Link>

        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Active Shipments</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Truck size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">
            {customerOrders.filter(o => o.status === 'shipped' || o.status === 'processing').length}
          </div>
          <span className="text-xs text-stone-400 mt-1 block">In preparation or in transit</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile and Saved Address (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <h2 className="font-semibold text-stone-900 flex items-center gap-2">
                <User size={18} className="text-orange-600" /> Account Profile Details
              </h2>
              <button
                onClick={() => setIsEditing(v => !v)}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                {isEditing ? 'Cancel' : <><Edit2 size={13} /> Edit Profile</>}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Default Delivery Address</label>
                  <textarea
                    rows="2"
                    value={profileData.address}
                    onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit" size="sm" className="gap-1.5"><Check size={14} /> Save Profile</Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-stone-400 block">Full Name</span>
                  <span className="font-medium text-stone-800">{profileData.name}</span>
                </div>
                <div>
                  <span className="text-xs text-stone-400 block">Email Address</span>
                  <span className="font-medium text-stone-800">{user?.email || 'demo@bakthi.in'}</span>
                </div>
                <div>
                  <span className="text-xs text-stone-400 block">Primary Contact Phone</span>
                  <span className="font-medium text-stone-800">+91 {profileData.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-stone-400 block">Primary Shipping Address</span>
                  <span className="font-medium text-stone-800 text-xs">{profileData.address}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Order Snapshot */}
          {recentOrder && (
            <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
                <div>
                  <h3 className="font-semibold text-stone-900">Most Recent Order</h3>
                  <p className="text-xs text-stone-400">Order ID: {recentOrder.id} • {recentOrder.date}</p>
                </div>
                <Link to={`/account/orders/${recentOrder.id}/track`}>
                  <Button size="sm" variant="outline" className="text-xs gap-1">
                    <Truck size={14} /> Track Order
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {recentOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={item.thumbnail || 'https://picsum.photos/seed/product/80/80'}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-stone-400">Size: {item.selectedSize} • Qty: {item.qty}</p>
                    </div>
                    <span className="text-xs font-bold text-stone-900">
                      ₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Links & Devotional Care (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5">
            <h3 className="font-semibold text-stone-900 text-sm mb-3">Quick Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/account/orders" className="flex items-center justify-between p-2 rounded-lg hover:bg-orange-50 text-stone-700 hover:text-orange-600 transition-colors">
                  <span className="flex items-center gap-2"><ShoppingBag size={16} /> My Orders</span>
                  <ArrowRight size={14} />
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="flex items-center justify-between p-2 rounded-lg hover:bg-orange-50 text-stone-700 hover:text-orange-600 transition-colors">
                  <span className="flex items-center gap-2"><Heart size={16} /> My Wishlist</span>
                  <ArrowRight size={14} />
                </Link>
              </li>
              <li>
                <Link to="/faq" className="flex items-center justify-between p-2 rounded-lg hover:bg-orange-50 text-stone-700 hover:text-orange-600 transition-colors">
                  <span className="flex items-center gap-2"><Shield size={16} /> FAQs & Care Guide</span>
                  <ArrowRight size={14} />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center justify-between p-2 rounded-lg hover:bg-orange-50 text-stone-700 hover:text-orange-600 transition-colors">
                  <span className="flex items-center gap-2"><Phone size={16} /> Customer Support</span>
                  <ArrowRight size={14} />
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-amber-100/60 to-orange-100/60 rounded-xl p-5 border border-amber-200/60 text-stone-800">
            <h4 className="font-serif font-bold text-amber-900 mb-2">🕉️ Frame Care Tips</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Clean your 5mm acrylic divine frame with a soft microfiber cloth and a drop of water. Never use harsh chemical abrasives or alcohol to preserve the glossy UV coating.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}