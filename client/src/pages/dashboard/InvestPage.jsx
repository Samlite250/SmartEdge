import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, DollarSign, Calendar, Shield, ArrowRight, Check, Crown, BarChart3, Percent, Target, Zap, X, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useToast } from '../../components/ui/Toast'
import { investmentApi } from '../../services/api'
import { formatCurrency } from '../../lib/utils'
import { useAuth } from '../../hooks/useAuth'

const TIER_COLORS = [
  { bg: 'from-indigo-600/20 to-indigo-600/5', border: 'border-indigo-500/30', badge: 'bg-indigo-600', text: 'text-indigo-400', light: 'bg-indigo-500/10' },
  { bg: 'from-blue-600/20 to-blue-600/5', border: 'border-blue-500/30', badge: 'bg-blue-600', text: 'text-blue-400', light: 'bg-blue-500/10' },
  { bg: 'from-emerald-600/20 to-emerald-600/5', border: 'border-emerald-500/30', badge: 'bg-emerald-600', text: 'text-emerald-400', light: 'bg-emerald-500/10' },
  { bg: 'from-violet-600/20 to-violet-600/5', border: 'border-violet-500/30', badge: 'bg-violet-600', text: 'text-violet-400', light: 'bg-violet-500/10' },
  { bg: 'from-amber-600/20 to-amber-600/5', border: 'border-amber-500/30', badge: 'bg-amber-600', text: 'text-amber-400', light: 'bg-amber-500/10' },
  { bg: 'from-rose-600/20 to-rose-600/5', border: 'border-rose-500/30', badge: 'bg-rose-600', text: 'text-rose-400', light: 'bg-rose-500/10' },
  { bg: 'from-cyan-600/20 to-cyan-600/5', border: 'border-cyan-500/30', badge: 'bg-cyan-600', text: 'text-cyan-400', light: 'bg-cyan-500/10' },
  { bg: 'from-fuchsia-600/20 to-fuchsia-600/5', border: 'border-fuchsia-500/30', badge: 'bg-fuchsia-600', text: 'text-fuchsia-400', light: 'bg-fuchsia-500/10' },
  { bg: 'from-lime-600/20 to-lime-600/5', border: 'border-lime-500/30', badge: 'bg-lime-600', text: 'text-lime-400', light: 'bg-lime-500/10' },
  { bg: 'from-sky-600/20 to-sky-600/5', border: 'border-sky-500/30', badge: 'bg-sky-600', text: 'text-sky-400', light: 'bg-sky-500/10' },
  { bg: 'from-pink-600/20 to-pink-600/5', border: 'border-pink-500/30', badge: 'bg-pink-600', text: 'text-pink-400', light: 'bg-pink-500/10' },
  { bg: 'from-teal-600/20 to-teal-600/5', border: 'border-teal-500/30', badge: 'bg-teal-600', text: 'text-teal-400', light: 'bg-teal-500/10' },
  { bg: 'from-orange-600/20 to-orange-600/5', border: 'border-orange-500/30', badge: 'bg-orange-600', text: 'text-orange-400', light: 'bg-orange-500/10' },
  { bg: 'from-purple-600/20 to-purple-600/5', border: 'border-purple-500/30', badge: 'bg-purple-600', text: 'text-purple-400', light: 'bg-purple-500/10' },
]

