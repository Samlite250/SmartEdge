import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, DollarSign, Calendar, Shield, ArrowRight, Check,
  Crown, Wallet, Clock, ChevronLeft, Activity, RefreshCw,
  AlertCircle, Lock, CheckCircle, BarChart3, ArrowLeft
} from 'lucide-react'
import { useToast } from '../../components/ui/Toast'
import { investmentApi, userApi } from '../../services/api'
import { formatCurrency } from '../../lib/utils'
import { useAuth } from '../../hooks/useAuth'

const PLAN_COLORS = [
  { from: '#6366f1', to: '#8b5cf6', light: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)' },
  { from: '#0ea5e9', to: '#06b6d4', light: 'rgba(14,165,233,0.12)', border: 'rgba(14,165,233,0.3)' },
  { from: '#10b981', to: '#059669', light: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
  { from: '#f59e0b', to: '#f97316', light: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  { from: '#ec4899', to: '#f43f5e', light: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.3)' },
  { from: '#8b5cf6', to: '#a855f7', light: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)' },
]

function ActiveInvestCard({ inv, currency, i }) {
  const plan = inv.investment_plans || {}
  const c = PLAN_COLORS[i % PLAN_COLORS.length]
  const pct = plan.duration ? Math.min(100, Math.round((inv.days_passed || 0) / plan.duration * 100)) : 0
  const earned = Number(inv.total_earned) || 0
  const endDate = inv.end_date ? new Date(inv.end_date).toLocaleDateString() : '—'

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
      <div className="rounded-2xl border bg-[#0f1623] overflow-hidden" style={{ borderColor: c.border }}>
        <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${c.from}, ${c.to})` }} />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-white text-sm">{plan.name || 'Investment Plan'}</p>
              <p className="text-xs text-white/40 mt-0.5">Started {new Date(inv.start_date || inv.created_at).toLocaleDateString()}</p>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${inv.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' :
                inv.status === 'completed' ? 'bg-sky-500/15 text-sky-400' :
                  'bg-white/8 text-white/40'
              }`}>
              {inv.status === 'active' ? '● Active' : inv.status === 'completed' ? '✓ Done' : inv.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            {[
              { label: 'Invested', val: formatCurrency(inv.amount, currency) },
              { label: 'Earned', val: `+${formatCurrency(earned, currency)}` },
              { label: 'Ends', val: endDate },
            ].map(s => (
              <div key={s.label} className="p-2.5 rounded-xl bg-white/4">
                <p className="text-[10px] text-white/35 mb-0.5">{s.label}</p>
                <p className="text-xs font-bold text-white">{s.val}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-white/35 mb-1.5">
              <span>Progress</span>
              <span>{pct}% · {inv.days_passed || 0}/{plan.duration || '–'} days</span>
            </div>
            <div className="h-1.5 w-full bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: `linear-gradient(to right, ${c.from}, ${c.to})` }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/6 bg-[#0f1623] p-5 space-y-3 animate-pulse">
      <div className="h-4 w-28 bg-white/8 rounded" />
      <div className="h-8 w-20 bg-white/8 rounded" />
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map(i => <div key={i} className="h-12 bg-white/5 rounded-xl" />)}
      </div>
      <div className="h-10 bg-white/5 rounded-xl" />
    </div>
  )
}

export default function InvestPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('plans')
  const [plans, setPlans] = useState([])
  const [active, setActive] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingActive, setLoadingActive] = useState(false)
  const [selected, setSelected] = useState(null)
  const [amount, setAmount] = useState('')
  const [investing, setInvesting] = useState(false)
  const [balance, setBalance] = useState(0)
  const [balanceLoaded, setBalanceLoaded] = useState(false)
  const toast = useToast()

  const userCurrency = user?.currency || 'USD'
  const country = user?.country || ''
  const fmt = (v) => formatCurrency(v, userCurrency)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      investmentApi.getPlans(country),
      userApi.getDashboard().catch(() => null),
    ]).then(([plansData, dashboard]) => {
      setPlans(plansData)
      if (dashboard?.wallet) setBalance(Number(dashboard.wallet.balance) || 0)
      setBalanceLoaded(true)
    }).catch(() => toast('Failed to load plans', 'error'))
      .finally(() => setLoading(false))
  }, [country])

  useEffect(() => {
    if (tab === 'active' && active.length === 0) {
      setLoadingActive(true)
      investmentApi.getActive()
        .then(setActive)
        .catch(() => toast('Failed to load investments', 'error'))
        .finally(() => setLoadingActive(false))
    }
  }, [tab])

  const num = parseFloat(amount) || 0
  const dailyEarning = selected ? num * (selected.daily_return / 100) : 0
  const totalEarning = selected ? dailyEarning * selected.duration : 0
  const totalPayout = num + totalEarning

  const amountError = useMemo(() => {
    if (!selected || !amount) return null
    if (num < selected.min_investment) return `Minimum is ${fmt(selected.min_investment)}`
    if (selected.max_investment && num > selected.max_investment) return `Maximum is ${fmt(selected.max_investment)}`
    if (balanceLoaded && num > balance) return `You only have ${fmt(balance)} available`
    return null
  }, [amount, selected, balance, balanceLoaded])

  const canInvest = selected && amount && !amountError && num >= selected.min_investment

  const selectPlan = (plan) => {
    setSelected(plan)
    setAmount(String(plan.min_investment))
  }

  const handleInvest = async () => {
    if (!canInvest) return
    setInvesting(true)
    try {
      await investmentApi.invest({
        planId: selected.id,
        amount: num,
        coinId: selected.coin_id,
        country: selected.country || country,
      })
      toast('🎉 Investment placed! Returns start within 24 hours.', 'success')
      setBalance(b => b - num)
      setActive(prev => [{
        id: `opt_${Date.now()}`,
        plan_id: selected.id,
        amount: num,
        total_earned: 0,
        total_expected_return: totalEarning,
        days_passed: 0,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + selected.duration * 86400000).toISOString(),
        investment_plans: { name: selected.name, duration: selected.duration },
        created_at: new Date().toISOString(),
      }, ...prev])
      setSelected(null)
      setAmount('')
      setTab('active')
    } catch (err) {
      toast(err.response?.data?.error || 'Investment failed. Try again.', 'error')
    } finally {
      setInvesting(false)
    }
  }

  const isVIP = plans.length > 0 && plans[0]?.is_vip

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-10">

      {/* ── Header ── */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-3">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-400">Investment Plans</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mb-1">Grow Your Money</h1>
        <p className="text-white/45 text-sm">Pick a plan, enter your amount, and start earning daily returns.</p>
      </div>

      {/* ── Balance bar ── */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/4 border border-white/8">
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Wallet className="w-4 h-4" />
          <span>Your balance</span>
        </div>
        <span className="font-bold text-white text-lg">{fmt(balance)}</span>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex gap-1 p-1 rounded-2xl bg-white/4 border border-white/6 w-fit">
        {[
          { key: 'plans', label: 'Browse Plans', icon: <BarChart3 className="w-3.5 h-3.5" /> },
          { key: 'active', label: 'My Investments', icon: <Activity className="w-3.5 h-3.5" /> },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSelected(null); setAmount('') }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.key
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-white/40 hover:text-white/70'
              }`}
          >
            {t.icon}{t.label}
            {t.key === 'active' && active.filter(a => a.status === 'active').length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full">
                {active.filter(a => a.status === 'active').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══════════════ PLANS TAB ═══════════════ */}
      {tab === 'plans' && (
        <AnimatePresence mode="wait">

          {/* ── Step 1: Plan grid ── */}
          {!selected && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* Step indicator */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold">1</div>
                <p className="text-sm font-semibold text-white">Choose a plan</p>
                <div className="flex-1 h-px bg-white/8" />
                <p className="text-xs text-white/30">Step 1 of 2</p>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                </div>
              ) : plans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <BarChart3 className="w-10 h-10 text-white/15 mb-3" />
                  <p className="text-white/45 font-medium">No plans available in your region yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {isVIP && (
                    <div className="flex items-center gap-2 text-xs text-amber-400/80 pb-1">
                      <Crown className="w-3.5 h-3.5" />
                      <span>VIP Plans — {plans.length} tiers available</span>
                    </div>
                  )}
                  {plans.map((plan, i) => {
                    const c = PLAN_COLORS[i % PLAN_COLORS.length]
                    const dailyMin = plan.min_investment * plan.daily_return / 100
                    return (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div
                          onClick={() => selectPlan(plan)}
                          className="group relative rounded-2xl border bg-[#0f1623] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
                          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = c.border}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                        >
                          {/* Color bar */}
                          <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, ${c.from}, ${c.to})` }} />

                          <div className="p-5 flex items-center gap-4">
                            {/* Icon */}
                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: c.light }}>
                              <TrendingUp className="w-5 h-5" style={{ color: c.from }} />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="font-bold text-white text-sm">{plan.name}</p>
                                {i === 2 && !isVIP && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400">Popular</span>
                                )}
                              </div>
                              <p className="text-xs text-white/40">
                                {plan.duration} days · from {fmt(plan.min_investment)}
                                {plan.max_investment ? ` to ${fmt(plan.max_investment)}` : '+'}
                              </p>
                            </div>

                            {/* Return badge */}
                            <div className="flex-shrink-0 text-right">
                              <p className="text-2xl font-extrabold" style={{ color: c.from }}>{plan.daily_return}%</p>
                              <p className="text-[10px] text-white/35">per day</p>
                            </div>

                            {/* Arrow */}
                            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0" />
                          </div>

                          {/* Bottom: what you earn with min investment */}
                          <div className="px-5 pb-4 flex items-center gap-2">
                            <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                            <p className="text-xs text-white/40">
                              Earn <span className="text-emerald-400 font-semibold">{fmt(dailyMin)}/day</span> with {fmt(plan.min_investment)} · total payout: <span className="text-white/70 font-semibold">{fmt(plan.min_investment + dailyMin * plan.duration)}</span> after {plan.duration} days
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Step 2: Invest form ── */}
          {selected && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Step indicator */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setSelected(null); setAmount('') }}
                  className="flex items-center justify-center w-6 h-6 rounded-full bg-white/8 hover:bg-white/15 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3 text-white/60" />
                </button>
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold">2</div>
                <p className="text-sm font-semibold text-white">Confirm your investment</p>
                <div className="flex-1 h-px bg-white/8" />
                <p className="text-xs text-white/30">Step 2 of 2</p>
              </div>

              {/* Plan summary pill */}
              {(() => {
                const idx = plans.findIndex(p => p.id === selected.id)
                const c = PLAN_COLORS[idx % PLAN_COLORS.length]
                return (
                  <div className="flex items-center gap-3 p-4 rounded-2xl border" style={{ background: c.light, borderColor: c.border }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}>
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{selected.name}</p>
                      <p className="text-xs text-white/50">{selected.daily_return}% daily · {selected.duration} days plan</p>
                    </div>
                    <button
                      onClick={() => { setSelected(null); setAmount('') }}
                      className="text-xs text-white/40 hover:text-white/70 transition-colors underline"
                    >
                      Change
                    </button>
                  </div>
                )
              })()}

              {/* Amount input */}
              <div className="rounded-2xl border border-white/8 bg-[#0d1220] p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">
                    How much do you want to invest?
                  </label>
                  <p className="text-xs text-white/40 mb-3">
                    Min: {fmt(selected.min_investment)}{selected.max_investment ? ` · Max: ${fmt(selected.max_investment)}` : ''}
                  </p>

                  {/* Big number input */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-white/25 pointer-events-none">
                      {userCurrency === 'USD' ? '$' : userCurrency.slice(0, 1)}
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder={String(selected.min_investment)}
                      min={selected.min_investment}
                      max={selected.max_investment || undefined}
                      className={`w-full pl-10 pr-4 py-4 bg-white/5 border rounded-2xl text-3xl font-extrabold text-white focus:outline-none transition-all placeholder:text-white/15 placeholder:text-3xl placeholder:font-extrabold ${amountError
                          ? 'border-rose-500/50 focus:border-rose-500/70'
                          : 'border-white/10 focus:border-indigo-500/50'
                        }`}
                    />
                  </div>

                  {/* Quick amounts */}
                  {selected.max_investment && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[1, 2, 5].map(m => {
                        const val = selected.min_investment * m
                        if (val > selected.max_investment) return null
                        const unaffordable = balanceLoaded && val > balance
                        return (
                          <button
                            key={val}
                            onClick={() => !unaffordable && setAmount(String(val))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${num === val
                                ? 'bg-indigo-600 text-white border-indigo-500'
                                : unaffordable
                                  ? 'bg-white/2 text-white/20 border-white/5 cursor-not-allowed line-through'
                                  : 'bg-white/5 text-white/50 border-white/8 hover:bg-white/10 hover:text-white/80'
                              }`}
                          >
                            {fmt(val)}
                          </button>
                        )
                      })}
                      {balance > 0 && (
                        <button
                          onClick={() => setAmount(String(Math.min(balance, selected.max_investment || balance)))}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-white/8 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 transition-all"
                        >
                          Use max ({fmt(Math.min(balance, selected.max_investment || balance))})
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Error */}
                {amountError && (
                  <div className="flex gap-2 p-3 rounded-xl bg-rose-500/8 border border-rose-500/20">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-300">{amountError}</p>
                  </div>
                )}

                {/* Low balance deposit prompt */}
                {balanceLoaded && balance < selected.min_investment && (
                  <div className="flex gap-2.5 p-3.5 rounded-xl bg-amber-500/6 border border-amber-500/20">
                    <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-300">Not enough balance</p>
                      <p className="text-[11px] text-amber-300/60 mt-0.5">
                        You need {fmt(selected.min_investment)} · you have {fmt(balance)}.
                      </p>
                      <a href="/dashboard/deposit" className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors">
                        <Wallet className="w-3 h-3" /> Deposit Funds →
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Live earnings preview — shows when amount is valid */}
              {num >= selected.min_investment && !amountError && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5"
                >
                  <p className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wide mb-3">What you'll earn</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xs text-white/35 mb-1">Every day</p>
                      <p className="text-lg font-extrabold text-emerald-400">+{fmt(dailyEarning)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35 mb-1">Total profit</p>
                      <p className="text-lg font-extrabold text-sky-400">+{fmt(totalEarning)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35 mb-1">You get back</p>
                      <p className="text-lg font-extrabold text-white">{fmt(totalPayout)}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/30 text-center mt-3">
                    Capital returned in full after {selected.duration} days
                  </p>
                </motion.div>
              )}

              {/* Confirm button */}
              <button
                onClick={handleInvest}
                disabled={!canInvest || investing}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold transition-all duration-200 ${canInvest && !investing
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-white/6 text-white/25 cursor-not-allowed'
                  }`}
              >
                {investing ? (
                  <><RefreshCw className="w-5 h-5 animate-spin" /> Processing your investment…</>
                ) : balanceLoaded && balance < (num || selected.min_investment) ? (
                  <><Lock className="w-5 h-5" /> Insufficient Balance</>
                ) : (
                  <>Confirm Investment of {num >= selected.min_investment ? fmt(num) : fmt(selected.min_investment)} <ArrowRight className="w-5 h-5" /></>
                )}
              </button>

              <p className="text-center text-[11px] text-white/25">
                <Shield className="w-3 h-3 inline mr-1" />
                Your investment is secure · returns credited every 24 hours
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ═══════════════ ACTIVE TAB ═══════════════ */}
      {tab === 'active' && (
        <div className="space-y-4">
          {loadingActive ? (
            <div className="space-y-3">{[1, 2].map(i => <SkeletonCard key={i} />)}</div>
          ) : active.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="p-5 rounded-3xl bg-white/4 border border-white/8">
                <Clock className="w-10 h-10 text-white/15" />
              </div>
              <div>
                <p className="text-white/50 font-semibold">No investments yet</p>
                <p className="text-white/30 text-sm mt-1">Choose a plan to start earning daily returns.</p>
              </div>
              <button
                onClick={() => setTab('plans')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4" /> Browse Plans
              </button>
            </motion.div>
          ) : (
            <>
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Active', value: active.filter(a => a.status === 'active').length, color: 'text-indigo-400' },
                  { label: 'Invested', value: fmt(active.reduce((s, a) => s + Number(a.amount), 0)), color: 'text-emerald-400' },
                  { label: 'Earned', value: fmt(active.reduce((s, a) => s + Number(a.total_earned || 0), 0)), color: 'text-amber-400' },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-2xl bg-white/4 border border-white/6 text-center">
                    <p className={`text-base font-extrabold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {active.map((inv, i) => (
                  <ActiveInvestCard key={inv.id} inv={inv} currency={userCurrency} i={i} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
