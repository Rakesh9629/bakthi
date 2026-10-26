import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react'
import { BUSINESS_CONFIG } from '../../config/business'

function WhatsAppIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  )
}

function InstagramIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

function FacebookIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

function YoutubeIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#1c0809] text-stone-300 border-t border-amber-900/40 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand & Mission */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-950 to-amber-900 rounded-xl flex items-center justify-center text-amber-300 font-bold text-xl font-serif border border-amber-500/40 shadow-sm">
              🕉️
            </div>
            <div>
              <div className="font-serif text-xl font-bold text-white tracking-tight">
                {BUSINESS_CONFIG.name}
              </div>
              <div className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase">
                DIVINE ACRYLIC FRAMES
              </div>
            </div>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed mb-5">
            {BUSINESS_CONFIG.description}
          </p>
          <div className="flex gap-2.5">
            <a
              href={BUSINESS_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
              title="Chat on WhatsApp"
            >
              <WhatsAppIcon size={16} />
            </a>
            <a href="#" className="w-9 h-9 bg-stone-900/90 border border-stone-800 rounded-full flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors" title="Instagram">
              <InstagramIcon size={15} />
            </a>
            <a href="#" className="w-9 h-9 bg-stone-900/90 border border-stone-800 rounded-full flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors" title="Facebook">
              <FacebookIcon size={15} />
            </a>
            <a href="#" className="w-9 h-9 bg-stone-900/90 border border-stone-800 rounded-full flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors" title="YouTube">
              <YoutubeIcon size={15} />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-amber-200 font-serif font-bold text-base mb-4 tracking-wide">
            Sacred Collections
          </h4>
          <ul className="space-y-2.5 text-xs text-stone-300">
            {[
              ['/', 'Home'],
              ['/shop', 'All Divine Frames'],
              ['/shop?tag=bestseller', 'Bestselling Deity Frames'],
              ['/shop?tag=new', 'New Creations'],
              ['/about', 'About Bhakthi Printings'],
              ['/reviews', 'Devotee Reviews'],
              ['/track-order', 'Track Order Status'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span className="text-amber-600 text-xs">›</span> {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policies & Care (NO customer login / register / my account) */}
        <div>
          <h4 className="text-amber-200 font-serif font-bold text-base mb-4 tracking-wide">
            Customer Care & Policies
          </h4>
          <ul className="space-y-2.5 text-xs text-stone-300">
            {[
              ['/shipping', 'Shipping & Delivery Policy'],
              ['/refund', '7-Day Replacement & Refunds'],
              ['/privacy', 'Privacy & Data Protection'],
              ['/terms', 'Terms & Conditions'],
              ['/faq', 'Frequently Asked Questions'],
              ['/contact', 'Contact Support'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span className="text-amber-600 text-xs">›</span> {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-5 p-3 rounded-xl bg-amber-950/40 border border-amber-900/40">
            <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
              ✨ 100% Transit Safe
            </p>
            <p className="text-[11px] text-stone-400 mt-1 leading-normal">
              Reinforced multi-wall packaging with free replacement guarantee across all pin codes in India.
            </p>
          </div>
        </div>

        {/* Official Shop Address & Contact Info */}
        <div>
          <h4 className="text-amber-200 font-serif font-bold text-base mb-4 tracking-wide">
            Official Workshop & Helpline
          </h4>
          <ul className="space-y-3.5 text-xs">
            {/* Phone */}
            <li className="flex items-start gap-2.5">
              <Phone size={15} className="mt-0.5 text-amber-500 flex-shrink-0" />
              <div>
                <a
                  href={`tel:${BUSINESS_CONFIG.phone}`}
                  className="font-bold text-white hover:text-amber-400 transition-colors text-sm"
                >
                  {BUSINESS_CONFIG.phoneFormatted}
                </a>
                <span className="block text-stone-400 text-[11px] mt-0.5">
                  {BUSINESS_CONFIG.supportHours}
                </span>
                <a
                  href={BUSINESS_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold mt-1"
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            </li>

            {/* Email */}
            <li className="flex items-start gap-2.5">
              <Mail size={15} className="mt-0.5 text-amber-500 flex-shrink-0" />
              <div>
                <a
                  href={`mailto:${BUSINESS_CONFIG.email}`}
                  className="text-stone-300 hover:text-amber-400 transition-colors break-all font-medium"
                >
                  {BUSINESS_CONFIG.email}
                </a>
                <span className="block text-stone-500 text-[11px]">Official Business Inquiries</span>
              </div>
            </li>

            {/* Official Address */}
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 text-amber-500 flex-shrink-0" />
              <div>
                <span className="font-semibold text-white block">
                  {BUSINESS_CONFIG.address.businessName}
                </span>
                <address className="not-italic text-stone-300 leading-relaxed text-[11px] mt-0.5">
                  {BUSINESS_CONFIG.address.line1},<br />
                  {BUSINESS_CONFIG.address.line2},<br />
                  {BUSINESS_CONFIG.address.district},<br />
                  {BUSINESS_CONFIG.address.state} – {BUSINESS_CONFIG.address.pincode},<br />
                  {BUSINESS_CONFIG.address.country}.
                </address>
                <a
                  href={BUSINESS_CONFIG.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 text-[11px] font-semibold mt-1.5 hover:underline"
                >
                  View on Google Maps <ExternalLink size={11} />
                </a>
              </div>
            </li>
          </ul>

          <div className="mt-5 pt-4 border-t border-stone-800">
            <p className="text-[11px] text-stone-400 mb-2">Secure Pan-India Payment Methods</p>
            <div className="flex gap-1.5 flex-wrap">
              {['UPI', 'Google Pay', 'PhonePe', 'Paytm', 'Visa / RuPay', 'NetBanking', 'COD'].map(m => (
                <span key={m} className="px-2 py-0.5 bg-stone-900 border border-stone-800 text-stone-300 text-[10px] rounded font-medium">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-amber-900/30 py-4 px-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} {BUSINESS_CONFIG.name}. All rights reserved. Crafted with devotion in Tamil Nadu, India.
      </div>
    </footer>
  )
}
