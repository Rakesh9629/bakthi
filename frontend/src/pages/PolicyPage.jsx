import { useLocation, Link } from 'react-router-dom'
import { Truck, RotateCcw, ShieldCheck, FileText } from 'lucide-react'
import { BUSINESS_CONFIG } from '../config/business'

export default function PolicyPage() {
  const location = useLocation()
  const path = location.pathname.replace('/', '')

  const tabs = [
    { id: 'shipping', label: 'Shipping Policy', icon: Truck, path: '/shipping' },
    { id: 'refund', label: 'Refund & Returns', icon: RotateCcw, path: '/refund' },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck, path: '/privacy' },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText, path: '/terms' },
  ]

  const activeTab = tabs.find(t => t.id === path) || tabs[0]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Policy Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = tab.id === activeTab.id
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* Policy Content Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200/80 shadow-xs leading-relaxed text-sm text-stone-700 space-y-6">
        {activeTab.id === 'shipping' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2">
                Shipping & Delivery Policy
              </h1>
              <p className="text-xs text-stone-400">Last updated: October 2026</p>
            </div>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-stone-900">1. Pan-India Delivery Coverage</h3>
              <p>
                Bakthi delivers premium acrylic devotional photo frames to all pincodes across India, including metro cities, Tier-2, Tier-3 towns, and remote rural taluks serviced by our logistics partners (Delhivery, BlueDart, DTDC, and India Post).
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-stone-900">2. Free Shipping Threshold</h3>
              <p>
                We offer <strong>Free Standard Shipping on all orders above ₹999</strong>. For orders below ₹999, a nominal flat shipping charge of ₹99 is applied at checkout to cover protective packaging.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-stone-900">3. Processing & Crafting Timelines</h3>
              <p>
                Because each frame undergoes high-precision laser trimming and UV pigment curing:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
                <li>Standard Catalog Frames: Handcrafted and dispatched within 1–2 business days.</li>
                <li>Custom Size / Ancestral Deity Frames: Prepared within 2–3 business days following digital proof approval.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-stone-900">4. Transit Durations</h3>
              <p>
                South India (Chennai, Bangalore, Hyderabad, Kochi): 2–4 business days.<br />
                West & North India (Mumbai, Delhi NCR, Pune, Ahmedabad): 3–5 business days.<br />
                East & North East: 5–7 business days.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-stone-900">5. 100% Breakage-Proof Transit Guarantee</h3>
              <p>
                All acrylic frames are encased in protective peel-off film, reinforced with dense EPE corner bumpers, and placed in multi-wall shockproof wooden corrugated cases. In the rare event of transit damage, we provide immediate free replacement.
              </p>
            </section>
          </div>
        )}

        {activeTab.id === 'refund' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2">
                Refund & Return Policy
              </h1>
              <p className="text-xs text-stone-400">Last updated: October 2026</p>
            </div>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-stone-900">1. 7-Day Hassle-Free Replacement</h3>
              <p>
                Your sacred satisfaction is our highest devotion. If your frame arrives damaged in transit, shows printing flaws, or has manufacturing imperfections, we offer a <strong>100% free replacement or refund</strong> within 7 days of package delivery.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-stone-900">2. How to Claim a Replacement</h3>
              <ol className="list-decimal pl-5 space-y-1 text-xs text-stone-600">
                <li>Take 2–3 clear photographs or a short video showing the damaged frame and shipping box label.</li>
                <li>WhatsApp us at <strong>+91 {BUSINESS_CONFIG.phone}</strong> or email <strong>{BUSINESS_CONFIG.email}</strong> with your Order ID.</li>
                <li>Our devotional customer care team will dispatch a brand-new replacement within 24 hours at zero additional cost.</li>
              </ol>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-stone-900">3. Refund Timelines</h3>
              <p>
                If a refund is preferred over a replacement, the full invoice amount will be credited back to your original payment method (UPI / Debit Card / Net Banking) within 4–7 working days after verification.
              </p>
            </section>
          </div>
        )}

        {activeTab.id === 'privacy' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2">
                Privacy Policy
              </h1>
              <p className="text-xs text-stone-400">Last updated: October 2026</p>
            </div>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-stone-900">1. Information We Collect</h3>
              <p>
                We only collect necessary personal details required to deliver your devotional artwork: customer name, shipping address, contact phone number, email address, and order selections.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-stone-900">2. Payment Security</h3>
              <p>
                We do not store your credit card, debit card, or UPI PIN numbers. All payment transactions are encrypted using 256-bit SSL encryption through PCI-DSS certified Indian payment gateways (Razorpay, Cashfree).
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-stone-900">3. Zero Spam / No Third-Party Selling</h3>
              <p>
                We will never sell, rent, or trade your personal information to third-party advertisers. Your phone number is strictly used for order updates and courier dispatch notifications via SMS or WhatsApp.
              </p>
            </section>
          </div>
        )}

        {activeTab.id === 'terms' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2">
                Terms & Conditions of Service
              </h1>
              <p className="text-xs text-stone-400">Last updated: October 2026</p>
            </div>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-stone-900">1. Agreement to Terms</h3>
              <p>
                By placing an order on Bhakthi Printings, you agree to comply with and be bound by these Terms and Conditions.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-stone-900">2. Sacred Devotional Reverence</h3>
              <p>
                All framed deity artworks are created with profound respect for Hindu spiritual traditions. We recommend placing your frame in a clean, elevated pooja altar, mandir, living room wall, or study area.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-stone-900">3. Intellectual Property</h3>
              <p>
                All graphical representations, custom deity typography, and product photography are proprietary to Bhakthi Printings.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
