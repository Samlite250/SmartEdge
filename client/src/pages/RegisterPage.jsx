import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone, Gift, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { CountrySelect } from '../components/ui/CountrySelect'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/ui/Toast'
import api from '../lib/api'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [form, setForm] = useState({
    fullName: '', username: '', email: '', phone: '',
    country: '', referralCode: searchParams.get('ref') || '',
    password: '', confirmPassword: '', acceptTerms: false,
  })
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      return toast('Passwords do not match', 'error')
    }
    if (!form.acceptTerms) {
      return toast('Please accept the terms and conditions', 'warning')
    }
    if (!form.country) {
      return toast('Please select your country', 'warning')
    }
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      try {
        // Login — auth.js already joins the full profile (with country/currency) into user.profile
        const loginRes = await api.post('/auth/login', { email: form.email, password: form.password });
        login(loginRes.data.user, loginRes.data.token, loginRes.data.refreshToken);
        toast('Welcome to SmartEdge!', 'success');
        navigate('/dashboard');
      } catch {
        toast('Account created! Please check your email to confirm, then sign in.', 'success')
        navigate('/login')
      }
    } catch (err) {
      toast(err.response?.data?.error || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 card-gradient items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 text-white text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">SE</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-white/80">Join thousands of smart investors and start earning daily returns.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg card-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">SE</span>
            </div>
            <span className="text-xl font-bold">Smart<span className="text-primary">Edge</span></span>
          </Link>

          <h1 className="text-2xl font-bold text-text-primary mb-2">Create your account</h1>
          <p className="text-text-secondary mb-8">Start building your digital wealth</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" placeholder="John Doe" icon={User} value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
              <Input label="Username" placeholder="johndoe" icon={User} value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>
            <Input label="Email" type="email" placeholder="you@example.com" icon={Mail} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <Input label="Phone Number" placeholder="+256 700 000 000" icon={Phone} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

            <CountrySelect
              value={form.country}
              onChange={country => setForm({ ...form, country })}
            />

            <Input label="Referral Code (Optional)" placeholder="Enter referral code" icon={Gift} value={form.referralCode} onChange={e => setForm({ ...form, referralCode: e.target.value })} />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                icon={Lock}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-text-muted hover:text-text-secondary">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Input label="Confirm Password" type="password" placeholder="Repeat your password" icon={Lock} value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />

            <label className="flex items-start gap-2 text-sm text-text-secondary">
              <input type="checkbox" checked={form.acceptTerms} onChange={e => setForm({ ...form, acceptTerms: e.target.checked })} className="mt-0.5 rounded border-border text-primary focus:ring-primary" />
              <span>I accept the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></span>
            </label>

            <Button type="submit" className="w-full" loading={loading}>
              Create Account <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
