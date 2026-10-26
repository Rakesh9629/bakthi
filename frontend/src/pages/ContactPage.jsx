import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui'
import { BUSINESS_CONFIG } from '../config/business'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Custom Frame Request',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmissionResult(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          subject: form.subject,
          message: form.message.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to submit enquiry. Please try again.')
      }

      setSubmissionResult({
        success: true,
        message: data.message,
        emailDelivered: data.email_delivered,
      })
      toast.success('Your devotional inquiry has been received!')
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: 'Custom Frame Request',
        message: '',
      })
    } catch (err) {
      console.error('Contact submission error:', err)
      const errorMsg = err.message || 'Could not send message. Please reach us directly on WhatsApp or phone.'
      setSubmissionResult({
        success: false,
        message: errorMsg,
      })
      toast.error(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
      {/* Devotional Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-semibold">
          <span>🕉️</span>
          <span>We Are Here To Assist You</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
          Contact {BUSINESS_CONFIG.name}
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Reach our studio for custom deity framing, specific pooja altar dimensions, temple trust orders, or order status support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-amber-200/60 shadow-xs space-y-5">
            <h2 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Official Studio Contacts
            </h2>

            <div className="space-y-5 text-sm">
              {/* Phone & WhatsApp */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-stone-900">Customer Helpline</p>
                  <a
                    href={`tel:${BUSINESS_CONFIG.phone}`}
                    className="text-stone-700 hover:text-amber-800 font-medium block"
                  >
                    +91 {BUSINESS_CONFIG.phone}
                  </a>
                  <a
                    href={BUSINESS_CONFIG.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors mt-1"
                  >
                    <MessageCircle size={14} />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Official Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-stone-900">Official Business Email</p>
                  <a
                    href={`mailto:${BUSINESS_CONFIG.email}`}
                    className="text-amber-900 hover:underline font-medium break-all block"
                  >
                    {BUSINESS_CONFIG.email}
                  </a>
                  <p className="text-[11px] text-stone-500">Inquiries answered within 2 to 4 business hours.</p>
                </div>
              </div>

              {/* Official Physical Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-stone-900">Studio & Workshop Address</p>
                  <div className="text-xs text-stone-600 leading-relaxed">
                    <p className="font-medium text-stone-800">{BUSINESS_CONFIG.address.line1}</p>
                    <p>{BUSINESS_CONFIG.address.line2}</p>
                    <p>{BUSINESS_CONFIG.address.district}</p>
                    <p>{BUSINESS_CONFIG.address.state} – {BUSINESS_CONFIG.address.pincode}</p>
                    <p>{BUSINESS_CONFIG.address.country}</p>
                  </div>
                  <a
                    href={BUSINESS_CONFIG.address.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 hover:underline mt-1.5"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Timings */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <Clock size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-stone-900">Working Hours</p>
                  <p className="text-xs text-stone-600">{BUSINESS_CONFIG.workingHours}</p>
                  <p className="text-xs text-stone-500">Sunday: Dedicated to sacred dispatch preparation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl p-5 border border-amber-200">
            <h3 className="font-serif font-bold text-amber-950 text-sm mb-1.5">Custom Sizing or Pooja Altar Proofs?</h3>
            <p className="text-xs text-amber-900/80 leading-relaxed mb-3">
              Share high-resolution deity photos or specific wall dimensions directly with our senior framing artist on WhatsApp.
            </p>
            <a
              href={BUSINESS_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline"
            >
              <span>Instant WhatsApp Discussion</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Contact Form (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/60 shadow-xs">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-serif text-stone-900 mb-1">Send a Message</h2>
            <p className="text-xs text-stone-600">
              Submitted messages are delivered directly to <span className="font-semibold text-stone-800">{BUSINESS_CONFIG.email}</span> and recorded into our customer enquiry system.
            </p>
          </div>

          {submissionResult && (
            <div
              className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
                submissionResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {submissionResult.success ? (
                <CheckCircle size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-1">
                <p className="font-semibold">
                  {submissionResult.success ? 'Message Submitted Successfully' : 'Submission Alert'}
                </p>
                <p className="leading-relaxed">{submissionResult.message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 bg-stone-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. ramesh@example.com"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 bg-stone-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contact Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={`e.g. ${BUSINESS_CONFIG.phone}`}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 bg-stone-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Enquiry Subject
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 bg-stone-50/50 focus:bg-white"
                >
                  <option value="Custom Frame Request">Custom Acrylic Frame (Personal Deity/Photo)</option>
                  <option value="Order Tracking / Delivery">Order Status & Courier Tracking</option>
                  <option value="Temple / Bulk Order">Temple Trust / Mandir Bulk Order</option>
                  <option value="Damage / Replacement Inquiry">Transit Damage or Replacement</option>
                  <option value="General Inquiry">General Product Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Message / Details <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Please describe your requirements, preferred acrylic frame size (e.g., 12x18 in, 24x36 in), deity preference, or specific questions..."
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Button
                type="submit"
                size="lg"
                loading={submitting}
                className="gap-2 bg-gradient-to-r from-red-800 to-amber-700 text-amber-50 hover:from-red-900 hover:to-amber-800"
              >
                <Send size={16} />
                <span>Submit Message</span>
              </Button>

              <p className="text-xs text-stone-500 flex items-center gap-1.5">
                <span>🔒</span>
                <span>Submissions are strictly private and never shared.</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
