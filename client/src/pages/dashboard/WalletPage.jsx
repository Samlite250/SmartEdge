import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, ArrowDownCircle, ArrowUpCircle, Copy, Banknote, Smartphone, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useToast } from '../../components/ui/Toast'
import { walletApi, depositApi, withdrawalApi } from '../../services/api'
import { formatCurrency, formatDateTime, getStatusColor } from '../../lib/utils'
import { useAuth } from '../../hooks/useAuth'

export default function WalletPage() {
  const { user } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState(null)
  const [depositMethods, setDepositMethods] = useState([])
  const [withdrawMethods, setWithdrawMethods] = useState([])
  const [form, setForm] = useState({ amount: '', paymentMethod: '', walletAddress: '', phoneNumber: '' })
  const [submitting, setSubmitting] = useState(false)
  const toast = useToast()

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

  const handleDeposit = async () => {
    if (!form.amount || !form.paymentMethod) return
    setSubmitting(true)
    try {
      await depositApi.create({ amount: parseFloat(form.amount), paymentMethod: form.paymentMethod })
      toast('Deposit request submitted!', 'success')
      setMode(null)
      setForm({ amount: '', paymentMethod: '', walletAddress: '', phoneNumber: '' })
    } catch (err) {
      toast(err.response?.data?.error || 'Deposit failed', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleWithdraw = async () => {
    if (!form.amount || !form.paymentMethod) return
    setSubmitting(true)
    try {
      await withdrawalApi.create({
        amount: parseFloat(form.amount),
        paymentMethod: form.paymentMethod,
        walletAddress: form.walletAddress || undefined,
        phoneNumber: form.phoneNumber || undefined,
      })
      toast('Withdrawal request submitted!', 'success')
      setMode(null)
      setForm({ amount: '', paymentMethod: '', walletAddress: '', phoneNumber: '' })
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="card-gradient text-white">
          <CardHeader>
            <CardTitle className="text-white/80 text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="w-6 h-6 text-white/60" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-1">{formatCurrency(wallet?.balance || 0, wallet?.currency || 'USD')}</p>
            <p className="text-white/60 text-sm">{wallet?.currency || 'USD'} Wallet</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="primary" className="w-full" onClick={() => setMode('deposit')}>
          <ArrowDownCircle className="w-5 h-5" /> Deposit
        </Button>
        <Button variant="outline" className="w-full" onClick={() => setMode('withdraw')}>
          <ArrowUpCircle className="w-5 h-5" /> Withdraw
        </Button>
      </div>

      <AnimatePresence>
        {mode && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="capitalize">{mode} Funds</CardTitle>
                  <button onClick={() => setMode(null)} className="p-1 rounded-lg hover:bg-surface transition-colors"><X className="w-5 h-5 text-text-muted" /></button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input label="Amount" type="number" placeholder="Enter amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-secondary">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    {methods.map(m => (
                      <button key={m} onClick={() => setForm({ ...form, paymentMethod: m })}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.paymentMethod === m ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-secondary hover:border-primary/50'}`}
                      >
                        {m.includes('Bank') || m.includes('USDT') || m.includes('Bitcoin') || m.includes('Ethereum')
                          ? <Banknote className="w-4 h-4" />
                          : <Smartphone className="w-4 h-4" />
                        }
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                {mode === 'withdraw' && (
                  <>
                    <Input label="Wallet Address (for crypto)" placeholder="Optional for crypto" value={form.walletAddress} onChange={e => setForm({ ...form, walletAddress: e.target.value })} />
                    <Input label="Phone Number (for mobile money)" placeholder="+256 700 000 000" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
                  </>
                )}
                <Button className="w-full capitalize" onClick={mode === 'deposit' ? handleDeposit : handleWithdraw} loading={submitting}>
                  {mode === 'deposit' ? <ArrowDownCircle className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
                  {mode === 'deposit' ? 'Deposit' : 'Withdraw'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-text-secondary text-sm text-center py-4">No transactions yet.</p>
          ) : (
            <div className="divide-y divide-border/50">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center gap-3 py-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tx.type === 'deposit' ? 'accent-gradient' : tx.type === 'withdrawal' ? 'card-gradient' : 'green-gradient'}`}>
                    {tx.type === 'deposit' ? <ArrowDownCircle className="w-4 h-4 text-white" /> : <ArrowUpCircle className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary capitalize">{tx.type}</p>
                    <p className="text-xs text-text-muted">{formatDateTime(tx.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${tx.type === 'deposit' ? 'text-success' : 'text-danger'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency || wallet?.currency || user?.currency || 'USD')}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(tx.status)}`}>{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