export default function InvestPage() {
  const { user } = useAuth()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [amount, setAmount] = useState('')
  const [investing, setInvesting] = useState(false)
  const toast = useToast()
  const userCurrency = user?.currency || 'USD'
  const country = user?.country || ''
  const isVIP = plans.length > 0 && plans[0]?.is_vip

  useEffect(() => {
    investmentApi.getPlans(country)
      .then(setPlans)
      .catch(() => toast('Failed to load plans', 'error'))
      .finally(() => setLoading(false))
  }, [country])

  const handleInvest = async () => {
    if (!selected || !amount) return
    const num = parseFloat(amount)
    if (num < selected.min_investment) return toast(`Minimum is ${formatCurrency(selected.min_investment, userCurrency)}`, 'warning')
    if (selected.max_investment && num > selected.max_investment) return toast(`Maximum is ${formatCurrency(selected.max_investment, userCurrency)}`, 'warning')

    setInvesting(true)
    try {
      await investmentApi.invest({
        planId: selected.id,
        amount: num,
        coinId: selected.coin_id,
        country: selected.country || country,
      })
      toast('Investment successful!', 'success')
      setSelected(null)
      setAmount('')
    } catch (err) {
      toast(err.response?.data?.error || 'Investment failed', 'error')
    } finally {
      setInvesting(false)
    }
  }

  const selectPlan = (plan) => {
    setSelected(plan)
    setAmount(String(plan.min_investment))
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
    <div className="space-y-8 pb-8">

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1f35] to-[#0d1225] border border-white/5 p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Investment Plans</h1>
          </div>
          <p className="text-white/60 text-sm max-w-xl">
            {isVIP
              ? `Choose a VIP tier and start earning 10% daily returns in ${userCurrency}`
              : `Select a plan and start earning daily returns on your investment`}
          </p>
          {isVIP && (
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Percent className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-white/80">10% Daily Return</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs text-white/80">30 Days Duration</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-white/80">Low Risk</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIP Table View */}
      {isVIP ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-text-primary">VIP Tiers</h2>
            </div>
            <span className="text-xs text-text-muted">{plans.length} levels</span>
          </div>

          {/* VIP Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan, i) => {
              const colors = TIER_COLORS[i % TIER_COLORS.length]
              const dailyReturn = plan.min_investment * plan.daily_return / 100
              const totalReturn = dailyReturn * plan.duration
              const totalPayout = plan.min_investment + totalReturn
              const isSelected = selected?.id === plan.id

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div
                    onClick={() => selectPlan(plan)}
                    className={`relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-200 group hover:-translate-y-0.5 ${
                      isSelected
                        ? `${colors.border} shadow-lg shadow-${colors.badge}/10 ring-1 ring-white/20`
                        : 'border-white/5 hover:border-white/10'
                    } bg-[#131A28]`}
                  >
                    {/* Top accent bar */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${colors.badge} opacity-80`} />

                    <div className="p-5 space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl ${colors.light} flex items-center justify-center`}>
                            <Crown className={`w-4 h-4 ${colors.text}`} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{plan.name}</p>
                            <p className="text-[10px] text-text-muted">VIP Tier {i + 1}</p>
                          </div>
                        </div>
                        <div className={`px-2.5 py-0.5 rounded-full ${colors.light} border ${colors.border}`}>
                          <span className={`text-[10px] font-bold ${colors.text}`}>{plan.daily_return}% daily</span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-center py-2">
                        <p className="text-xs text-text-muted mb-1">Investment</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(plan.min_investment, userCurrency)}</p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 rounded-xl bg-white/5">
                          <p className="text-[10px] text-text-muted">Daily</p>
                          <p className="text-xs font-bold text-emerald-400">+{formatCurrency(dailyReturn, userCurrency)}</p>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-white/5">
                          <p className="text-[10px] text-text-muted">Total Earn</p>
                          <p className="text-xs font-bold text-emerald-400">+{formatCurrency(totalReturn, userCurrency)}</p>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-white/5">
                          <p className="text-[10px] text-text-muted">Payout</p>
                          <p className="text-xs font-bold text-white">{formatCurrency(totalPayout, userCurrency)}</p>
                        </div>
                      </div>

                      {/* Select CTA */}
                      <Button
                        className="w-full text-xs"
                        variant={isSelected ? 'primary' : 'outline'}
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); selectPlan(plan) }}
                      >
                        {isSelected ? 'Selected' : `Select ${plan.name}`}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      ) : (
        /* Regular Plan Cards (non-VIP countries) */
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan, i) => {
            const colors = ['from-primary to-primary-dark', 'from-secondary to-secondary-dark', 'from-accent to-accent-light', 'from-primary-dark to-primary', 'from-secondary-light to-secondary', 'from-accent to-accent']
            const isSelected = selected?.id === plan.id
            return (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card
                  hover
                  className={`relative overflow-hidden cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : ''}`}
                  onClick={() => selectPlan(plan)}
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
                        <Button className="w-full" variant={isSelected ? "primary" : "outline"} onClick={(e) => { e.stopPropagation(); selectPlan(plan) }}>
                          {isSelected ? 'Selected' : `Invest in ${plan.name}`}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Investment Modal / Drawer */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#131A28]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative z-10 p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Invest in {selected.name}</h3>
                      <p className="text-xs text-text-muted">
                        {selected.is_vip
                          ? `${selected.daily_return}% daily return for ${selected.duration} days`
                          : `${selected.daily_return}% daily · ${selected.duration} days · ${selected.risk_level} risk`
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <X className="w-4 h-4 text-text-muted" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left: Investment Form */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Investment Amount ({userCurrency})</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-medium text-sm">
                          {userCurrency === 'USD' ? '$' : userCurrency + ' '}
                        </div>
                        <input
                          type="number"
                          value={amount}
                          onChange={e => setAmount(e.target.value)}
                          placeholder={`Min: ${formatCurrency(selected.min_investment, userCurrency)}`}
                          className="w-full pl-16 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-lg font-bold focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-text-muted"
                        />
                      </div>
                    </div>

                    {/* Quick Amount Buttons */}
                    {selected.is_vip && (
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 5, 10].map(mult => {
                          const val = selected.min_investment * mult
                          if (val > selected.max_investment) return null
                          return (
                            <button
                              key={mult}
                              onClick={() => setAmount(String(val))}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                parseFloat(amount) === val
                                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                                  : 'bg-white/5 text-text-secondary border-white/10 hover:border-indigo-500/30 hover:bg-indigo-500/5'
                              }`}
                            >
                              {mult}x
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {selected.is_vip && (
                      <div className="flex gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                        <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-300/80">
                          Your entire investment plus all profits are returned after {selected.duration} days.
                          Daily earnings are credited to your wallet every 24 hours.
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={handleInvest}
                        loading={investing}
                        disabled={!amount || parseFloat(amount) < selected.min_investment}
                        className="flex-1"
                      >
                        Invest Now <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button variant="outline" onClick={() => setSelected(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>

                  {/* Right: Projected Returns */}
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-white/80">Projected Returns</p>

                    {amount && parseFloat(amount) >= selected.min_investment ? (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                            <p className="text-xs text-text-muted mb-1">Daily Return</p>
                            <p className="text-xl font-bold text-emerald-400">
                              +{formatCurrency(parseFloat(amount) * selected.daily_return / 100, userCurrency)}
                            </p>
                            <p className="text-[10px] text-emerald-400/60 mt-1">Credited every 24h</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                            <p className="text-xs text-text-muted mb-1">After {selected.duration} Days</p>
                            <p className="text-xl font-bold text-indigo-400">
                              +{formatCurrency(parseFloat(amount) * selected.daily_return / 100 * selected.duration, userCurrency)}
                            </p>
                            <p className="text-[10px] text-indigo-400/60 mt-1">Total profit</p>
                          </div>
                        </div>

                        {/* Total Payout Bar */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-text-muted">Total Payout at Maturity</span>
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                          </div>
                          <p className="text-2xl font-bold text-white">
                            {formatCurrency(parseFloat(amount) + (parseFloat(amount) * selected.daily_return / 100 * selected.duration), userCurrency)}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                                style={{ width: `${Math.min(100, (selected.daily_return * selected.duration) / (100 + selected.daily_return * selected.duration) * 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-emerald-400 font-medium">
                              +{(selected.daily_return * selected.duration).toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 rounded-xl bg-white/5">
                            <p className="text-[10px] text-text-muted">Capital</p>
                            <p className="text-xs font-semibold text-white">{formatCurrency(parseFloat(amount), userCurrency)}</p>
                          </div>
                          <div className="p-2 rounded-xl bg-white/5">
                            <p className="text-[10px] text-text-muted">Duration</p>
                            <p className="text-xs font-semibold text-white">{selected.duration} days</p>
                          </div>
                          <div className="p-2 rounded-xl bg-white/5">
                            <p className="text-[10px] text-text-muted">Daily Rate</p>
                            <p className="text-xs font-semibold text-emerald-400">{selected.daily_return}%</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-center p-6 rounded-2xl bg-white/5 border border-dashed border-white/10">
                        <BarChart3 className="w-8 h-8 text-text-muted mb-3" />
                        <p className="text-sm text-text-muted">Enter an amount above</p>
                        <p className="text-xs text-text-muted/60 mt-1">to see your projected returns</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
