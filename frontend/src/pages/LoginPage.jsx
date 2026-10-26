import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Mail, Shield, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/'
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    const res = login(email, password)
    setLoading(false)
    if (res.ok) {
      toast.success(`Welcome back, ${res.user.name}!`)
      if (res.user.role === 'admin' && redirect === '/') {
        navigate('/admin')
      } else {
        navigate(redirect)
      }
    } else {
      toast.error(res.message || 'Login failed')
    }
  }

  const handleQuickDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@bakthi.in')
      setPassword('admin123')
      const res = login('admin@bakthi.in', 'admin123')
      if (res.ok) {
        toast.success('Logged in as Administrator!')
        navigate('/admin')
      }
    } else {
      setEmail('demo@bakthi.in')
      setPassword('password123')
      const res = login('demo@bakthi.in', 'password123')
      if (res.ok) {
        toast.success('Logged in as Customer!')
        navigate(redirect === '/admin' ? '/account' : redirect)
      }
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-md">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl font-serif mx-auto mb-3 shadow-md">
            B
          </div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Welcome Back</h1>
          <p className="text-xs text-stone-500 mt-1">Sign in to manage your account or store orders</p>
        </div>

        {/* Quick Demo Login Switcher */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 mb-6">
          <p className="text-[11px] font-semibold text-amber-900 mb-2 flex items-center gap-1">
            ⚡ Quick Demo Sign-in:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Shield size={13} /> Admin Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <User size={13} /> Customer Demo
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 rounded-lg outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-stone-700">Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); toast('Password reset link sent to demo email') }} className="text-xs text-orange-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 rounded-lg outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
            Sign In to Bakthi
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-stone-100 text-center text-xs text-stone-500">
          Don't have an account yet?{' '}
          <Link to={`/register${redirect ? `?redirect=${redirect}` : ''}`} className="text-orange-600 font-semibold hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}