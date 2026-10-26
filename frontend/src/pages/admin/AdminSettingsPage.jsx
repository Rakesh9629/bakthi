import { useState } from 'react'
import { RefreshCw, Save, ShieldAlert } from 'lucide-react'
import { useStoreData } from '../../context/StoreDataContext'
import { Button } from '../../components/ui'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const { resetToDefault } = useStoreData()

  const [settings, setSettings] = useState({
    storeName: 'Bhakthi Printings',
    tagline: 'Premium Devotional Acrylic Frames',
    supportPhone: '+91 7373646180',
    supportEmail: 'bhakthiprintings@gmail.com',
    shippingThreshold: 999,
    standardShippingFee: 99,
    address: '21 North Street, Vadamamandur, Kallakurichi District, Tamil Nadu – 605702, India',
  })

  const handleSave = (e) => {
    e.preventDefault()
    toast.success('Store settings saved successfully!')
  }

  const handleReset = () => {
    if (window.confirm('Reset all demo products, categories, coupons and orders to original default state?')) {
      resetToDefault()
      toast.success('Demo data restored to defaults!')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-serif text-stone-900">Store Settings</h1>
        <p className="text-sm text-stone-500">Configure store metadata, contact coordinates, shipping policies, and data controls.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-6 space-y-5">
        <h3 className="font-semibold text-stone-800 text-sm border-b border-stone-100 pb-2">General Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Store Name</label>
            <input
              type="text"
              value={settings.storeName}
              onChange={e => setSettings({ ...settings, storeName: e.target.value })}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Store Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={e => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Support Phone</label>
            <input
              type="text"
              value={settings.supportPhone}
              onChange={e => setSettings({ ...settings, supportPhone: e.target.value })}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={e => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">Business Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={e => setSettings({ ...settings, address: e.target.value })}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <h3 className="font-semibold text-stone-800 text-sm border-b border-stone-100 pb-2 pt-4">Shipping Rules</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Free Shipping Threshold (₹)</label>
            <input
              type="number"
              value={settings.shippingThreshold}
              onChange={e => setSettings({ ...settings, shippingThreshold: Number(e.target.value) })}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Standard Shipping Fee (₹)</label>
            <input
              type="number"
              value={settings.standardShippingFee}
              onChange={e => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" className="gap-2">
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </form>

      {/* Danger Zone: Reset Data */}
      <div className="bg-rose-50/50 rounded-xl border border-rose-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-rose-900 text-sm flex items-center gap-2">
              <ShieldAlert size={18} /> Reset Demo Data
            </h3>
            <p className="text-xs text-rose-700 mt-1">
              Reset products, categories, demo orders, and reviews back to their factory demo defaults.
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={handleReset} className="gap-1.5 flex-shrink-0">
            <RefreshCw size={14} /> Reset All Demo Data
          </Button>
        </div>
      </div>
    </div>
  )
}