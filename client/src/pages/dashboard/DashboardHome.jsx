import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Gift, DollarSign, Copy, Share2, BadgeCheck, Coins, BarChart3, ExternalLink, Settings, Headphones } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import { useToast } from '../../components/ui/Toast'

const holdings = [
  { name: 'Bitcoin', symbol: 'BTC', amount: 0.0425, logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  { name: 'Ethereum', symbol: 'ETH', amount: 1.85, logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { name: 'Solana', symbol: 'SOL', amount: 12.5, logo: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  { name: 'Tether', symbol: 'USDT', amount: 250.00, logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
]

const marketCoins = [
  { name: 'Bitcoin', symbol: 'BTC', price: '$67,432.10', change: '+2.4%', up: true, logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  { name: 'Ethereum', symbol: 'ETH', price: '$3,521.80', change: '+1.8%', up: true, logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { name: 'Solana', symbol: 'SOL', price: '$148.25', change: '+5.2%', up: true, logo: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  { name: 'Cardano', symbol: 'ADA', price: '$0.45', change: '-0.8%', up: false, logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
  { name: 'XRP', symbol: 'XRP', price: '$0.62', change: '+3.1%', up: true, logo: 'https://cryptologos.cc/logos/xrp-xrp-logo.png' },
  { name: 'Polkadot', symbol: 'DOT', price: '$7.84', change: '+4.2%', up: true, logo: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png' },
]

export default function DashboardHome() {
  const { user } = useAuth()
  const toast = useToast()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [prices, setPrices] = useState(marketCoins)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: res } = await api.get('/users/dashboard')
        setData(res)
      } catch (err) {
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

  const cryptoValue = holdings.reduce((sum, h) => {
    const coin = prices.find(p => p.symbol === h.symbol)
    const price = coin ? parseFloat(coin.price.replace(/[$,]/g, '')) : 0
    return sum + h.amount * price
  }, 0)

  const stats = [
    { label: 'Total Balance', value: `$${Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Wallet, gradient: 'card-gradient', shadow: 'shadow-primary/20', iconBg: '' },
    { label: "Today's Earnings", value: `+$${Number(todayEarnings).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: TrendingUp, gradient: 'green-gradient', shadow: 'shadow-green-500/20', iconBg: '' },
    { label: 'Crypto Holdings', value: `$${cryptoValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Coins, gradient: 'bg-gradient-to-br from-purple-500 to-purple-700', shadow: 'shadow-purple-500/20', iconBg: '' },
    { label: 'Active Plans', value: String(activeInvestments), icon: BarChart3, gradient: 'accent-gradient', shadow: 'shadow-accent/20', iconBg: '' },
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
        <h1 className="text-2xl font-bold text-text-primary">Welcome back, {user?.full_name || 'User'}</h1>
        <Card><CardContent className="text-center py-12"><p className="text-danger mb-4">{error}</p><button onClick={() => window.location.reload()} className="text-primary hover:underline text-sm">Try again</button></CardContent></Card>
      </div>
    )
  }

  const isNewUser = balance === 0 && activeInvestments === 0 && todayEarnings === 0

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome back, {user?.full_name || 'User'}
        </h1>
        <p className="text-text-secondary">Track your crypto portfolio and investments</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="relative overflow-hidden group">
                <div className={`absolute inset-0 ${stat.gradient} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity`} />
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[40px] ${stat.gradient} opacity-[0.08]`} />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-sm" />
                <CardHeader>
                  <CardTitle className="text-sm text-text-muted font-medium">{stat.label}</CardTitle>
                  <div className={`w-10 h-10 rounded-xl ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-text-primary">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Crypto Holdings</CardTitle>
              <Coins className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {holdings.map((h) => {
                const coin = prices.find(p => p.symbol === h.symbol)
                const price = coin ? parseFloat(coin.price.replace(/[$,]/g, '')) : 0
                const value = h.amount * price
                const pct = cryptoValue > 0 ? (value / cryptoValue * 100) : 0
                return (
                  <div key={h.symbol} className="flex items-center gap-3 group">
                    <img src={h.logo} alt={h.symbol} className="w-8 h-8 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-text-primary">{h.symbol}</span>
                        <span className="text-sm font-semibold text-text-primary">${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs text-text-muted">{h.amount} {h.symbol}</span>
                        <span className="text-xs text-text-muted">{pct.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-border/50 mt-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${h.symbol === 'BTC' ? 'card-gradient' : h.symbol === 'ETH' ? 'bg-gradient-to-r from-purple-500 to-purple-600' : h.symbol === 'SOL' ? 'bg-gradient-to-r from-cyan-500 to-cyan-600' : 'green-gradient'} transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
              <span className="text-sm font-semibold text-text-primary">Total Crypto Value</span>
              <span className="text-sm font-bold text-text-primary">${cryptoValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Market Prices</CardTitle>
              <ExternalLink className="w-4 h-4 text-text-muted" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {prices.map(coin => (
                <div key={coin.symbol} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface/50 transition-colors">
                  <img src={coin.logo} alt={coin.symbol} className="w-7 h-7 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{coin.name}</p>
                    <p className="text-xs text-text-muted">{coin.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">{coin.price}</p>
                    <p className={`text-xs font-medium ${coin.up ? 'text-success' : 'text-danger'}`}>{coin.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="divide-y divide-border/50">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      tx.type === 'daily_return' || tx.type === 'referral_bonus' ? 'green-gradient' : tx.type === 'deposit' ? 'accent-gradient' : 'card-gradient'
                    }`}>
                      {tx.type === 'daily_return' || tx.type === 'referral_bonus' ? <DollarSign className="w-4 h-4 text-white" /> : tx.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4 text-white" /> : <ArrowUpRight className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary capitalize">{tx.type?.replace(/_/g, ' ') || 'Transaction'}</p>
                      <p className="text-xs text-text-muted">{formatDate(tx.created_at)}</p>
                    </div>
                    <span className={`text-sm font-semibold ${Number(tx.amount) >= 0 ? 'text-success' : 'text-danger'}`}>{Number(tx.amount) >= 0 ? '+' : ''}${Number(tx.amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : isNewUser ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl green-gradient flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Welcome to SmartEdge!</h3>
                <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">You're all set. Start by exploring our investment plans and make your first deposit to begin earning daily returns.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/invest" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl card-gradient text-white font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all"><Wallet className="w-4 h-4" /> Invest Now</Link>
                  <Link to="/wallet" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border text-text-primary font-semibold text-sm hover:bg-surface-hover transition-all"><DollarSign className="w-4 h-4" /> Deposit Funds</Link>
                </div>
              </div>
            ) : (
              <p className="text-text-secondary text-center py-6 text-sm">No recent activity. Start investing to see your transactions here.</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Referral Program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/5 border border-accent/10">
                <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center"><Share2 className="w-5 h-5 text-white" /></div>
                <div><p className="text-sm font-semibold text-text-primary">{referralCount} Referrals</p><p className="text-xs text-text-muted">Earn bonuses for each referral</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                <div className="w-10 h-10 rounded-xl green-gradient flex items-center justify-center"><DollarSign className="w-5 h-5 text-white" /></div>
                <div><p className="text-sm font-semibold text-text-primary">${Number(referralBonus).toFixed(2)}</p><p className="text-xs text-text-muted">Total referral earnings</p></div>
              </div>
              <button onClick={copyReferral} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-text-primary font-medium text-sm hover:bg-surface-hover transition-colors"><Copy className="w-4 h-4" /> Copy Referral Link</button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/invest" className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-surface-hover transition-colors group">
                <div className="w-10 h-10 rounded-xl card-gradient flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow"><TrendingUp className="w-5 h-5 text-white" /></div>
                <div className="flex-1"><p className="text-sm font-medium text-text-primary">Invest Now</p><p className="text-xs text-text-muted">Choose an investment plan</p></div>
                <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
              </Link>
              <Link to="/wallet" className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-surface-hover transition-colors group">
                <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center group-hover:shadow-lg group-hover:shadow-accent/20 transition-shadow"><Wallet className="w-5 h-5 text-white" /></div>
                <div className="flex-1"><p className="text-sm font-medium text-text-primary">Deposit Funds</p><p className="text-xs text-text-muted">Add money to your wallet</p></div>
                <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
              </Link>
              <Link to="/history" className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-surface-hover transition-colors group">
                <div className="w-10 h-10 rounded-xl green-gradient flex items-center justify-center group-hover:shadow-lg group-hover:shadow-green-500/20 transition-shadow"><BadgeCheck className="w-5 h-5 text-white" /></div>
                <div className="flex-1"><p className="text-sm font-medium text-text-primary">Transaction History</p><p className="text-xs text-text-muted">View all your transactions</p></div>
                <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
              </Link>
              <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-surface-hover transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-shadow"><Settings className="w-5 h-5 text-white" /></div>
                <div className="flex-1"><p className="text-sm font-medium text-text-primary">Profile Settings</p><p className="text-xs text-text-muted">Manage your account</p></div>
                <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
              </Link>
              <Link to="/support" className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-surface-hover transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-shadow"><Headphones className="w-5 h-5 text-white" /></div>
                <div className="flex-1"><p className="text-sm font-medium text-text-primary">Contact Support</p><p className="text-xs text-text-muted">Get help when you need it</p></div>
                <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
