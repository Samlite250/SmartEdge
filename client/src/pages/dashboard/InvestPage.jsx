import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Calendar, Shield, ArrowRight, Check, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useToast } from '../../components/ui/Toast'
import { investmentApi } from '../../services/api'
import { formatCurrency, formatDate } from '../../lib/utils'
import { useAuth } from '../../hooks/useAuth'

export default function InvestPage() {
  const { user } = useAuth()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [amount, setAmount] = useState('')
  const [investing, setInvesting] = useState(false)
  const toast = useToast()
  const userCurrency = user?.currency || 'USD'

  useEffect(() => {
    investmentApi.getPlans()
      .then(setPlans)
      .catch(() => toast('Failed to load plans', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleInvest = async () => {
    if (!selected || !amount) return
    const num = parseFloat(amount)
    if (num < selected.min_investment) return toast(`Minimum investment is ${formatCurrency(selected.min_investment, userCurrency)}`, 'warning')
    if (selected.max_investment && num > selected.max_investment) return toast(`Maximum investment is ${formatCurrency(selected.max_investment, userCurrency)}`, 'warning')

    setInvesting(true)
    try {
      await investmentApi.invest({ planId: selected.id, amount: num, coinId: selected.coin_id })
      toast('Investment successful!', 'success')
      setSelected(null)
      setAmount('')
    } catch (err) {
      toast(err.response?.data?.error || 'Investment failed', 'error')
    } finally {
      setInvesting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div><div className="h-8 w-48 bg-border/50 rounded-lg animate-pulse mb-2" /><div className="h-5 w-64 bg-border/50 rounded-lg animate-pulse" /></div>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <Card key={i}><CardContent><div className="h-40 bg-border/50 rounded-lg animate-pulse" /></CardContent></Card>)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Investment Plans</h1>
        <p className="text-text-secondary">Choose a plan and start earning daily returns</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan, i) => {
          const colors = ['from-primary to-primary-dark', 'from-secondary to-secondary-dark', 'from-accent to-accent-light', 'from-primary-dark to-primary', 'from-secondary-light to-secondary', 'from-accent to-accent']
          const isSelected = selected?.id === plan.id
          return (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card
                hover
                className={`relative overflow-hidden cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : ''}`}
                onClick={() => { setSelected(plan); setAmount(String(plan.min_investment)) }}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[40px] bg-gradient-to-br ${colors[i % colors.length]} opacity-10`} />
                {i === 2 && (
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full accent-gradient text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">Popular</div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${colors[i % colors.length]} text-white text-xs font-semibold`}>
                      {plan.daily_return}% Daily
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span>{formatCurrency(plan.min_investment, userCurrency)} - {plan.max_investment ? formatCurrency(plan.max_investment, userCurrency) : '∞'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span>Up to {plan.total_return}% total return ({plan.daily_return}% × {plan.duration}d)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{plan.duration} days duration</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="capitalize">{plan.risk_level} risk</span>
                    </div>
                    {plan.features?.length > 0 && (
                      <div className="pt-2 space-y-1">
                        {plan.features.map(f => (
                          <div key={f} className="flex items-center gap-1.5 text-xs text-text-muted">
                            <Check className="w-3 h-3 text-success" /> {f}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="pt-4 mt-auto">
                      <Button className="w-full" variant={isSelected ? "primary" : "outline"} onClick={(e) => { e.stopPropagation(); setSelected(plan); setAmount(String(plan.min_investment)) }}>
                        Invest in {plan.name}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {selected && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Invest in {selected.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-md space-y-4">
                <Input
                  label="Investment Amount"
                  type="number"
                  placeholder={`Min: ${selected.min_investment}`}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
                <div className="flex gap-2">
                  {[selected.min_investment, selected.min_investment * 2, selected.min_investment * 5, selected.min_investment * 10].filter(v => !selected.max_investment || v <= selected.max_investment).map(v => (
                    <button key={v} onClick={() => setAmount(String(v))} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${parseFloat(amount) === v ? 'bg-primary text-white border-primary' : 'bg-surface text-text-secondary border-border hover:border-primary'}`}>
                      {formatCurrency(v, userCurrency)}
                    </button>
                  ))}
                </div>
                {amount && (
                  <div className="p-3 rounded-xl bg-background border border-border text-sm space-y-1">
                    <div className="flex justify-between"><span className="text-text-muted">Daily Return</span><span className="font-semibold text-text-primary">{formatCurrency(parseFloat(amount || 0) * selected.daily_return / 100, userCurrency)}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Total Return ({selected.duration}d)</span><span className="font-semibold text-success">{formatCurrency(parseFloat(amount || 0) * selected.daily_return / 100 * selected.duration, userCurrency)}</span></div>
                  </div>
                )}
                <div className="flex gap-3">
                  <Button onClick={handleInvest} loading={investing} disabled={!amount || parseFloat(amount) < selected.min_investment}>
                    Invest Now <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
