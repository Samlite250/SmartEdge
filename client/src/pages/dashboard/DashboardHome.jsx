import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Gift, DollarSign, Copy, Share2, BadgeCheck, Coins, BarChart3, ExternalLink, Settings, Headphones, Activity, ArrowDownCircle, ArrowUpCircle, Users, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { useAuth } from '../../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import { useToast } from '../../components/ui/Toast'
import { formatCurrency } from '../../lib/utils'
import { getCountryFlag } from '../../lib/countries'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts'

const holdings = []

const marketCoins = [
  { name: 'Bitcoin', symbol: 'BTC', price: '$67,432.10', change: '+2.4%', up: true, logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  { name: 'Ethereum', symbol: 'ETH', price: '$3,521.80', change: '+1.8%', up: true, logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { name: 'Solana', symbol: 'SOL', price: '$148.25', change: '+5.2%', up: true, logo: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  { name: 'Cardano', symbol: 'ADA', price: '$0.45', change: '-0.8%', up: false, logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
  { name: 'XRP', symbol: 'XRP', price: '$0.62', change: '+3.1%', up: true, logo: 'https://cryptologos.cc/logos/xrp-xrp-logo.png' },
  { name: 'Polkadot', symbol: 'DOT', price: '$7.84', change: '+4.2%', up: true, logo: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png' },
]

const chartData = [
  { name: 'Mon', value: 2400 },
  { name: 'Tue', value: 2800 },
  { name: 'Wed', value: 2600 },
  { name: 'Thu', value: 3400 },
  { name: 'Fri', value: 3200 },
  { name: 'Sat', value: 4100 },
  { name: 'Sun', value: 4600 },
]

export default function DashboardHome() {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [prices, setPrices] = useState(marketCoins)
  const [teamOpen, setTeamOpen] = useState(false)
  const [teamData, setTeamData] = useState(null)
  const [teamLoading, setTeamLoading] = useState(false)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: res } = await api.get('/users/dashboard')
        setData(res)
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        setError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()

    const interval = setInterval(() => {
      setPrices(prev => prev.map(coin => ({
        ...coin,
        price: coin.symbol === 'USDT' ? '$1.00' : `$${(parseFloat(coin.price.replace(/[$,]/g, '')) * (1 + (Math.random() - 0.5) * 0.002)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: coin.symbol === 'USDT' ? '0.0%' : `${(Math.random() > 0.45 ? '+' : '-')}${(Math.random() * 3 + 0.1).toFixed(1)}%`,
        up: Math.random() > 0.45,
      })))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const balance = data?.wallet?.balance ?? 0
  const activeInvestments = data?.investments?.filter(i => i.status === 'active')?.length ?? 0
  const todayEarnings = data?.todayEarnings ?? 0
  const referralBonus = data?.referrals?.reduce((sum, r) => sum + Number(r.bonus || 0), 0) ?? 0
  const referralCount = data?.referrals?.length ?? 0
  const totalProfit = data?.totalProfit ?? (todayEarnings * 12.5 + referralBonus)
  const userCurrency = user?.currency || 'USD'
  const countryFlag = getCountryFlag(user?.country)

  const cryptoValue = holdings.reduce((sum, h) => {
    const coin = prices.find(p => p.symbol === h.symbol)
    const price = coin ? parseFloat(coin.price.replace(/[$,]/g, '')) : 0
    return sum + h.amount * price
  }, 0)

  const stats = [
    { label: 'Balance', value: formatCurrency(balance, userCurrency), icon: Wallet, bgColor: 'bg-[#4285F4]' },
    { label: 'Referral Earnings', value: formatCurrency(referralBonus, userCurrency), icon: Gift, bgColor: 'bg-[#0F9D58]' },
    { label: 'Active Plans', value: String(activeInvestments), icon: Activity, bgColor: 'bg-[#F4B400]' },
    { label: 'Total Profit', value: `${totalProfit >= 0 ? '+' : ''}${formatCurrency(totalProfit, userCurrency)}`, icon: TrendingUp, bgColor: 'bg-[#DB4437]' },
  ]

  const transactions = data?.recentTransactions ?? []

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const copyReferral = () => {
    const link = `${window.location.origin}/register?ref=${user?.referral_code || ''}`
    navigator.clipboard.writeText(link)
    toast('Referral link copied!', 'success')
  }

  const openTeam = useCallback(async () => {
    setTeamOpen(true)
    if (teamData) return
    setTeamLoading(true)
    try {
      const { data: res } = await api.get('/referrals/team')
      setTeamData(res)
    } catch {
      toast('Failed to load team', 'error')
    } finally {
      setTeamLoading(false)
    }
  }, [teamData, toast])

  if (loading) {
    return (
      <div className="space-y-6">
        <div><div className="h-8 w-64 bg-border/50 rounded-lg animate-pulse mb-2" /><div className="h-5 w-48 bg-border/50 rounded-lg animate-pulse" /></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (<Card key={i}><CardContent><div className="h-4 w-24 bg-border/50 rounded animate-pulse mb-3" /><div className="h-8 w-20 bg-border/50 rounded animate-pulse" /></CardContent></Card>))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Card><CardContent><div className="h-48 bg-border/50 rounded-lg animate-pulse" /></CardContent></Card>
          <Card><CardContent><div className="h-48 bg-border/50 rounded-lg animate-pulse" /></CardContent></Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-text-primary">Welcome back{countryFlag ? ` ${countryFlag}` : ''}, {user?.full_name || 'User'}</h1>
        <Card><CardContent className="text-center py-12"><p className="text-danger mb-4">{error}</p><button onClick={() => window.location.reload()} className="text-primary hover:underline text-sm">Try again</button></CardContent></Card>
      </div>
    )
  }

  const isNewUser = balance === 0 && activeInvestments === 0 && todayEarnings === 0

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 bg-[#131A28] p-6 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl font-extrabold text-white flex flex-wrap items-center gap-x-2 gap-y-1"
          >
            <span>Welcome back, {user?.full_name?.split(' ')[0] || 'User'}</span>
            {countryFlag && <span className="inline-block shrink-0">{countryFlag}</span>}
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-text-secondary text-sm md:text-base">
            Your portfolio is up <span className="text-emerald-400 font-semibold">+4.5%</span> this week. Keep it growing.
          </motion.p>
        </div>

      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className={`relative overflow-hidden group rounded-3xl ${stat.bgColor} border border-white/5 p-5 hover:brightness-110 transition-all`}>
                <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 bg-white rounded-full transition-opacity group-hover:opacity-40" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs md:text-sm text-white/90 font-medium mb-1">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-white tracking-tight">{stat.value}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Deposit & Withdraw Action Row */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/wallet" className="flex flex-col items-center justify-center gap-1 py-4 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <ArrowDownCircle className="w-6 h-6" />
          <span>Deposit</span>
        </Link>
        <Link to="/wallet" className="flex flex-col items-center justify-center gap-1 py-4 rounded-xl border-2 border-primary/60 text-primary font-semibold text-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <ArrowUpCircle className="w-6 h-6" />
          <span>Withdraw</span>
        </Link>
        <button onClick={openTeam} className="flex flex-col items-center justify-center gap-1 py-4 rounded-xl border border-white/10 bg-[#1e2738] text-white font-semibold text-sm hover:bg-[#253045] hover:border-white/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <Users className="w-6 h-6 text-purple-400" />
          <span>My Team</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Chart */}
          <div className="bg-[#131A28] rounded-3xl border border-white/5 p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-text-primary">Portfolio Performance</h3>
                <p className="text-sm text-text-muted">Value over the last 7 days</p>
              </div>
              <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/20">
                +15.2%
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Crypto Holdings & Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#131A28] rounded-3xl border border-white/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-text-primary">Your Crypto</h3>
                <Coins className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="space-y-4">
                {holdings.map((h, i) => {
                  const coin = prices.find(p => p.symbol === h.symbol)
                  const price = coin ? parseFloat(coin.price.replace(/[$,]/g, '')) : 0
                  const value = h.amount * price
                  const pct = cryptoValue > 0 ? (value / cryptoValue * 100) : 0
                  return (
                    <motion.div key={h.symbol} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="group">
                      <div className="flex items-center gap-3">
                        <img src={h.logo} alt={h.symbol} className="w-9 h-9 rounded-full bg-white/5 p-1" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-end mb-1">
                            <span className="font-semibold text-text-primary text-sm">{h.symbol}</span>
                            <span className="font-semibold text-text-primary text-sm">{formatCurrency(value, userCurrency)}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ${h.symbol === 'BTC' ? 'bg-orange-500' : h.symbol === 'ETH' ? 'bg-indigo-500' : h.symbol === 'SOL' ? 'bg-cyan-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <div className="bg-[#131A28] rounded-3xl border border-white/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-text-primary">Recent Activity</h3>
                <Link to="/history" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View All</Link>
              </div>
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.slice(0, 4).map((tx, i) => (
                    <motion.div key={tx.id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 group">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-surface border border-white/5 group-hover:border-white/10 transition-colors`}>
                        {tx.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> : <ArrowUpRight className="w-4 h-4 text-orange-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary capitalize truncate">{tx.type?.replace(/_/g, ' ') || 'Transaction'}</p>
                        <p className="text-xs text-text-muted">{formatDate(tx.created_at)}</p>
                      </div>
                      <span className={`text-sm font-semibold ${Number(tx.amount) >= 0 ? 'text-emerald-400' : 'text-text-primary'}`}>
                        {Number(tx.amount) >= 0 ? '+' : ''}{formatCurrency(tx.amount, userCurrency)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <Activity className="w-5 h-5 text-text-muted" />
                  </div>
                  <p className="text-sm text-text-secondary">No activity yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Market Watch */}
          <div className="bg-[#131A28] rounded-3xl border border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text-primary">Market Watch</h3>
              <ExternalLink className="w-4 h-4 text-text-muted" />
            </div>
            <div className="space-y-3">
              {prices.map(coin => (
                <div key={coin.symbol} className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                  <img src={coin.logo} alt={coin.symbol} className="w-8 h-8 rounded-full bg-white/10 p-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-primary">{coin.symbol}</p>
                    <p className="text-xs text-text-muted truncate">{coin.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">{coin.price}</p>
                    <div className="flex items-center justify-end gap-1">
                      {coin.up ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />}
                      <p className={`text-xs font-bold ${coin.up ? 'text-emerald-400' : 'text-red-400'}`}>{coin.change}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Glowing Referral Card */}
          <div className="relative rounded-3xl p-px bg-gradient-to-b from-indigo-500 to-purple-600 overflow-hidden group hover:shadow-lg hover:shadow-indigo-500/25 transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-background rounded-[23px] p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-base font-bold text-text-primary mb-1">Invite & Earn</h4>
              <p className="text-sm text-text-secondary mb-4">Earn bonuses by referring friends to SmartEdge.</p>
              <button onClick={copyReferral} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-white/10 text-white font-medium text-sm hover:bg-white/5 transition-colors">
                <Copy className="w-4 h-4" /> Copy Link
              </button>
            </div>
          </div>

        </div>
      </div>

      <Modal open={teamOpen} onClose={() => setTeamOpen(false)} title="My Team">
        {teamLoading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : teamData?.team?.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center p-3 rounded-2xl bg-white/5">
                <p className="text-xl font-bold text-white">{teamData.stats.totalMembers}</p>
                <p className="text-[11px] text-text-muted mt-0.5">Members</p>
              </div>
              <div className="text-center p-3 rounded-2xl bg-white/5">
                <p className="text-xl font-bold text-emerald-400">{teamData.stats.paidBonuses}</p>
                <p className="text-[11px] text-text-muted mt-0.5">Paid</p>
              </div>
              <div className="text-center p-3 rounded-2xl bg-white/5">
                <p className="text-xl font-bold text-amber-400">{formatCurrency(teamData.stats.totalBonusEarned, userCurrency)}</p>
                <p className="text-[11px] text-text-muted mt-0.5">Earned</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-2.5 px-2 text-xs font-semibold text-text-muted uppercase tracking-wider">Username</th>
                    <th className="text-left py-2.5 px-2 text-xs font-semibold text-text-muted uppercase tracking-wider">Earned</th>
                    <th className="text-left py-2.5 px-2 text-xs font-semibold text-text-muted uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {teamData.team.map((m, i) => (
                    <tr key={m.id || i} className="border-b border-white/5 last:border-0">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-bold text-xs">{m.referred?.full_name?.charAt(0)?.toUpperCase() || '?'}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate">{m.referred?.full_name || 'Unknown'}</p>
                            <p className="text-text-muted text-[11px] truncate">{m.referred?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`font-semibold ${Number(m.bonus) > 0 ? 'text-emerald-400' : 'text-text-muted'}`}>
                          {Number(m.bonus) > 0 ? `+${formatCurrency(m.bonus, userCurrency)}` : '—'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-text-muted text-xs whitespace-nowrap">
                        {m.referred?.created_at ? new Date(m.referred.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-text-muted" />
            </div>
            <p className="text-text-secondary font-medium mb-1">No members yet</p>
            <p className="text-xs text-text-muted">Share your referral link to start building your team</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
