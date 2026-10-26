import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Mail, User, Phone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/account'
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    terms: true,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.terms) {
      toast.error('Please agree to terms & conditions')
      return
    }
    setLoading(true)
    const res = register(form.name, form.email, form.password)
    setLoading(false)
    if (res.ok) {
      toast.success('Registration successful! Welcome to Bakthi.')
      navigate(redirect)
    } else {
      toast.error(res.message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl font-serif mx-auto mb-3 shadow-md">
            B
          </div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Create Account</h1>
          <p className="text-xs text-stone-500 mt-1">Join the Bakthi family for divine home decor and blessings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Ramesh Kumar"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 rounded-lg outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="ramesh@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 rounded-lg outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="98765 43210"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 rounded-lg outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 rounded-lg outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs text-stone-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.terms}
              onChange={e => setForm({ ...form, terms: e.target.checked })}
              className="mt-0.5 rounded accent-orange-600"
            />
            <span>
              I agree to the{' '}
              <Link to="/terms" className="text-orange-600 underline">Terms of Service</Link> and{' '}
              <Link to="/privacy" className="text-orange-600 underline">Privacy Policy</Link>.
            </span>
          </label>

          <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
            Create Free Account
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-stone-100 text-center text-xs text-stone-500">
          Already have an account?{' '}
          <Link to={`/login${redirect ? `?redirect=${redirect}` : ''}`} className="text-orange-600 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
