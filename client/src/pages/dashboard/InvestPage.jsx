import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, DollarSign, Calendar, Shield, ArrowRight, Check,
  Crown, BarChart3, Percent, Zap, X, Info, Wallet, Clock,
  ChevronRight, Activity, Award, Lock, CheckCircle2, CircleDot,
  RefreshCw, AlertCircle
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { investmentApi, userApi } from '../../services/api'
import { formatCurrency } from '../../lib/utils'
import { useAuth } from '../../hooks/useAuth'

/* ─── Tier palette ─────────────────────────────────────────── */
const TIER_COLORS = [
  { gradient: 'from-indigo-500 to-violet-600', ring: 'ring-indigo-500/40', badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25', stat: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
  { gradient: 'from-sky-500 to-cyan-600', ring: 'ring-sky-500/40', badge: 'bg-sky-500/10 text-sky-300 border-sky-500/25', stat: 'text-sky-400', glow: 'shadow-sky-500/20' },
  { gradient: 'from-emerald-500 to-teal-600', ring: 'ring-emerald-500/40', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25', stat: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  { gradient: 'from-amber-500 to-orange-600', ring: 'ring-amber-500/40', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/25', stat: 'text-amber-400', glow: 'shadow-amber-500/20' },
  { gradient: 'from-rose-500 to-pink-600', ring: 'ring-rose-500/40', badge: 'bg-rose-500/10 text-rose-300 border-rose-500/25', stat: 'text-rose-400', glow: 'shadow-rose-500/20' },
  { gradient: 'from-violet-500 to-purple-600', ring: 'ring-violet-500/40', badge: 'bg-violet-500/10 text-violet-300 border-violet-500/25', stat: 'text-violet-400', glow: 'shadow-violet-500/20' },
  { gradient: 'from-fuchsia-500 to-pink-600', ring: 'ring-fuchsia-500/40', badge: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/25', stat: 'text-fuchsia-400', glow: 'shadow-fuchsia-500/20' },
  { gradient: 'from-lime-500 to-green-600', ring: 'ring-lime-500/40', badge: 'bg-lime-500/10 text-lime-300 border-lime-500/25', stat: 'text-lime-400', glow: 'shadow-lime-500/20' },
  { gradient: 'from-teal-500 to-cyan-600', ring: 'ring-teal-500/40', badge: 'bg-teal-500/10 text-teal-300 border-teal-500/25', stat: 'text-teal-400', glow: 'shadow-teal-500/20' },
  { gradient: 'from-orange-500 to-red-600', ring: 'ring-orange-500/40', badge: 'bg-orange-500/10 text-orange-300 border-orange-500/25', stat: 'text-orange-400', glow: 'shadow-orange-500/20' },
  { gradient: 'from-pink-500 to-rose-600', ring: 'ring-pink-500/40', badge: 'bg-pink-500/10 text-pink-300 border-pink-500/25', stat: 'text-pink-400', glow: 'shadow-pink-500/20' },
  { gradient: 'from-blue-500 to-indigo-600', ring: 'ring-blue-500/40', badge: 'bg-blue-500/10 text-blue-300 border-blue-500/25', stat: 'text-blue-400', glow: 'shadow-blue-500/20' },
  { gradient: 'from-cyan-500 to-sky-600', ring: 'ring-cyan-500/40', badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25', stat: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  { gradient: 'from-red-500 to-rose-600', ring: 'ring-red-500/40', badge: 'bg-red-500/10 text-red-300 border-red-500/25', stat: 'text-red-400', glow: 'shadow-red-500/20' },
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

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-3 rounded-xl bg-white/4 border border-white/5">
              <p className="text-[10px] text-white/40 mb-0.5">Capital</p>
              <p className="text-xs font-bold text-white">{formatCurrency(inv.amount, currency)}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/4 border border-white/5">
              <p className="text-[10px] text-white/40 mb-0.5">Earned</p>
              <p className={`text-xs font-bold ${colors.stat}`}>+{formatCurrency(earned, currency)}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/4 border border-white/5">
              <p className="text-[10px] text-white/40 mb-0.5">Matures</p>
              <p className="text-xs font-bold text-white">{endDate}</p>
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
  }, [amount, selected, balance])

  const canInvest = selected && amount && !amountError && num >= selected.min_investment

  /* ── Handlers ── */
  const selectPlan = (plan) => {
    setSelected(plan)
    setAmount(String(plan.min_investment))
    // Scroll to form
    setTimeout(() => document.getElementById('invest-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
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
    return multiples.map(m => base * m).filter(v => v <= max && (!balanceLoaded || v <= balance))
  }, [selected, balance])

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
            <div className="flex items-center gap-2 text-white/40 text-xs mb-1.5">
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
            onClick={() => setTab(t.key)}
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

          {/* Plan grid */}
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
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white">VIP Tiers</span>
                  <span className="text-white/30">·</span>
                  <span className="text-white/40">{plans.length} levels available for {country}</span>
                </div>
              )}

              <div className={`grid gap-4 ${isVIP ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
                {plans.map((plan, i) => {
                  const colors = TIER_COLORS[i % TIER_COLORS.length]
                  const isChosen = selected?.id === plan.id
                  const dailyRet = plan.min_investment * plan.daily_return / 100
                  const totalRet = dailyRet * plan.duration
                  const payout = plan.min_investment + totalRet
                  const canAfford = !balanceLoaded || plan.min_investment <= balance
                  const isPopular = !isVIP && i === 2

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <div
                        onClick={() => canAfford && selectPlan(plan)}
                        className={`relative overflow-hidden rounded-2xl border transition-all duration-200 ${isChosen
                          ? `border-white/20 shadow-2xl ${colors.glow} ring-1 ${colors.ring} -translate-y-1`
                          : canAfford
                            ? 'border-white/6 hover:border-white/15 hover:-translate-y-0.5 cursor-pointer'
                            : 'border-white/4 opacity-50 cursor-not-allowed'
                          } bg-[#0f1623]`}
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

                        {/* Locked overlay */}
                        {!canAfford && (
                          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl gap-2">
                            <Lock className="w-6 h-6 text-white/50" />
                            <p className="text-xs text-white/50 font-medium">Need {fmt(plan.min_investment)}</p>
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

                          {/* Stats grid */}
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2.5 rounded-xl bg-white/4 border border-white/5">
                              <p className="text-[9px] text-white/35 mb-0.5">Daily</p>
                              <p className={`text-[11px] font-bold ${colors.stat}`}>+{fmt(dailyRet)}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/4 border border-white/5">
                              <p className="text-[9px] text-white/35 mb-0.5">Total</p>
                              <p className="text-[11px] font-bold text-emerald-400">+{fmt(totalRet)}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/4 border border-white/5">
                              <p className="text-[9px] text-white/35 mb-0.5">{plan.duration}d ROI</p>
                              <p className="text-[11px] font-bold text-white">{fmt(payout)}</p>
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

                          {/* CTA */}
                          <button
                            onClick={(e) => { e.stopPropagation(); if (canAfford) selectPlan(plan) }}
                            disabled={!canAfford}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${isChosen
                              ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg ${colors.glow}`
                              : canAfford
                                ? 'bg-white/6 text-white/70 hover:bg-white/10 border border-white/8'
                                : 'bg-white/3 text-white/20 cursor-not-allowed'
                              }`}
                          >
                            {isChosen ? (
                              <><CheckCircle2 className="w-3.5 h-3.5" /> Selected</>
                            ) : canAfford ? (
                              <>Select Plan <ChevronRight className="w-3.5 h-3.5" /></>
                            ) : (
                              <><Lock className="w-3 h-3" /> Insufficient Balance</>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </>
          )}

          {/* ── Investment form (appears when plan selected) ── */}
          <AnimatePresence>
            {selected && (
              <motion.div
                id="invest-form"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20, scale: 0.99 }}
                transition={{ duration: 0.25 }}
              >
                <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#0d1220] shadow-2xl">
                  {/* bg glow */}
                  <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/6 blur-[100px] rounded-full pointer-events-none" />

                  <div className="relative z-10 p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${TIER_COLORS[plans.findIndex(p => p.id === selected.id) % TIER_COLORS.length]?.gradient || 'from-indigo-500 to-violet-600'} shadow-lg`}>
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">Invest in {selected.name}</h3>
                          <p className="text-xs text-white/35 mt-0.5">
                            {selected.daily_return}% daily · {selected.duration} days · Capital returned at maturity
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setSelected(null); setAmount('') }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/6 transition-colors"
                      >
                        <X className="w-4 h-4 text-white/40" />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left: Input form */}
                      <div className="space-y-4">

                        {/* Amount input */}
                        <div>
                          <label className="block text-sm font-semibold text-white/70 mb-2">
                            Investment Amount ({userCurrency})
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 text-sm font-medium pointer-events-none">
                              {userCurrency === 'USD' ? '$' : userCurrency}
                            </span>
                            <input
                              type="number"
                              value={amount}
                              onChange={e => setAmount(e.target.value)}
                              placeholder={`Min ${fmt(selected.min_investment)}`}
                              min={selected.min_investment}
                              max={selected.max_investment || undefined}
                              className={`w-full pl-14 pr-4 py-3.5 bg-white/5 border rounded-xl text-white text-xl font-bold focus:outline-none transition-all placeholder:text-white/20 placeholder:text-base placeholder:font-normal ${amountError
                                ? 'border-rose-500/50 focus:border-rose-500/70 focus:ring-2 focus:ring-rose-500/10'
                                : 'border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10'
                                }`}
                            />
                          </div>
                          {selected.min_investment && selected.max_investment && (
                            <p className="text-[10px] text-white/25 mt-1.5">
                              Range: {fmt(selected.min_investment)} — {fmt(selected.max_investment)}
                            </p>
                          )}
                        </div>

                        {/* Quick amount buttons */}
                        {quickAmounts.length > 1 && (
                          <div>
                            <p className="text-[10px] text-white/35 mb-2 font-medium uppercase tracking-wide">Quick Select</p>
                            <div className="flex flex-wrap gap-2">
                              {quickAmounts.map(val => (
                                <button
                                  key={val}
                                  onClick={() => setAmount(String(val))}
                                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${num === val
                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
                                    : 'bg-white/5 text-white/50 border-white/8 hover:border-indigo-500/30 hover:bg-indigo-500/8 hover:text-white/80'
                                    }`}
                                >
                                  {fmt(val)}
                                </button>
                              ))}
                              {balance > 0 && num !== balance && (
                                <button
                                  onClick={() => setAmount(String(Math.min(balance, selected.max_investment || balance)))}
                                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/8 bg-white/5 text-white/50 hover:border-amber-500/30 hover:bg-amber-500/8 hover:text-white/80 transition-all"
                                >
                                  Max
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Balance display */}
                        <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${num > balance ? 'bg-rose-500/5 border-rose-500/20' : 'bg-white/4 border-white/6'
                          }`}>
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            <Wallet className="w-3.5 h-3.5" />
                            <span>Your balance</span>
                          </div>
                          <span className={`text-sm font-bold ${num > balance ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {fmt(balance)}
                          </span>
                        </div>

                        {/* Error / info messages */}
                        {amountError && (
                          <div className="flex gap-2.5 p-3.5 rounded-xl bg-rose-500/6 border border-rose-500/20">
                            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-rose-300/90">{amountError}</p>
                          </div>
                        )}

                        {isVIP && (
                          <div className="flex gap-2.5 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/15">
                            <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-300/80 leading-relaxed">
                              Your capital plus all earned profits are returned in full after {selected.duration} days. Daily earnings are credited to your wallet every 24 hours.
                            </p>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-3 pt-1">
                          <button
                            onClick={handleInvest}
                            disabled={!canInvest || investing}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${canInvest && !investing
                              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0'
                              : 'bg-white/5 text-white/25 cursor-not-allowed'
                              }`}
                          >
                            {investing ? (
                              <><RefreshCw className="w-4 h-4 animate-spin" /> Processing…</>
                            ) : (
                              <>Invest Now <ArrowRight className="w-4 h-4" /></>
                            )}
                          </button>
                          <button
                            onClick={() => { setSelected(null); setAmount('') }}
                            className="px-5 py-3.5 rounded-xl text-sm font-semibold border border-white/8 text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>

                      {/* Right: Live ROI calculator */}
                      <div className="space-y-4">
                        <p className="text-sm font-semibold text-white/70">Projected Returns</p>

                        {num >= selected.min_investment ? (
                          <>
                            {/* ROI cards */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <CircleDot className="w-3 h-3 text-emerald-500" />
                                  <p className="text-[10px] text-white/40 font-medium uppercase tracking-wide">Daily Profit</p>
                                </div>
                                <p className="text-2xl font-extrabold text-emerald-400">+{fmt(dailyProfit)}</p>
                                <p className="text-[10px] text-emerald-500/60 mt-1">Credited every 24h</p>
                              </div>
                              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <Calendar className="w-3 h-3 text-indigo-400" />
                                  <p className="text-[10px] text-white/40 font-medium uppercase tracking-wide">{selected.duration}-Day Profit</p>
                                </div>
                                <p className="text-2xl font-extrabold text-indigo-400">+{fmt(totalProfit)}</p>
                                <p className="text-[10px] text-indigo-500/60 mt-1">Total earned</p>
                              </div>
                            </div>

                            {/* Total payout card */}
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600/10 via-violet-600/8 to-transparent border border-indigo-500/15">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-white/40 font-medium">Total Payout at Maturity</span>
                                <span className={`text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20`}>
                                  +{roiPct}% ROI
                                </span>
                              </div>
                              <p className="text-3xl font-extrabold text-white">{fmt(totalPayout)}</p>

                              {/* Progress bar showing profit ratio */}
                              <div className="mt-3">
                                <div className="h-1.5 w-full bg-white/8 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                                    style={{ width: `${Math.min(100, (totalProfit / totalPayout) * 100)}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-[10px] text-white/25 mt-1.5">
                                  <span>Capital: {fmt(num)}</span>
                                  <span>Profit: {fmt(totalProfit)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Summary row */}
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { label: 'Capital', value: fmt(num), color: 'text-white' },
                                { label: 'Duration', value: `${selected.duration} days`, color: 'text-white' },
                                { label: 'Daily Rate', value: `${selected.daily_return}%`, color: 'text-emerald-400' },
                              ].map(s => (
                                <div key={s.label} className="text-center p-3 rounded-xl bg-white/4 border border-white/5">
                                  <p className="text-[9px] text-white/25 mb-0.5">{s.label}</p>
                                  <p className={`text-xs font-bold ${s.color}`}>{s.value}</p>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-3 h-52 rounded-2xl border border-dashed border-white/8 bg-white/2">
                            <BarChart3 className="w-9 h-9 text-white/15" />
                            <div className="text-center">
                              <p className="text-sm text-white/30 font-medium">Enter an amount</p>
                              <p className="text-xs text-white/20 mt-0.5">to see your projected returns</p>
                            </div>
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
              <div className="grid grid-cols-3 gap-3">
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
