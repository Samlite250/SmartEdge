import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useToast } from '../components/ui/Toast'
import api from '../lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
      toast('Password reset email sent!', 'success')
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to send reset email', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg card-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">SE</span>
          </div>
          <span className="text-xl font-bold">Smart<span className="text-primary">Edge</span></span>
        </Link>

        <div className="bg-white rounded-[32px] p-8 shadow-card">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>

          <h1 className="text-2xl font-bold text-text-primary mb-2">Forgot password?</h1>
          <p className="text-text-secondary mb-8">Enter your email and we'll send you a reset link.</p>

          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Check your email</h3>
              <p className="text-sm text-text-secondary">We've sent a password reset link to {email}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Email" type="email" placeholder="you@example.com" icon={Mail} value={email} onChange={e => setEmail(e.target.value)} required />
              <Button type="submit" className="w-full" loading={loading}>Send Reset Link</Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
