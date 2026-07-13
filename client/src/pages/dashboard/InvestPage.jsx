import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, DollarSign, Calendar, Shield, ArrowRight, Check,
  Crown, BarChart3, Percent, Zap, X, Info, Wallet, Clock,
  ChevronRight, Activity, Award, Lock, CheckCircle2, CircleDot,
  RefreshCw, AlertCircle, ArrowLeft
} from 'lucide-react'
import { useToast } from '../../components/ui/Toast'
import { investmentApi, userApi } from '../../services/api'
import { formatCurrency } from '../../lib/utils'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

/* ─── Tier palette ─────────────────────────────────────────── */
const TIER_COLORS = [
  { gradient: 'from-indigo-500 to-violet-600', ring: 'ring-indigo-500/40', badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25', stat: 'text-indigo-400', glow: 'shadow-indigo-500/20', light: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)' },
  { gradient: 'from-sky-500 to-cyan-600', ring: 'ring-sky-500/40', badge: 'bg-sky-500/10 text-sky-300 border-sky-500/25', stat: 'text-sky-400', glow: 'shadow-sky-500/20', light: 'rgba(14,165,233,0.12)', border: 'rgba(14,165,233,0.3)' },
  { gradient: 'from-emerald-500 to-teal-600', ring: 'ring-emerald-500/40', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25', stat: 'text-emerald-400', glow: 'shadow-emerald-500/20', light: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
  { gradient: 'from-amber-500 to-orange-600', ring: 'ring-amber-500/40', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/25', stat: 'text-amber-400', glow: 'shadow-amber-500/20', light: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  { gradient: 'from-rose-500 to-pink-600', ring: 'ring-rose-500/40', badge: 'bg-rose-500/10 text-rose-300 border-rose-500/25', stat: 'text-rose-400', glow: 'shadow-rose-500/20', light: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.3)' },
  { gradient: 'from-violet-500 to-purple-600', ring: 'ring-violet-500/40', badge: 'bg-violet-500/10 text-violet-300 border-violet-500/25', stat: 'text-violet-400', glow: 'shadow-violet-500/20', light: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)' },
  { gradient: 'from-fuchsia-500 to-pink-600', ring: 'ring-fuchsia-500/40', badge: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/25', stat: 'text-fuchsia-400', glow: 'shadow-fuchsia-500/20', light: 'rgba(240,79,216,0.12)', border: 'rgba(240,79,216,0.3)' },
]

/* ─── Risk badge styling ────────────────────────────────────── */
const RISK_STYLE = {
  low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  high: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
}

/* ─── Skeleton card ─────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0f1623] overflow-hidden animate-pulse">
      <div className="h-1 w-full bg-white/10 rounded-t" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 w-28 bg-white/10 rounded" />
          <div className="h-6 w-14 bg-white/10 rounded-full" />
        </div>
        <div className="h-7 w-36 bg-white/10 rounded" />
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl" />)}
        </div>
        <div className="h-9 bg-white/5 rounded-xl" />
      </div>
    </div>
  )
}

/* ─── Active investment card ────────────────────────────────── */
function ActiveInvestCard({ inv, currency, i }) {
  const plan = inv.investment_plans || {}
  const colors = TIER_COLORS[i % TIER_COLORS.length]
  const pct = plan.duration ? Math.min(100, Math.round((inv.days_passed || 0) / plan.duration * 100)) : 0
  const endDate = inv.end_date ? new Date(inv.end_date).toLocaleDateString() : '—'
  const earned = Number(inv.total_earned) || 0
  const expected = Number(inv.total_expected_return) || 0

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
      <div className={`relative overflow-hidden rounded-2xl border border-white/8 bg-[#0f1623] ring-1 ${colors.ring} shadow-lg ${colors.glow}`}>
        <div className={`h-1 w-full bg-gradient-to-r ${colors.gradient}`} />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="font-bold text-white text-sm">{plan.name || 'Investment Plan'}</p>
              <p className="text-xs text-white/40 mt-0.5">Started {new Date(inv.start_date || inv.created_at).toLocaleDateString()}</p>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${inv.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' :
              inv.status === 'completed' ? 'bg-sky-500/10 text-sky-400 border-sky-500/25' :
                'bg-white/5 text-white/40 border-white/10'
              }`}>
              {inv.status === 'active' ? '● Active' : inv.status === 'completed' ? '✓ Completed' : inv.status}
            </span>
          </div>

          <div className="hidden sm:grid grid-cols-3 gap-1.5 mb-4">
            <div className="text-center py-2.5 px-1 rounded-lg bg-white/4 border border-white/5">
              <p className="text-[10px] text-white/40 mb-0.5">Capital</p>
              <p className="text-xs font-bold text-white truncate px-0.5">{formatCurrency(inv.amount, currency)}</p>
            </div>
            <div className="text-center py-2.5 px-1 rounded-lg bg-white/4 border border-white/5">
              <p className="text-[10px] text-white/40 mb-0.5">Earned</p>
              <p className={`text-xs font-bold ${colors.stat} truncate px-0.5`}>+{formatCurrency(earned, currency)}</p>
            </div>
            <div className="text-center py-2.5 px-1 rounded-lg bg-white/4 border border-white/5">
              <p className="text-[10px] text-white/40 mb-0.5">Matures</p>
              <p className="text-xs font-bold text-white truncate px-0.5">{endDate}</p>
            </div>
          </div>
          {/* Mobile: stacked rows */}
          <div className="sm:hidden space-y-1.5 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/40">Capital</span>
              <span className="text-xs font-bold text-white">{formatCurrency(inv.amount, currency)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/40">Earned</span>
              <span className={`text-xs font-bold ${colors.stat}`}>+{formatCurrency(earned, currency)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/40">Matures</span>
              <span className="text-xs font-bold text-white">{endDate}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-[10px] text-white/40 mb-1.5">
              <span>Progress</span>
              <span>{pct}% · {inv.days_passed || 0}/{plan.duration || '–'} days</span>
            </div>
            <div className="h-1.5 w-full bg-white/8 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${colors.gradient} transition-all duration-700`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] mt-1.5">
              <span className="text-white/30">+{formatCurrency(earned, currency)} earned</span>
              <span className="text-white/30">+{formatCurrency(expected, currency)} goal</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Main page ─────────────────────────────────────────────── */
export default function InvestPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('plans')       // 'plans' | 'active'
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
  const isVIP = plans.length > 0 && plans[0]?.is_vip
  const fmt = (v) => formatCurrency(v, userCurrency)

  /* ── Load data ── */
  useEffect(() => {
    setLoading(true)
    Promise.all([
      investmentApi.getPlans(country),
      userApi.getDashboard().catch(() => null),
    ])
      .then(([plansData, dashboard]) => {
        setPlans(plansData)
        if (dashboard?.wallet) {
          setBalance(Number(dashboard.wallet.balance) || 0)
        }
        setBalanceLoaded(true)
      })
      .catch(() => toast('Failed to load investment plans', 'error'))
      .finally(() => setLoading(false))
  }, [country])

  /* ── Load active investments when tab switches ── */
  useEffect(() => {
    if (tab === 'active' && active.length === 0) {
      setLoadingActive(true)
      investmentApi.getActive()
        .then(setActive)
        .catch(() => toast('Failed to load active investments', 'error'))
        .finally(() => setLoadingActive(false))
    }
  }, [tab])

  /* ── Derived values ── */
  const num = parseFloat(amount) || 0
  const dailyProfit = selected ? num * (selected.daily_return / 100) : 0
  const totalProfit = selected ? dailyProfit * selected.duration : 0
  const totalPayout = num + totalProfit
  const roiPct = selected ? (selected.daily_return * selected.duration).toFixed(1) : 0

  const amountError = useMemo(() => {
    if (!selected || !amount) return null
    if (num < selected.min_investment) return `Minimum is ${fmt(selected.min_investment)}`
    if (selected.max_investment && num > selected.max_investment) return `Maximum is ${fmt(selected.max_investment)}`
    if (num > balance && balanceLoaded) return `Insufficient balance — you have ${fmt(balance)}`
    return null
  }, [amount, selected, balance, balanceLoaded])

  const canInvest = selected && amount && !amountError && num >= selected.min_investment

  /* ── Handlers ── */
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
      toast('🎉 Investment placed successfully!', 'success')
      setBalance(b => b - num)
      // Add optimistic active record
      setActive(prev => [{
        id: `optimistic_${Date.now()}`,
        plan_id: selected.id,
        amount: num,
        daily_return: dailyProfit,
        total_earned: 0,
        total_expected_return: totalProfit,
        duration: selected.duration,
        days_passed: 0,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + selected.duration * 86400000).toISOString(),
        investment_plans: { name: selected.name, duration: selected.duration },
        created_at: new Date().toISOString(),
      }, ...prev])
      setSelected(null)
      setAmount('')
    } catch (err) {
      toast(err.response?.data?.error || 'Investment failed. Please try again.', 'error')
    } finally {
      setInvesting(false)
    }
  }

  const quickAmounts = useMemo(() => {
    if (!selected) return []
    const base = selected.min_investment
    const max = selected.max_investment || Infinity
    const multiples = [1, 2, 5, 10]
    return multiples.map(m => base * m).filter(v => v <= max)
  }, [selected])

  /* ══════════════════════════════════════════════════════════ */
  return (
    <div className="space-y-6 pb-10">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#141b2d] via-[#111827] to-[#0b1120] border border-white/5 p-6 md:p-8">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-600/12 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-emerald-600/8 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Investment Plans</h1>
            </div>
            <p className="text-white/50 text-sm max-w-lg leading-relaxed">
              {isVIP
                ? `Choose your VIP tier and earn 10% daily returns in ${userCurrency}. Capital + profits returned after 30 days.`
                : 'Select a plan and start earning daily returns. Your capital is returned at maturity.'}
            </p>
            <div className="flex flex-wrap gap-2.5 mt-4">
              {[
                { icon: <Percent className="w-3 h-3 text-emerald-400" />, label: isVIP ? '10% Daily Returns' : 'Daily Returns' },
                { icon: <Shield className="w-3 h-3 text-sky-400" />, label: 'Capital Protected' },
                { icon: <Zap className="w-3 h-3 text-amber-400" />, label: 'Instant Activation' },
              ].map(b => (
                <span key={b.label} className="flex items-center gap-1.5 text-xs text-white/60 px-3 py-1.5 rounded-full bg-white/5 border border-white/8">
                  {b.icon}{b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Balance pill */}
          <div className="p-4 rounded-2xl bg-white/4 border border-white/8 min-w-[160px]">
            <div className="flex items-center gap-2 text-white/40 text-xs mb-1.5 font-medium">
              <Wallet className="w-3.5 h-3.5" /> Available Balance
            </div>
            <p className="text-2xl font-extrabold text-white">{fmt(balance)}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{userCurrency} · Ready to invest</p>
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex gap-1 p-1 rounded-2xl bg-white/4 border border-white/6 w-fit">
        {[
          { key: 'plans', label: 'Plans', icon: <BarChart3 className="w-4 h-4" /> },
          { key: 'active', label: 'My Investments', icon: <Activity className="w-4 h-4" /> },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSelected(null); setAmount('') }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.key
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-white/40 hover:text-white/70'
              }`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ═══════════ Plans tab ═══════════ */}
      {tab === 'plans' && (
        <div className="space-y-6">

          {/* Plan grid — hidden when a plan is selected */}
          <AnimatePresence mode="wait">
            {!selected && (
              <motion.div
                key="plan-grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {loading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                  </div>
                ) : plans.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="p-5 rounded-3xl bg-white/4 border border-white/8 mb-4">
                      <BarChart3 className="w-10 h-10 text-white/20" />
                    </div>
                    <p className="text-white/50 font-medium">No investment plans available</p>
                    <p className="text-white/30 text-sm mt-1">Plans may not be configured for your region yet.</p>
                  </div>
                ) : (
                  <>
                    {isVIP && (
                      <div className="flex items-center gap-2 text-sm mb-4">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-white">VIP Tiers</span>
                        <span className="text-white/30">·</span>
                        <span className="text-white/40">{plans.length} levels available for {country}</span>
                      </div>
                    )}

                    <div className={`grid gap-4 ${isVIP ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
                      {plans.map((plan, i) => {
                        const colors = TIER_COLORS[i % TIER_COLORS.length]
                        const dailyRet = plan.min_investment * plan.daily_return / 100
                        const totalRet = dailyRet * plan.duration
                        const payout = plan.min_investment + totalRet
                        const isPopular = !isVIP && i === 2

                        // Low Balance Mismatch Calculation
                        const isLowBalance = balanceLoaded && balance < plan.min_investment
                        const diff = plan.min_investment - balance

                        return (
                          <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                          >
                            <div
                              onClick={() => {
                                if (isLowBalance) {
                                  navigate(`/wallet?action=deposit&amount=${diff}`)
                                } else {
                                  selectPlan(plan)
                                }
                              }}
                              className="relative overflow-hidden rounded-2xl border border-white/6 hover:border-white/15 hover:-translate-y-0.5 bg-[#0f1623] transition-all duration-200 cursor-pointer"
                            >
                              {/* Top accent bar */}
                              <div className={`h-1 w-full bg-gradient-to-r ${colors.gradient}`} />

                              {/* Popular badge */}
                              {isPopular && (
                                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg">
                                  <Award className="w-2.5 h-2.5 text-white" />
                                  <span className="text-[9px] font-extrabold text-white uppercase tracking-wide">Popular</span>
                                </div>
                              )}

                              <div className="p-5 space-y-4">
                                {/* Header row */}
                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    <p className="font-bold text-white text-sm leading-tight">{plan.name}</p>
                                    {isVIP
                                      ? <p className="text-[10px] text-white/35 mt-0.5">Tier {i + 1}</p>
                                      : <p className="text-[10px] text-white/35 mt-0.5 capitalize">{plan.risk_level} risk</p>
                                    }
                                  </div>
                                  <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${colors.badge}`}>
                                    {plan.daily_return}%/day
                                  </span>
                                </div>

                                {/* Investment range */}
                                <div className="p-3 rounded-xl bg-white/4 border border-white/5">
                                  <p className="text-[10px] text-white/35 mb-0.5">
                                    {isVIP ? 'Fixed Amount' : 'Investment Range'}
                                  </p>
                                  <p className="text-lg font-extrabold text-white leading-tight">
                                    {fmt(plan.min_investment)}
                                    {!isVIP && plan.max_investment && (
                                      <span className="text-sm font-medium text-white/35"> — {fmt(plan.max_investment)}</span>
                                    )}
                                  </p>
                                </div>

                                {/* Stats grid - 3-col on sm+, stacked rows on mobile */}
                                <div className="hidden sm:grid grid-cols-3 gap-1.5 text-center">
                                  <div className="py-2 px-1 rounded-lg bg-white/4 border border-white/5">
                                    <p className="text-[9px] text-white/35 mb-0.5">Daily</p>
                                    <p className={`text-[11px] font-bold ${colors.stat} truncate px-0.5`}>+{fmt(dailyRet)}</p>
                                  </div>
                                  <div className="py-2 px-1 rounded-lg bg-white/4 border border-white/5">
                                    <p className="text-[9px] text-white/35 mb-0.5">Total</p>
                                    <p className={`text-[11px] font-bold text-emerald-400 truncate px-0.5`}>+{fmt(totalRet)}</p>
                                  </div>
                                  <div className="py-2 px-1 rounded-lg bg-white/4 border border-white/5">
                                    <p className="text-[9px] text-white/35 mb-0.5">{plan.duration}d ROI</p>
                                    <p className={`text-[11px] font-bold text-white truncate px-0.5`}>{fmt(payout)}</p>
                                  </div>
                                </div>
                                {/* Mobile: compact rows */}
                                <div className="sm:hidden space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-white/35">Daily Interest</span>
                                    <span className={`text-[11px] font-bold ${colors.stat}`}>+{fmt(dailyRet)}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-white/35">Total Profit</span>
                                    <span className="text-[11px] font-bold text-emerald-400">+{fmt(totalRet)}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-white/35">{plan.duration}d Payout</span>
                                    <span className="text-[11px] font-bold text-white">{fmt(payout)}</span>
                                  </div>
                                </div>

                                {/* Features (non-VIP) */}
                                {!isVIP && plan.features?.length > 0 && (
                                  <ul className="space-y-1.5">
                                    {plan.features.slice(0, 3).map(f => (
                                      <li key={f} className="flex items-center gap-2 text-[11px] text-white/45">
                                        <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />{f}
                                      </li>
                                    ))}
                                  </ul>
                                )}

                                {/* Low Balance Mismatch Banner */}
                                {isLowBalance && (
                                  <div className="flex items-center gap-1.5 justify-center py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-400 animate-pulse">
                                    <Lock className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                                    <span>Need {fmt(diff)} more to invest</span>
                                  </div>
                                )}

                                {/* CTA Button: Green Background */}
                                {isLowBalance ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      navigate(`/wallet?action=deposit&amount=${diff}`)
                                    }}
                                    className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-md shadow-emerald-500/20 transition-all duration-200"
                                  >
                                    <Wallet className="w-3.5 h-3.5" /> Deposit & Invest <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); selectPlan(plan) }}
                                    className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-md shadow-emerald-500/20 transition-all duration-200"
                                  >
                                    Select Plan <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Checkout Flow (Centered, premium single-column focused wizard) ── */}
          <AnimatePresence>
            {selected && (
              <motion.div
                key="focused-checkout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="max-w-xl mx-auto"
              >
                <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#0d1220] shadow-2xl">
                  {/* Subtle color glow matching selected plan's theme */}
                  {(() => {
                    const idx = plans.findIndex(p => p.id === selected.id)
                    const c = TIER_COLORS[idx % TIER_COLORS.length] || TIER_COLORS[0]
                    return (
                      <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${c.gradient} opacity-[0.06] blur-[80px] pointer-events-none rounded-full`} />
                    )
                  })()}

                  <div className="p-6 md:p-8 space-y-6">
                    {/* Header with quick back button */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => { setSelected(null); setAmount('') }}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/6 text-white/60 hover:text-white transition-colors"
                          title="Back to plans"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div>
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Checkout</span>
                          <h2 className="text-lg font-bold text-white fill-none mt-0.5">{selected.name}</h2>
                        </div>
                      </div>
                      <button
                        onClick={() => { setSelected(null); setAmount('') }}
                        className="text-white/30 hover:text-white/60 transition-colors p-2"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Step Card Summary */}
                    <div className="rounded-2xl bg-white/4 border border-white/6 p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-white/40 text-xs">Plan Duration</span>
                        <p className="text-sm font-bold text-white flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {selected.duration} Days Setup
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="text-white/40 text-xs">Daily ROI Rate</span>
                        <p className="text-sm font-extrabold text-emerald-400 flex items-center gap-1 justify-end">
                          <Percent className="w-3.5 h-3.5" /> {selected.daily_return}%
                        </p>
                      </div>
                    </div>

                    {/* Amount Input Section */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-white/50 mb-2">
                          <span className="font-semibold text-white/70">Enter Investment Amount</span>
                          <span>Min: {fmt(selected.min_investment)}</span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-white/20 pointer-events-none">
                            {userCurrency === 'USD' ? '$' : userCurrency}
                          </span>
                          <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder={String(selected.min_investment)}
                            min={selected.min_investment}
                            max={selected.max_investment || undefined}
                            className={`w-full pl-11 pr-4 py-4 bg-white/5 border rounded-2xl text-2xl font-extrabold text-white focus:outline-none transition-all placeholder:text-white/10 ${amountError
                              ? 'border-rose-500/50 focus:border-rose-500/70 focus:ring-4 focus:ring-rose-500/10'
                              : 'border-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10'
                              }`}
                          />
                        </div>
                      </div>

                      {/* Quick Presets */}
                      {quickAmounts.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold block">Quick Amount Options</span>
                          <div className="flex flex-wrap gap-2">
                            {quickAmounts.map(val => {
                              const unaffordable = balanceLoaded && val > balance
                              const isActive = num === val
                              return (
                                <button
                                  key={val}
                                  onClick={() => !unaffordable && setAmount(String(val))}
                                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${isActive
                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                                    : unaffordable
                                      ? 'bg-white/2 text-white/20 border-white/5 cursor-not-allowed line-through'
                                      : 'bg-white/5 text-white/40 border-white/8 hover:bg-white/10 hover:text-white/70'
                                    }`}
                                >
                                  {fmt(val)}
                                </button>
                              )
                            })}
                            {balance > 0 && num !== balance && (
                              <button
                                onClick={() => setAmount(String(Math.min(balance, selected.max_investment || balance)))}
                                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-white/8 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 transition-all"
                              >
                                Max
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Live Calculations Panel */}
                    {num >= selected.min_investment && !amountError && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4 sm:p-5 space-y-3"
                      >
                        <p className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">Earnings Calculation</p>
                        {/* Mobile: row layout. sm+: 3-col grid */}
                        <div className="hidden sm:grid grid-cols-3 gap-3 text-center">
                          <div className="space-y-1">
                            <span className="text-[10px] text-white/35 block">Daily Interest</span>
                            <p className="text-sm font-extrabold text-emerald-400">+{fmt(dailyProfit)}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-white/35 block">Net Profit</span>
                            <p className="text-sm font-extrabold text-indigo-400">+{fmt(totalProfit)}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-white/35 block">Total Payout</span>
                            <p className="text-sm font-extrabold text-white">{fmt(totalPayout)}</p>
                          </div>
                        </div>
                        {/* Mobile stacked rows */}
                        <div className="sm:hidden space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-white/40">Daily Interest</span>
                            <p className="text-sm font-extrabold text-emerald-400">+{fmt(dailyProfit)}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-white/40">Net Profit</span>
                            <p className="text-sm font-extrabold text-indigo-400">+{fmt(totalProfit)}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-white/40">Total Payout</span>
                            <p className="text-sm font-extrabold text-white">{fmt(totalPayout)}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-white/30 pt-3 border-t border-emerald-500/10">
                          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400/80" /> Capital Protected</span>
                          <span>ROI: +{roiPct}%</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Warning Alerts */}
                    <div className="space-y-3">
                      {amountError && (
                        <div className="flex gap-2.5 p-3.5 rounded-xl bg-rose-500/8 border border-rose-500/20">
                          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-rose-300">{amountError}</p>
                        </div>
                      )}

                      {/* Not enough balance notification */}
                      {balanceLoaded && balance < selected.min_investment && (
                        <div className="flex gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15">
                          <Lock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold text-amber-400">Low Balance Alert</h4>
                            <p className="text-[11px] text-amber-400/70 mt-1 leading-relaxed">
                              You have {fmt(balance)} available, but this plan requires at least {fmt(selected.min_investment)}.
                            </p>
                            <a
                              href="/wallet?action=deposit"
                              className="inline-flex items-center gap-1.5 mt-2.5 text-[11px] font-extrabold text-amber-400 hover:text-amber-300 transition-colors"
                            >
                              <Wallet className="w-3 h-3" /> Quick Deposit →
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Final Action Button */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={handleInvest}
                        disabled={!canInvest || investing}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all ${canInvest && !investing
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0'
                          : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                          }`}
                      >
                        {investing ? (
                          <><RefreshCw className="w-4 h-4 animate-spin" /> Starting Investment...</>
                        ) : balanceLoaded && balance < (num || selected.min_investment) ? (
                          <><Lock className="w-4 h-4" /> Insufficient Balance</>
                        ) : (
                          <>Unlock investment plan for {num >= selected.min_investment ? fmt(num) : fmt(selected.min_investment)} <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                      <button
                        onClick={() => { setSelected(null); setAmount('') }}
                        className="sm:w-auto px-5 py-4 rounded-2xl text-xs font-bold border border-white/8 text-white/40 hover:text-white/60 hover:bg-white/5 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ═══════════ Active Investments tab ═══════════ */}
      {tab === 'active' && (
        <div className="space-y-4">
          {loadingActive ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : active.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="p-5 rounded-3xl bg-white/4 border border-white/8">
                <Clock className="w-10 h-10 text-white/20" />
              </div>
              <div>
                <p className="text-white/50 font-semibold">No active investments yet</p>
                <p className="text-white/30 text-sm mt-1">Choose a plan from the Plans tab to get started.</p>
              </div>
              <button
                onClick={() => setTab('plans')}
                className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4" /> Browse Plans
              </button>
            </motion.div>
          ) : (
            <>
              {/* Summary stats */}
              <div className="hidden sm:grid grid-cols-3 gap-3">
                {[
                  {
                    label: 'Active Plans',
                    value: active.filter(a => a.status === 'active').length,
                    icon: <Activity className="w-4 h-4 text-indigo-400" />,
                    color: 'text-indigo-400',
                  },
                  {
                    label: 'Total Invested',
                    value: fmt(active.reduce((s, a) => s + Number(a.amount), 0)),
                    icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
                    color: 'text-emerald-400',
                  },
                  {
                    label: 'Total Earned',
                    value: fmt(active.reduce((s, a) => s + Number(a.total_earned || 0), 0)),
                    icon: <TrendingUp className="w-4 h-4 text-amber-400" />,
                    color: 'text-amber-400',
                  },
                ].map(s => (
                  <div key={s.label} className="p-4 rounded-2xl bg-white/4 border border-white/6 text-center">
                    <div className="flex justify-center mb-1.5">{s.icon}</div>
                    <p className={`text-lg font-extrabold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Mobile summary: horizontal row */}
              <div className="sm:hidden flex items-center gap-2 p-3 rounded-2xl bg-white/4 border border-white/6">
                <div className="flex-1 text-center border-r border-white/10">
                  <p className="text-base font-extrabold text-indigo-400">{active.filter(a => a.status === 'active').length}</p>
                  <p className="text-[9px] text-white/30">Plans</p>
                </div>
                <div className="flex-1 text-center border-r border-white/10">
                  <p className="text-xs font-extrabold text-emerald-400">{fmt(active.reduce((s, a) => s + Number(a.amount), 0))}</p>
                  <p className="text-[9px] text-white/30">Invested</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-xs font-extrabold text-amber-400">{fmt(active.reduce((s, a) => s + Number(a.total_earned || 0), 0))}</p>
                  <p className="text-[9px] text-white/30">Earned</p>
                </div>
              </div>

              {/* Investment cards */}
              <div className="grid sm:grid-cols-2 gap-4">
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
