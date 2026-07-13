import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, ArrowDownCircle, ArrowUpCircle, RefreshCw, Gift,
  TrendingUp, Filter, ChevronDown, Search
} from 'lucide-react'
import { Card, CardContent } from '../../components/ui/Card'
import { walletApi } from '../../services/api'
import { formatDateTime, formatCurrency, getStatusColor } from '../../lib/utils'
import { useAuth } from '../../hooks/useAuth'

const TYPE_META = {
  deposit: {
    label: 'Deposit',
    icon: ArrowDownCircle,
    colorClass: 'bg-emerald-500/15 text-emerald-400',
    sign: '+',
    signColor: 'text-emerald-400',
  },
  withdrawal: {
    label: 'Withdrawal',
    icon: ArrowUpCircle,
    colorClass: 'bg-rose-500/15 text-rose-400',
    sign: '-',
    signColor: 'text-rose-400',
  },
  investment: {
    label: 'Investment',
    icon: TrendingUp,
    colorClass: 'bg-blue-500/15 text-blue-400',
    sign: '-',
    signColor: 'text-blue-400',
  },
  daily_return: {
    label: 'Daily Return',
    icon: RefreshCw,
    colorClass: 'bg-indigo-500/15 text-indigo-400',
    sign: '+',
    signColor: 'text-indigo-400',
  },
  referral_bonus: {
    label: 'Referral Bonus',
    icon: Gift,
    colorClass: 'bg-amber-500/15 text-amber-400',
    sign: '+',
    signColor: 'text-amber-400',
  },
  transfer: {
    label: 'Transfer',
    icon: RefreshCw,
    colorClass: 'bg-slate-500/15 text-slate-400',
    sign: '',
    signColor: 'text-text-primary',
  },
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'deposit', label: 'Deposits' },
  { key: 'withdrawal', label: 'Withdrawals' },
  { key: 'daily_return', label: 'Returns' },
  { key: 'investment', label: 'Investments' },
  { key: 'referral_bonus', label: 'Referrals' },
]

function TxSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/30 bg-surface animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-border/50 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-border/50 rounded w-32" />
        <div className="h-3 bg-border/50 rounded w-48" />
      </div>
      <div className="space-y-2 text-right">
        <div className="h-4 bg-border/50 rounded w-20 ml-auto" />
        <div className="h-3 bg-border/50 rounded w-14 ml-auto" />
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  // Resolve to user's actual local currency, not USD default
  const userCurrency = user?.currency && user.currency !== 'USD' ? user.currency : (user?.currency || 'USD')

  useEffect(() => {
    walletApi.getTransactions(1, 200)
      .then(res => setTransactions(res.data || []))
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  const filtered = transactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.type === filter
    const matchesSearch = !search || (
      tx.type?.replace(/_/g, ' ').toLowerCase().includes(search.toLowerCase()) ||
      tx.description?.toLowerCase().includes(search.toLowerCase()) ||
      tx.reference?.toLowerCase().includes(search.toLowerCase())
    )
    return matchesFilter && matchesSearch
  })

  const counts = FILTERS.reduce((acc, f) => {
    acc[f.key] = f.key === 'all' ? transactions.length : transactions.filter(tx => tx.type === f.key).length
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Transaction History</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {loading ? 'Loading transactions…' : `${transactions.length} transaction${transactions.length !== 1 ? 's' : ''} total`}
          </p>
        </div>
        {/* Search */}
        <div className="relative max-w-xs w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions…"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border/50 bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filter === f.key
              ? 'card-gradient text-white shadow-md'
              : 'bg-surface text-text-secondary hover:bg-border border border-border/50'
              }`}
          >
            {f.label}
            <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-bold ${filter === f.key ? 'bg-white/20' : 'bg-border'}`}>
              {counts[f.key] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Transaction list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <TxSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-surface border border-border/50 flex items-center justify-center mb-4">
            <Clock className="w-7 h-7 text-text-muted" />
          </div>
          <h3 className="font-semibold text-text-primary mb-1">No transactions found</h3>
          <p className="text-sm text-text-secondary">
            {search ? 'Try a different search term.' : 'Your transaction history will appear here.'}
          </p>
          {search && (
            <button onClick={() => setSearch('')} className="mt-3 text-xs text-primary hover:underline">Clear search</button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((tx, i) => {
              const meta = TYPE_META[tx.type] || {
                label: tx.type?.replace(/_/g, ' ') || 'Transaction',
                icon: RefreshCw,
                colorClass: 'bg-surface text-text-muted',
                sign: '',
                signColor: 'text-text-primary',
              }
              const Icon = meta.icon
              const txCurrency = tx.currency || userCurrency

              return (
                <motion.div
                  key={tx.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.02, duration: 0.2 }}
                >
                  <div className="flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-border/30 bg-[#131A28] hover:border-border/60 hover:bg-[#161E2E] transition-all group">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary text-sm capitalize">
                        {meta.label}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">{formatDateTime(tx.created_at)}</p>
                      {tx.description && (
                        <p className="text-xs text-text-muted mt-0.5 truncate">{tx.description}</p>
                      )}
                    </div>

                    {/* Amount + Status */}
                    <div className="text-right shrink-0">
                      <p className={`font-bold text-sm ${meta.signColor}`}>
                        {meta.sign}{formatCurrency(tx.amount, txCurrency)}
                      </p>
                      <span className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
