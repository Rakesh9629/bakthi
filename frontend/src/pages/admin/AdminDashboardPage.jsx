import { Link } from 'react-router-dom'
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowUpRight,
  PlusCircle,
  Truck,
  IndianRupee,
  Layers,
  ArrowRight,
  Mail
} from 'lucide-react'
import { useStoreData } from '../../context/StoreDataContext'
import { Badge, Button } from '../../components/ui'

export default function AdminDashboardPage() {
  const { products, orders, categories } = useStoreData()

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const totalOrders = orders.length
  const totalProducts = products.length
  const lowStockProducts = products.filter(p => p.stock < 15)

  // Status counters
  const processingCount = orders.filter(o => o.status === 'processing').length
  const shippedCount = orders.filter(o => o.status === 'shipped').length
  const deliveredCount = orders.filter(o => o.status === 'delivered').length

  const recentOrders = [...orders].slice(0, 5)

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      change: '+18.2% from last month',
      icon: IndianRupee,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      change: `${processingCount} processing`,
      icon: ShoppingBag,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50 text-orange-700',
    },
    {
      title: 'Live Products',
      value: totalProducts,
      change: `${categories.length} categories`,
      icon: Package,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Low Stock Items',
      value: lowStockProducts.length,
      change: lowStockProducts.length > 0 ? 'Requires attention' : 'Inventory healthy',
      icon: AlertTriangle,
      color: 'bg-rose-500',
      lightColor: lowStockProducts.length > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700',
    },
  ]

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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Admin Overview</h1>
          <p className="text-sm text-stone-500">Welcome to your Bhakthi Printings management portal.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/products?action=new">
            <Button size="sm" className="gap-1.5 shadow-sm">
              <PlusCircle size={16} /> Add Product
            </Button>
          </Link>
          <Link to="/" target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5">
              Live Storefront <ArrowUpRight size={14} />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-stone-500">{s.title}</span>
                <div className={`p-2 rounded-lg ${s.lightColor}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="text-2xl font-bold text-stone-900">{s.value}</div>
              <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-500" />
                {s.change}
              </p>
            </div>
          )
        })}
      </div>

      {/* Order Status Quick Bar */}
      <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="border-r border-stone-100 last:border-none pr-4">
          <p className="text-xs text-stone-500">Processing Orders</p>
          <p className="text-lg font-bold text-amber-600">{processingCount}</p>
        </div>
        <div className="border-r border-stone-100 last:border-none pr-4">
          <p className="text-xs text-stone-500">Shipped / In Transit</p>
          <p className="text-lg font-bold text-blue-600">{shippedCount}</p>
        </div>
        <div className="border-r border-stone-100 last:border-none pr-4">
          <p className="text-xs text-stone-500">Delivered</p>
          <p className="text-lg font-bold text-emerald-600">{deliveredCount}</p>
        </div>
        <div>
          <p className="text-xs text-stone-500">Pending Actions</p>
          <p className="text-lg font-bold text-stone-700">{lowStockProducts.length + processingCount}</p>
        </div>
      </div>

      {/* Grid: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-semibold text-stone-900 flex items-center gap-2">
              <ShoppingBag size={18} className="text-orange-600" /> Recent Orders
            </h2>
            <Link to="/admin/orders" className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
              View All Orders <ArrowRight size={13} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-stone-800">{order.id}</td>
                    <td className="py-3 px-4 text-stone-600">{order.address?.name || 'Customer'}</td>
                    <td className="py-3 px-4 text-stone-500">{order.items?.length || 1} frame(s)</td>
                    <td className="py-3 px-4 font-semibold text-stone-900">₹{order.total?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <Badge variant={statusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link to={`/admin/orders`} className="text-xs text-orange-600 hover:underline font-medium">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (1 col) */}
        <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs flex flex-col">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-semibold text-stone-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-500" /> Low Stock Alerts
            </h2>
            <Link to="/admin/inventory" className="text-xs font-semibold text-orange-600 hover:text-orange-700">
              Manage All
            </Link>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-3 max-h-96">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-sm">
                🎉 All products have healthy stock levels!
              </div>
            ) : (
              lowStockProducts.slice(0, 6).map(prod => (
                <div key={prod.id} className="flex items-center justify-between p-2.5 rounded-lg border border-rose-100 bg-rose-50/30">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={prod.thumbnail} alt={prod.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-stone-800 truncate">{prod.name}</p>
                      <p className="text-[11px] text-stone-400">{prod.sku}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-700">
                      {prod.stock} left
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-stone-100 bg-stone-50 rounded-b-xl">
            <Link to="/admin/inventory" className="block text-center text-xs font-semibold text-orange-600 hover:underline">
              Go to Inventory Manager →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/products" className="bg-white p-4 rounded-xl border border-stone-200/80 hover:border-orange-400 transition-colors shadow-xs group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <Package size={20} />
            </div>
            <div>
              <p className="font-semibold text-stone-800 text-sm">Manage Products</p>
              <p className="text-xs text-stone-400">Add, edit pricing, or toggle visibility</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/categories" className="bg-white p-4 rounded-xl border border-stone-200/80 hover:border-orange-400 transition-colors shadow-xs group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Layers size={20} />
            </div>
            <div>
              <p className="font-semibold text-stone-800 text-sm">Deity Categories</p>
              <p className="text-xs text-stone-400">Organize {categories.length} devotional categories</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/enquiries" className="bg-white p-4 rounded-xl border border-stone-200/80 hover:border-orange-400 transition-colors shadow-xs group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Mail size={20} />
            </div>
            <div>
              <p className="font-semibold text-stone-800 text-sm">Customer Inquiries</p>
              <p className="text-xs text-stone-400">Review Contact Us emails & messages</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/inventory" className="bg-white p-4 rounded-xl border border-stone-200/80 hover:border-orange-400 transition-colors shadow-xs group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Truck size={20} />
            </div>
            <div>
              <p className="font-semibold text-stone-800 text-sm">Stock & Inventory</p>
              <p className="text-xs text-stone-400">Restock acrylic frame variants & batches</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
