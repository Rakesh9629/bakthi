import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui'
import { BUSINESS_CONFIG } from '../../config/business'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg('')

    try {
      const result = await login(username, password)
      if (result.ok) {
        toast.success('Admin authentication verified. Welcome!')
        navigate('/admin', { replace: true })
      } else {
        setErrorMsg(result.message || 'Invalid administrator credentials.')
        toast.error(result.message || 'Authentication failed.')
      }
    } catch {
      setErrorMsg('An unexpected error occurred during admin authentication.')
      toast.error('Authentication error.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-950 border border-stone-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-red-800 text-white shadow-lg mb-2">
            <span className="font-serif text-2xl font-bold">🕉️</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
            {BUSINESS_CONFIG.name}
          </h1>
          <p className="text-xs text-stone-400">
            Administrative Management Portal
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-950/40 border border-rose-800/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Admin Username
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            loading={submitting}
            className="w-full justify-center bg-gradient-to-r from-amber-600 to-red-800 hover:from-amber-700 hover:to-red-900 text-white font-semibold py-3 rounded-xl gap-2 mt-2 shadow-lg"
          >
            <span>Authenticate Session</span>
            <ArrowRight size={16} />
          </Button>
        </form>

        <div className="pt-4 border-t border-stone-900/80 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-stone-500">
            <ShieldCheck size={14} className="text-amber-500" />
            <span>Authorized access only. Public registration is disabled.</span>
          </div>
          <p className="text-[11px] text-stone-600">
            Default credentials: <code className="bg-stone-900 px-1 py-0.5 rounded text-amber-400">admin</code> / <code className="bg-stone-900 px-1 py-0.5 rounded text-amber-400">admin123</code>
          </p>
        </div>
      </div>
    </div>
  )
}

