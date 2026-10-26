import { Link } from 'react-router-dom'
import { Sparkles, Shield, Heart, Award, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui'

export default function AboutPage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-950 via-stone-900 to-amber-950 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden text-center shadow-lg">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-semibold tracking-wider uppercase border border-amber-400/30">
              Our Devotional Journey
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold font-serif leading-tight">
              Crafting Sacred Spaces With Premium Acrylic Art
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              At Bhakthi Printings, we believe that bringing divine presence into your living room, pooja room, or workplace transforms energy and inspires calm devotion every day.
            </p>
          </div>
        </div>
      </div>

      {/* The Story & Craftsmanship */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              The Bhakthi Printings Story
            </span>
            <h2 className="text-3xl font-serif font-bold text-stone-900 leading-snug">
              From Traditional Pooja Mandirs to Modern Architectural Homes
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Based in Vadamamandur, Kallakurichi District, Tamil Nadu, Bhakthi Printings began with a single vision: delivering mastercrafted devotional acrylic frames with deep sacred reverence and museum-grade longevity.
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              We pioneered <strong>5mm Cast Acrylic Frames</strong> combined with advanced multi-layer UV curable inks. The result is a vibrant, scratch-resistant, water-resistant masterpiece that radiates lifelike warmth and stands true for decades.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="border-l-2 border-orange-500 pl-3">
                <p className="text-2xl font-bold text-stone-900 font-serif">10,000+</p>
                <p className="text-xs text-stone-500">Devotional Homes Blessed</p>
              </div>
              <div className="border-l-2 border-orange-500 pl-3">
                <p className="text-2xl font-bold text-stone-900 font-serif">100%</p>
                <p className="text-xs text-stone-500">Breakage-Proof Transit</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://picsum.photos/seed/bakthiabout/600/500"
              alt="Craftsmanship"
              className="rounded-2xl shadow-xl object-cover w-full aspect-[4/3]"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-stone-200 hidden sm:block max-w-xs">
              <p className="font-serif font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Award size={16} className="text-amber-500" /> Museum Grade Acrylic
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                Precision diamond-polished bevel edges with ready-to-hang sturdy brackets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-white py-14 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Why Devotees Choose Bhakthi Printings
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-2">
              Crafted with utmost reverence, engineered with modern industrial standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'Vivid UV HD Print',
                desc: 'Colors that never fade, capturing every ornament and subtle smile of deities.',
              },
              {
                icon: Shield,
                title: '5mm Thick Acrylic',
                desc: 'Solid shatterproof cast acrylic glass with high transparency and gloss.',
              },
              {
                icon: Heart,
                title: 'Pooja Room Safe',
                desc: 'Waterproof, incense smoke resistant, easily wipes clean with cloth.',
              },
              {
                icon: Award,
                title: 'Reinforced Packaging',
                desc: 'Foam corners and wooden case ensure pristine delivery across India.',
              },
            ].map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="p-6 rounded-2xl bg-amber-50/40 border border-amber-100 hover:border-orange-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-stone-900 text-base mb-1">{f.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-amber-100/70 border border-amber-200/80 rounded-2xl p-8 sm:p-10 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
            Bring Auspicious Blessings to Your Home
          </h2>
          <p className="text-stone-600 text-sm mb-6 max-w-md mx-auto">
            Explore our curated divine gallery including Ganesha, Krishna, Shiva, Murugan, Lakshmi, and Balaji.
          </p>
          <Link to="/shop">
            <Button size="lg" className="gap-2">
              Explore All Divine Frames <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}