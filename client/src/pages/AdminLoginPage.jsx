import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, Lock, Mail, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/ui/Toast'
import api from '../lib/api'

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      const role = data.user?.profile?.role || data.user?.role
      if (role !== 'admin') {
        toast('Access denied. This portal is for administrators only.', 'error')
        return
      }
      login(data.user, data.token)
      toast('Welcome, Administrator!', 'success')
      navigate('/admin')
    } catch (err) {
      toast(err.response?.data?.error || 'Login failed. Check your credentials.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full bg-emerald-500/8 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="rounded-3xl border border-border/50 p-8 shadow-2xl" style={{ background: '#0d1117' }}>

          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-2xl card-gradient flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0d1117] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute" />
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Admin Portal</h1>
            <p className="text-text-muted text-sm mt-1">Restricted access — authorized personnel only</p>
          </div>

          {/* Warning notice */}
          <div className="flex items-start gap-2.5 p-3 mb-6 rounded-xl bg-amber-500/8 border border-amber-500/20">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-400/90 leading-relaxed">
              This is a secure admin login. All access attempts are logged. Non-admin accounts will be denied.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-primary">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  type="email"
                  placeholder="admin@smartedge.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/50 bg-surface text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-primary">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border/50 bg-surface text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl card-gradient text-white font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 shadow-lg mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/50">
            <Link to="/login" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              ← User Login
            </Link>
            <Link to="/" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Back to Home
            </Link>
          </div>
        </div>

        {/* Credentials hint box — remove in production */}
        <div className="mt-4 p-4 rounded-2xl border border-border/30 bg-surface/50 backdrop-blur-sm text-xs space-y-1">
          <p className="font-semibold text-text-secondary mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Default Admin Credentials
          </p>
          <div className="flex justify-between">
            <span className="text-text-muted">Email:</span>
            <span className="font-mono text-text-primary">samlite250@gmail.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Password:</span>
            <span className="font-mono text-text-primary">@Smart250</span>
          </div>
          <p className="text-text-muted mt-2 opacity-60">Remove this box before going to production.</p>
        </div>
      </motion.div>
    </div>
  )
}
