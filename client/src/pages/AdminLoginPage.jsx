import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react'
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
        toast('Access denied. Administrators only.', 'error')
        return
      }
      login(data.user, data.token)
      toast('Welcome back, Administrator!', 'success')
      navigate('/admin')
    } catch (err) {
      toast(err.response?.data?.error || 'Invalid credentials. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080c14] flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex w-[45%] relative flex-col items-center justify-center p-12 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0f1623 0%, #0a1020 100%)' }}>

        {/* Grid lines decoration */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-primary/20 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-sm">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl card-gradient flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30">
            <span className="text-white font-bold text-xl">SE</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            SmartEdge<br />
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Admin Center
            </span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed">
            Secure administrative access for managing the platform, users, transactions, and system settings.
          </p>

          {/* Stats row */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { label: 'Users', value: '5+' },
              { label: 'Transactions', value: '∞' },
              { label: 'Uptime', value: '99%' },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-white/5 p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-[11px] text-white/30 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative">

        {/* Mobile ambient glow */}
        <div className="lg:hidden absolute top-0 left-0 right-0 h-48 bg-primary/5 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg card-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">SE</span>
            </div>
            <span className="text-lg font-bold text-white">Smart<span className="text-primary">Edge</span></span>
          </div>

          {/* Shield badge */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl card-gradient flex items-center justify-center shadow-lg shadow-primary/25">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#080c14]">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Portal</h1>
              <p className="text-xs text-white/30">Restricted — authorized personnel only</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                <input
                  type="email"
                  placeholder="admin@smartedge.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl card-gradient text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-primary/20 mt-2"
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
                  Access Admin Panel
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
            <Link
              to="/admin-setup"
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-xs font-semibold text-emerald-400">First time? Promote account to Admin</p>
                  <p className="text-[11px] text-white/25">Run this once if you get "Access denied"</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400/50 group-hover:text-emerald-400 transition-colors" />
            </Link>
            <div className="flex items-center justify-between">
              <Link to="/login" className="text-xs text-white/25 hover:text-white/50 transition-colors">
                ← User Login
              </Link>
              <Link to="/" className="text-xs text-white/25 hover:text-white/50 transition-colors">
                Back to Home
              </Link>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  )
}
