import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Ticket,
  Star,
  Mail,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AdminLoginPage from '../pages/admin/AdminLoginPage'
import { BUSINESS_CONFIG } from '../config/business'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/orders', label: 'Orders & Shipments', icon: ShoppingBag },
  { to: '/admin/products', label: 'Products & Frames', icon: Package },
  { to: '/admin/categories', label: 'Deity Categories', icon: Tag },
  { to: '/admin/enquiries', label: 'Customer Inquiries', icon: Mail },
  { to: '/admin/inventory', label: 'Inventory Stock', icon: BarChart2 },
  { to: '/admin/coupons', label: 'Coupons & Promos', icon: Ticket },
  { to: '/admin/reviews', label: 'Customer Reviews', icon: Star },
  { to: '/admin/settings', label: 'Store Settings', icon: Settings },
]

export default function AdminLayout() {
  const { user, logout, isAdmin } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Strict Admin Isolation: unauthenticated users at /admin see AdminLoginPage
  if (!isAdmin) {
    return <AdminLoginPage />
  }

  const isActive = (to, exact) =>
    exact ? location.pathname === to : location.pathname.startsWith(to)

  return (
    <div className="min-h-screen bg-stone-100 flex">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-stone-950 text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:flex border-r border-stone-800`}
      >
        <div className="flex items-center justify-between p-4 border-b border-stone-800/80">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-red-800 rounded-xl flex items-center justify-center text-white font-bold font-serif shadow-sm">
              🕉️
            </div>
            <div>
              <span className="font-serif font-bold text-white text-sm block leading-tight">
                {BUSINESS_CONFIG.name}
              </span>
              <span className="text-[10px] text-amber-400 font-sans tracking-wide">
                Admin Console
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-stone-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive(to, exact)
                  ? 'bg-gradient-to-r from-red-900 to-amber-700 text-amber-50 shadow-sm'
                  : 'text-stone-400 hover:bg-stone-900 hover:text-stone-100'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs">
              <p className="text-stone-200 font-medium">{user.name}</p>
              <p className="text-[11px] text-stone-500">{user.username}</p>
            </div>
            <Link
              to="/"
              target="_blank"
              title="Open storefront"
              className="text-stone-500 hover:text-amber-400 p-1.5 transition-colors"
            >
              <ExternalLink size={14} />
            </Link>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-xs py-2 px-3 rounded-lg bg-stone-900 hover:bg-red-950/60 text-stone-300 hover:text-red-400 transition-colors border border-stone-800"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-stone-600 hover:text-stone-900"
            >
              <Menu size={22} />
            </button>
            <span className="font-serif font-bold text-stone-900 text-sm">
              {BUSINESS_CONFIG.name} Admin
            </span>
          </div>
          <button
            onClick={logout}
            className="text-xs text-rose-600 font-medium hover:underline"
          >
            Sign Out
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
