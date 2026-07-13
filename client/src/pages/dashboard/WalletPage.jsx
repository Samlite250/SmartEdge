import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import {
  Wallet, ArrowDownCircle, ArrowUpCircle, Banknote, Smartphone,
  X, Upload, CheckCircle2, ChevronRight, Info
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useToast } from '../../components/ui/Toast'
import { walletApi, depositApi, withdrawalApi } from '../../services/api'
import { formatCurrency, formatDateTime, getStatusColor } from '../../lib/utils'
import { useAuth } from '../../hooks/useAuth'

export default function WalletPage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState(null) // null | 'deposit' | 'withdraw'

  // deposit step 1 state
  const [depositMethods, setDepositMethods] = useState([])
  const [withdrawMethods, setWithdrawMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState('')
  const [instructions, setInstructions] = useState(null)
  const [loadingInstructions, setLoadingInstructions] = useState(false)
  const [depositStep, setDepositStep] = useState(1) // 1 = pick method, 2 = fill form

  // form state
  const [form, setForm] = useState({
    amount: '',
    payerName: '',
    payerPhone: '',
    proofImage: '',
    walletAddress: '',
    phoneNumber: '',
  })
  const [proofPreview, setProofPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const toast = useToast()
  const userCurrency = user?.currency || wallet?.currency || 'USD'

  // ── Load wallet, transactions and payment methods ──────────────────────
  const load = () => {
    setLoading(true)
    Promise.all([
      walletApi.getWallet(),
      walletApi.getTransactions(),
      depositApi.getMethods().catch(() => []),
      withdrawalApi.getMethods().catch(() => []),
    ])
      .then(([w, tx, dm, wm]) => {
        setWallet(w)
        setTransactions(tx.data || [])
        setDepositMethods(dm)
        setWithdrawMethods(wm)
      })
      .catch(() => toast('Failed to load wallet', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  useEffect(() => {
    if (!loading) {
      const action = searchParams.get('action')
      const amt = searchParams.get('amount')
      if (action === 'deposit') {
        setMode('deposit')
        setDepositStep(1)
        if (amt) setForm(f => ({ ...f, amount: amt }))
      }
    }
  }, [loading, searchParams])

  // ── Fetch payment instructions when method is chosen ──────────────────
  useEffect(() => {
    if (mode === 'deposit' && selectedMethod) {
      const country = user?.country || user?.profile?.country
      if (!country) { setInstructions(null); return }
      setLoadingInstructions(true)
      depositApi.getInstructions(country)
        .then(data => setInstructions(data || null))
        .catch(() => setInstructions(null))
        .finally(() => setLoadingInstructions(false))
    } else {
      setInstructions(null)
    }
  }, [mode, selectedMethod, user?.country])

  // ── Reset when mode changes ───────────────────────────────────────────
  const openMode = (m) => {
    setMode(m)
    setDepositStep(1)
    setSelectedMethod('')
    setInstructions(null)
    setProofPreview(null)
    setForm({ amount: '', payerName: '', payerPhone: '', proofImage: '', walletAddress: '', phoneNumber: '' })
  }

  const closeMode = () => {
    setMode(null)
    setDepositStep(1)
    setSelectedMethod('')
    setInstructions(null)
    setProofPreview(null)
  }

  // ── File upload ───────────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return toast('Please select an image file', 'warning')
    if (file.size > 5 * 1024 * 1024) return toast('Image must be under 5MB', 'warning')
    const reader = new FileReader()
    reader.onload = (ev) => {
      setProofPreview(ev.target.result)
      setForm(f => ({ ...f, proofImage: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  // ── Submit deposit ────────────────────────────────────────────────────
  const handleDeposit = async () => {
    if (!form.amount) return toast('Please enter the amount', 'warning')
    if (!form.payerName.trim()) return toast('Please enter the name used for payment', 'warning')
    if (!form.payerPhone.trim()) return toast('Please enter the phone/number used to pay', 'warning')
    if (!form.proofImage) return toast('Please upload payment proof screenshot', 'warning')
    setSubmitting(true)
    try {
      await depositApi.create({
        amount: parseFloat(form.amount),
        paymentMethod: selectedMethod,
        payerName: form.payerName,
        payerPhone: form.payerPhone,
        proofImage: form.proofImage,
      })
      toast('Deposit request submitted! Awaiting admin approval.', 'success')
      closeMode()
      load()
    } catch (err) {
      toast(err.response?.data?.error || 'Deposit failed', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Submit withdrawal ─────────────────────────────────────────────────
  const handleWithdraw = async () => {
    if (!form.amount || !selectedMethod) return
    setSubmitting(true)
    try {
      await withdrawalApi.create({
        amount: parseFloat(form.amount),
        paymentMethod: selectedMethod,
        walletAddress: form.walletAddress || undefined,
        phoneNumber: form.phoneNumber || undefined,
      })
      toast('Withdrawal request submitted!', 'success')
      closeMode()
      load()
    } catch (err) {
      toast(err.response?.data?.error || 'Withdrawal failed', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div><div className="h-8 w-48 bg-border/50 rounded-lg animate-pulse mb-2" /><div className="h-5 w-64 bg-border/50 rounded-lg animate-pulse" /></div>
        <Card><CardContent><div className="h-24 bg-border/50 rounded-lg animate-pulse" /></CardContent></Card>
      </div>
    )
  }

  const methods = mode === 'deposit' ? depositMethods : withdrawMethods

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Wallet</h1>
        <p className="text-text-secondary">Manage your funds and transactions</p>
      </div>

      {/* Balance card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="card-gradient text-white">
          <CardHeader>
            <CardTitle className="text-white/80 text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="w-6 h-6 text-white/60" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-1">{formatCurrency(wallet?.balance || 0, wallet?.currency || userCurrency)}</p>
            <p className="text-white/60 text-sm">{wallet?.currency || userCurrency} Wallet</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="primary" className="w-full" onClick={() => openMode('deposit')}>
          <ArrowDownCircle className="w-5 h-5" /> Deposit
        </Button>
        <Button variant="outline" className="w-full" onClick={() => openMode('withdraw')}>
          <ArrowUpCircle className="w-5 h-5" /> Withdraw
        </Button>
      </div>

      {/* ── DEPOSIT / WITHDRAW PANEL ────────────────────────────────────── */}
      <AnimatePresence>
        {mode && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              {/* Header */}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="capitalize">{mode} Funds</CardTitle>
                    {mode === 'deposit' && (
                      <div className="flex items-center gap-1">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${depositStep >= 1 ? 'bg-primary text-white' : 'bg-border text-text-muted'}`}>1</span>
                        <div className={`w-8 h-0.5 ${depositStep >= 2 ? 'bg-primary' : 'bg-border'}`} />
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${depositStep >= 2 ? 'bg-primary text-white' : 'bg-border text-text-muted'}`}>2</span>
                      </div>
                    )}
                  </div>
                  <button onClick={closeMode} className="p-1 rounded-lg hover:bg-surface transition-colors">
                    <X className="w-5 h-5 text-text-muted" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">

                {/* ── STEP 1: Choose Payment Method ─────────────────────── */}
                {(mode === 'withdraw' || depositStep === 1) && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-text-primary">
                        {mode === 'deposit' ? '① Choose Payment Method' : 'Payment Method'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {methods.map(m => (
                          <button
                            key={m}
                            onClick={() => setSelectedMethod(m)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${selectedMethod === m
                              ? 'border-primary bg-primary/8 text-primary shadow-sm shadow-primary/20'
                              : 'border-border/50 text-text-secondary hover:border-primary/40 hover:bg-surface'
                              }`}
                          >
                            {m.includes('Bank') || m.includes('USDT') || m.includes('Bitcoin') || m.includes('Ethereum')
                              ? <Banknote className="w-4 h-4 shrink-0" />
                              : <Smartphone className="w-4 h-4 shrink-0" />
                            }
                            <span className="flex-1 truncate">{m}</span>
                            {selectedMethod === m && <CheckCircle2 className="w-4 h-4 shrink-0 text-primary" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Show instructions immediately for deposit after method chosen */}
                    {mode === 'deposit' && selectedMethod && (
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {loadingInstructions ? (
                            <div className="flex items-center gap-2 py-3 text-xs text-text-muted">
                              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                              Loading payment instructions...
                            </div>
                          ) : instructions ? (
                            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                                <div className="flex items-center gap-2">
                                  <Info className="w-4 h-4 text-emerald-400" />
                                  <p className="font-semibold text-emerald-400 text-sm">Payment Instructions</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-full card-gradient text-white font-medium">{instructions.method}</span>
                              </div>
                              <p className="whitespace-pre-wrap text-[12px] text-text-secondary leading-relaxed font-mono">{instructions.instructions}</p>
                            </div>
                          ) : (
                            <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-400 flex items-center gap-2">
                              <Info className="w-4 h-4 shrink-0" />
                              No specific instructions for your country yet. Please contact support.
                            </div>
                          )}

                          {/* Next step button */}
                          <Button
                            className="w-full mt-3"
                            onClick={() => setDepositStep(2)}
                            disabled={!selectedMethod}
                          >
                            Continue to Enter Amount <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </motion.div>
                      </AnimatePresence>
                    )}

                    {/* Withdraw form fields */}
                    {mode === 'withdraw' && selectedMethod && (
                      <AnimatePresence>
                        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <Input
                            label="Amount"
                            type="number"
                            placeholder={`Enter amount in ${userCurrency}`}
                            value={form.amount}
                            onChange={e => setForm({ ...form, amount: e.target.value })}
                          />
                          <Input
                            label="Wallet Address (for crypto)"
                            placeholder="Optional for crypto withdrawals"
                            value={form.walletAddress}
                            onChange={e => setForm({ ...form, walletAddress: e.target.value })}
                          />
                          <Input
                            label="Phone Number (for mobile money)"
                            placeholder="+256 700 000 000"
                            icon={Smartphone}
                            value={form.phoneNumber}
                            onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                          />
                          <Button className="w-full" onClick={handleWithdraw} loading={submitting}>
                            <ArrowUpCircle className="w-5 h-5" /> Withdraw
                          </Button>
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </>
                )}

                {/* ── STEP 2 (deposit only): Amount + Credentials + Proof ── */}
                {mode === 'deposit' && depositStep === 2 && (
                  <motion.div className="space-y-4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    {/* Selected method badge */}
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Method: <span className="font-semibold text-text-primary">{selectedMethod}</span>
                      <button onClick={() => setDepositStep(1)} className="ml-auto text-primary hover:underline text-xs">Change</button>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1">② Amount</label>
                      <Input
                        type="number"
                        placeholder={`Enter amount in ${userCurrency}`}
                        value={form.amount}
                        onChange={e => setForm({ ...form, amount: e.target.value })}
                      />
                    </div>

                    {/* Name used for payment */}
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1">③ Name Used to Pay</label>
                      <Input
                        placeholder="Full name on the payment account"
                        icon={Smartphone}
                        value={form.payerName}
                        onChange={e => setForm({ ...form, payerName: e.target.value })}
                      />
                    </div>

                    {/* Phone/Number used */}
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1">④ Phone / Number Used to Pay</label>
                      <Input
                        placeholder="+256 700 000 000"
                        icon={Smartphone}
                        value={form.payerPhone}
                        onChange={e => setForm({ ...form, payerPhone: e.target.value })}
                      />
                    </div>

                    {/* Payment Proof */}
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1">⑤ Payment Proof (Screenshot)</label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-surface/50"
                      >
                        {proofPreview ? (
                          <div className="relative w-full">
                            <img src={proofPreview} alt="Proof" className="max-h-48 rounded-lg mx-auto object-contain" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setProofPreview(null)
                                setForm(f => ({ ...f, proofImage: '' }))
                                fileInputRef.current.value = ''
                              }}
                              className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-text-muted mb-2" />
                            <p className="text-sm text-text-muted">Tap to upload payment screenshot</p>
                            <p className="text-[10px] text-text-muted/60 mt-1">PNG, JPG up to 5MB</p>
                          </>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                      </div>
                    </div>

                    {/* Submit */}
                    <Button className="w-full" onClick={handleDeposit} loading={submitting}>
                      <ArrowDownCircle className="w-5 h-5" /> Submit Deposit
                    </Button>
                  </motion.div>
                )}

              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RECENT TRANSACTIONS ───────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-text-secondary text-sm text-center py-4">No transactions yet.</p>
          ) : (
            <div className="divide-y divide-border/50">
              {transactions.map(tx => {
                const txCurrency = tx.currency || wallet?.currency || userCurrency
                return (
                  <div key={tx.id} className="flex items-center gap-3 py-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'deposit' ? 'accent-gradient' : tx.type === 'withdrawal' ? 'card-gradient' : 'green-gradient'}`}>
                      {tx.type === 'deposit'
                        ? <ArrowDownCircle className="w-4 h-4 text-white" />
                        : <ArrowUpCircle className="w-4 h-4 text-white" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary capitalize">{tx.type?.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-text-muted">{formatDateTime(tx.created_at)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-semibold ${tx.type === 'deposit' || tx.type === 'daily_return' || tx.type === 'referral_bonus' ? 'text-success' : 'text-danger'}`}>
                        {tx.type === 'deposit' || tx.type === 'daily_return' || tx.type === 'referral_bonus' ? '+' : '-'}
                        {formatCurrency(tx.amount, txCurrency)}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(tx.status)}`}>{tx.status}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
