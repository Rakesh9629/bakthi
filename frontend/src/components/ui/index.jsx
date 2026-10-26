import { clsx } from 'clsx'
import { Loader2, Star } from 'lucide-react'

// ── Button ──────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', className, loading, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer'
  const variants = {
    primary: 'bg-red-900 hover:bg-red-950 text-white shadow-sm hover:shadow-md',
    gold: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-sm',
    secondary: 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200/80',
    outline: 'border border-red-900/80 text-red-950 hover:bg-red-50',
    ghost: 'text-stone-700 hover:bg-amber-50 hover:text-red-900',
    danger: 'bg-rose-700 hover:bg-rose-800 text-white',
  }
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3 text-base' }
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}

// ── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-stone-100 text-stone-700',
    saffron: 'bg-orange-100 text-orange-700',
    gold: 'bg-amber-100 text-amber-800',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    sale: 'bg-red-600 text-white',
    new: 'bg-green-600 text-white',
    bestseller: 'bg-amber-500 text-white',
  }
  return <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold', variants[variant], className)}>{children}</span>
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className }) {
  return <div className={clsx('skeleton', className)} />
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <Skeleton className="w-full h-56" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  )
}

// ── StarRating ────────────────────────────────────────────────────────────────
export function StarRating({ rating, count, size = 14 }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(s => (
          <Star key={s} size={size} className={s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'} />
        ))}
      </div>
      {count !== undefined && <span className="text-xs text-stone-500">({count})</span>}
    </div>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 24 }) {
  return <Loader2 size={size} className="animate-spin text-orange-600" />
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {icon && <div className="text-6xl mb-4">{icon}</div>}
      <h3 className="text-xl font-semibold text-stone-800 mb-2">{title}</h3>
      {description && <p className="text-stone-500 mb-6 max-w-sm">{description}</p>}
      {action}
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ label }) {
  if (!label) return <hr className="border-stone-200" />
  return (
    <div className="flex items-center gap-3">
      <hr className="flex-1 border-stone-200" />
      <span className="text-xs text-stone-400 font-medium">{label}</span>
      <hr className="flex-1 border-stone-200" />
    </div>
  )
}

// ── SectionTitle ──────────────────────────────────────────────────────────────
export function SectionTitle({ title, subtitle, center }) {
  return (
    <div className={clsx('mb-8', center && 'text-center')}>
      <h2 className="font-serif text-3xl font-semibold text-stone-900">{title}</h2>
      {subtitle && <p className="text-stone-500 mt-2">{subtitle}</p>}
    </div>
  )
}

// ── PriceDisplay ──────────────────────────────────────────────────────────────
export function PriceDisplay({ price, mrp, discount, size = 'md' }) {
  const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' }
  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={clsx('font-bold text-stone-900', sizes[size])}>₹{price.toLocaleString('en-IN')}</span>
      {mrp && mrp > price && <span className="text-stone-400 line-through text-sm">₹{mrp.toLocaleString('en-IN')}</span>}
      {discount > 0 && <Badge variant="sale">{discount}% OFF</Badge>}
    </div>
  )
}
