import { useState, useMemo } from 'react'
import {
  Search,
  Eye,
  Truck,
  MapPin,
  Phone,
  X
} from 'lucide-react'
import { useStoreData } from '../../context/StoreDataContext'
import { Badge, Button } from '../../components/ui'
import toast from 'react-hot-toast'

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, updateOrderTracking } = useStoreData()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [trackingModalOrder, setTrackingModalOrder] = useState(null)
  const [trackingForm, setTrackingForm] = useState({
    courier: 'Delhivery',
    trackingNo: '',
    status: 'In Transit',
  })

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.address?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.address?.phone?.includes(search) ||
        o.tracking?.trackingNo?.toLowerCase().includes(search.toLowerCase())

      const matchStatus = statusFilter === 'all' || o.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [orders, search, statusFilter])

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
    toast.success(`Order ${orderId} status changed to ${newStatus}`)
  }

  const handleOpenTracking = (order) => {
    setTrackingModalOrder(order)
    setTrackingForm({
      courier: order.tracking?.courier || 'Delhivery',
      trackingNo: order.tracking?.trackingNo || `DL${Math.floor(100000000 + Math.random() * 900000000)}IN`,
      status: order.tracking?.status || 'In Transit',
    })
  }

  const handleSaveTracking = (e) => {
    e.preventDefault()
    if (!trackingModalOrder) return
    updateOrderTracking(trackingModalOrder.id, trackingForm)
    // Also if status is marked delivered or shipped, sync
    if (trackingForm.status === 'Delivered') {
      updateOrderStatus(trackingModalOrder.id, 'delivered')
    } else if (trackingModalOrder.status === 'processing') {
      updateOrderStatus(trackingModalOrder.id, 'shipped')
    }
    toast.success('Tracking information updated')
    setTrackingModalOrder(null)
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-stone-900">Order Management</h1>
        <p className="text-sm text-stone-500">Track and fulfill customer orders, assign shipments, and view invoice details.</p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Orders', count: orders.length },
            { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
            { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
            { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
            { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === tab.id ? 'bg-orange-700' : 'bg-stone-200 text-stone-700'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search order ID, customer, phone..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-lg outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Items Ordered</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4">Shipment Tracking</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-stone-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                    {/* Order ID & Date */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-stone-900">{order.id}</p>
                      <p className="text-xs text-stone-400">{order.date}</p>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-stone-800">{order.address?.name || 'Customer'}</p>
                      <p className="text-xs text-stone-500">{order.address?.phone}</p>
                      <p className="text-[11px] text-stone-400 truncate max-w-[150px]">
                        {order.address?.city}, {order.address?.state}
                      </p>
                    </td>

                    {/* Items */}
                    <td className="py-3 px-4">
                      <div className="text-xs text-stone-700 space-y-0.5">
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="truncate max-w-[200px]">
                            {item.qty}x {item.name} <span className="text-stone-400">({item.selectedSize})</span>
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <p className="text-[11px] text-orange-600 font-medium">
                            +{order.items.length - 2} more item(s)
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">₹{order.total?.toLocaleString('en-IN')}</div>
                      <span className="text-[11px] uppercase font-semibold text-emerald-600">
                        {order.paymentStatus || 'paid'}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer outline-none ${
                          order.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : order.status === 'shipped'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : order.status === 'processing'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Tracking Info */}
                    <td className="py-3 px-4">
                      {order.tracking ? (
                        <div className="text-xs">
                          <p className="font-medium text-stone-800">{order.tracking.courier}</p>
                          <p className="text-stone-400 font-mono text-[11px]">{order.tracking.trackingNo}</p>
                          <button
                            onClick={() => handleOpenTracking(order)}
                            className="text-[11px] text-orange-600 hover:underline mt-0.5 block"
                          >
                            Update Tracking
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenTracking(order)}
                          className="inline-flex items-center gap-1 text-xs text-orange-600 hover:bg-orange-50 px-2 py-1 rounded border border-orange-200"
                        >
                          <Truck size={13} /> Add Tracking
                        </button>
                      )}
                    </td>

                    {/* View Details Modal Action */}
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="gap-1 text-xs"
                      >
                        <Eye size={14} /> View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-fade-in my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-bold font-serif text-stone-900">
                  Order #{selectedOrder.id}
                </h3>
                <p className="text-xs text-stone-400">Placed on {selectedOrder.date}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 pt-4 text-sm">
              {/* Status and Summary Header */}
              <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div>
                  <span className="text-xs text-stone-500 block">Current Status</span>
                  <Badge variant={statusBadgeVariant(selectedOrder.status)} className="mt-0.5">
                    {selectedOrder.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500 block">Payment</span>
                  <span className="text-xs font-bold text-emerald-600 uppercase">
                    {selectedOrder.paymentStatus || 'Paid (Online / UPI)'}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-semibold text-stone-800 mb-3 text-xs uppercase tracking-wider text-stone-500">
                  Purchased Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="space-y-3 divide-y divide-stone-100">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 pt-3 first:pt-0">
                      <img
                        src={item.thumbnail || 'https://picsum.photos/seed/product/100/100'}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover border border-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-900 truncate">{item.name}</p>
                        <p className="text-xs text-stone-400">
                          Size: {item.selectedSize} {item.selectedShape ? `• ${item.selectedShape}` : ''} • Qty: {item.qty}
                        </p>
                      </div>
                      <div className="text-right font-semibold text-stone-900">
                        ₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                <h4 className="font-semibold text-stone-800 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-800">
                  <MapPin size={14} /> Delivery Address
                </h4>
                <p className="font-semibold text-stone-900">{selectedOrder.address?.name}</p>
                <p className="text-xs text-stone-600">{selectedOrder.address?.line1}</p>
                {selectedOrder.address?.line2 && (
                  <p className="text-xs text-stone-600">{selectedOrder.address?.line2}</p>
                )}
                <p className="text-xs text-stone-600">
                  {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}
                </p>
                <p className="text-xs text-stone-700 mt-2 flex items-center gap-1 font-medium">
                  <Phone size={13} className="text-stone-400" /> {selectedOrder.address?.phone}
                </p>
              </div>

              {/* Price Calculation breakdown */}
              <div className="border-t border-stone-100 pt-3 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.total?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="text-emerald-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Paid</span>
                  <span>₹{selectedOrder.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="text-lg font-bold font-serif text-stone-900">
                Update Shipping Tracking
              </h3>
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="space-y-4 pt-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Courier Partner
                </label>
                <select
                  value={trackingForm.courier}
                  onChange={e => setTrackingForm({ ...trackingForm, courier: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 bg-white"
                >
                  <option value="Delhivery">Delhivery</option>
                  <option value="BlueDart">BlueDart</option>
                  <option value="DTDC">DTDC Express</option>
                  <option value="Ekart">Ekart Logistics</option>
                  <option value="India Post">India Post (Speed Post)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tracking / AWB Number *
                </label>
                <input
                  type="text"
                  required
                  value={trackingForm.trackingNo}
                  onChange={e => setTrackingForm({ ...trackingForm, trackingNo: e.target.value })}
                  placeholder="e.g. DL123456789IN"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tracking Milestone
                </label>
                <select
                  value={trackingForm.status}
                  onChange={e => setTrackingForm({ ...trackingForm, status: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 bg-white"
                >
                  <option value="Packed">Packed</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <Button type="button" variant="ghost" onClick={() => setTrackingModalOrder(null)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Tracking Info
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}