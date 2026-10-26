import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, Search, HelpCircle, PhoneCall } from 'lucide-react'
import { FAQS } from '../data'
import { Button } from '../components/ui'

const EXTENDED_FAQS = [
  ...FAQS,
  {
    q: 'Can acrylic frames withstand pooja room agarbatti (incense) and camphor smoke?',
    a: 'Yes, absolutely. Unlike conventional paper or wood frames which absorb smoke and discolor over time, our 5mm cast acrylic has a non-porous glossy surface. Any soot or ash residue can be easily wiped away with a damp microfiber cloth without degrading the UV print underneath.'
  },
  {
    q: 'How are the frames packaged to prevent cracking during courier transit?',
    a: 'Every Bhakthi Printings frame is enveloped in scratch-proof film, protected with high-density EPE foam corner guards, and enclosed in a rigid shock-absorbent corrugated wooden-support shipping box. We maintain a 99.8% safe delivery record pan-India.'
  },
  {
    q: 'Do you offer custom photos of family kuladeivam (ancestral deity)?',
    a: 'Yes! We specialize in custom high-resolution photo restoration and acrylic framing for personal deities, gurus, and family temples. Contact our support via WhatsApp with your image to receive a free digital proof and custom quote.'
  }
]

export default function FaqPage() {
  const [search, setSearch] = useState('')
  const [openIndex, setOpenIndex] = useState(0)

  const filtered = EXTENDED_FAQS.filter(item =>
    item.q.toLowerCase().includes(search.toLowerCase()) ||
    item.a.toLowerCase().includes(search.toLowerCase())
  )

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
          Got Questions?
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-1">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-stone-500 mt-2">
          Everything you need to know about our devotional acrylic frames, quality standards, and delivery.
        </p>

        {/* Search Bar */}
        <div className="relative mt-6 max-w-md mx-auto">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions (e.g. material, delivery, pooja, sizes)..."
            className="w-full pl-10 pr-4 py-3 text-sm border border-stone-200 rounded-xl outline-none focus:border-orange-500 shadow-xs bg-white"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-stone-400 bg-white rounded-2xl border border-stone-200">
            No questions matched "{search}". Please try another keyword.
          </div>
        ) : (
          filtered.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-amber-50/30 transition-colors"
                >
                  <span className="font-semibold text-stone-900 text-sm sm:text-base flex items-center gap-2.5">
                    <HelpCircle size={18} className="text-orange-600 flex-shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-orange-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-stone-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3 bg-amber-50/10">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Still Have Questions Box */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 sm:p-8 border border-amber-200/60 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <h3 className="font-bold text-stone-900 text-lg">Still have questions?</h3>
          <p className="text-xs text-stone-600 mt-1">
            Our devotional art consultants are available Monday to Saturday to assist your sacred purchase.
          </p>
        </div>
        <Link to="/contact" className="flex-shrink-0">
          <Button className="gap-2">
            <PhoneCall size={16} /> Contact Support
          </Button>
        </Link>
      </div>
    </div>
  )
}
