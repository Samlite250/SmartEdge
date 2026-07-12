import { useState } from 'react'
import { ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useToast } from '../components/ui/Toast'
import { useAuth } from '../hooks/useAuth'
import api from '../lib/api'

export default function AdminSetupPage() {
    const { user, updateUser } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()
    // Always allow editing — works even when not logged in
    const [form, setForm] = useState({ email: '', secret: '' })
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.email || !form.secret) return toast('All fields are required', 'warning')

        setLoading(true)
        try {
            const { data } = await api.post('/admin/setup-admin', form)
            toast(data.message || 'Account promoted to admin!', 'success')
            setDone(true)
            // Update local auth state if the same user is logged in
            if (user?.email === form.email) {
                updateUser({ role: 'admin' })
            }
        } catch (err) {
            toast(err.response?.data?.error || 'Promotion failed. Check your secret key.', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Card */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="w-16 h-16 rounded-2xl card-gradient flex items-center justify-center mb-4 shadow-lg">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary">Admin Setup</h1>
                        <p className="text-text-secondary text-sm mt-1">
                            Promote a user account to <span className="text-primary font-semibold">Admin</span> using the setup secret key.
                        </p>
                    </div>

                    {done ? (
                        <div className="text-center space-y-4">
                            <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
                                <ShieldCheck className="w-7 h-7 text-emerald-400" />
                            </div>
                            <p className="text-text-primary font-semibold">Account promoted to Admin!</p>
                            <p className="text-text-muted text-sm">You can now log in through the Admin Portal.</p>
                            <Link
                                to="/admin-login"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl card-gradient text-white text-sm font-semibold hover:opacity-90 transition-all"
                            >
                                Go to Admin Login <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="User Email"
                            type="email"
                            placeholder="samlite250@gmail.com"
                            icon={Mail}
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Setup Secret Key"
                            type="password"
                            placeholder="Enter the setup secret"
                            icon={Lock}
                            value={form.secret}
                            onChange={(e) => setForm({ ...form, secret: e.target.value })}
                            required
                        />

                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600">
                            Contact the server administrator to obtain the setup secret key.
                        </div>

                        <Button type="submit" className="w-full" loading={loading}>
                            Promote to Admin <ArrowRight className="w-4 h-4" />
                        </Button>
                    </form>
                    )}

                    <p className="text-center text-xs text-text-muted mt-6">
                        <Link to="/admin-login" className="text-primary hover:underline">← Back to Admin Login</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

