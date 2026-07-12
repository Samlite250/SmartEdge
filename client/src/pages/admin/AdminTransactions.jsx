import { useState, useEffect } from 'react'
import { RefreshCw, ArrowDownCircle, ArrowUpCircle, Gift, TrendingUp } from 'lucide-react'
import { useToast } from '../../components/ui/Toast'
import { adminApi } from '../../services/api'
import { formatCurrency, formatDateTime } from '../../lib/utils'

const typeConfig = {
  deposit: { icon: ArrowDownCircle, color: 'text-success', bg: 'bg-success/10', label: 'Deposit' },
  withdrawal: { icon: ArrowUpCircle, color: 'text-danger', bg: 'bg-danger/10', label: 'Withdrawal' },
  referral_bonus: { icon: Gift, color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Referral Bonus' },
  daily_return: { icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10', label: 'Daily Return' },
  investment: { icon: TrendingUp, color: 'text-warning', bg: 'bg-warning/10', label: 'Investment' },
}

function StatusBadge({ status }) {
  const map = {
    completed: 'bg-success/10 text-success border-success/20',
    pending: 'bg-warning/10 text-warning border-warning/20',
    failed: 'bg-danger/10 text-danger border-danger/20',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${map[status] || 'bg-surface text-text-muted border-border'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

function SkeletonTableRows({ cols = 6, rows = 6 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <tr key={i} className="border-b border-border/30 animate-pulse">
      {Array.from({ length: cols }).map((_, j) => (
        <td key={j} className="p-4">
          <div className="h-3.5 bg-surface rounded w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  ))
}

const typeList = ['all', 'deposit', 'withdrawal', 'daily_return', 'referral_bonus', 'investment']

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const toast = useToast()

  const load = () => {
    setLoading(true)
    adminApi.getTransactions(1, 50)
      .then(res => setTransactions(res.data || res || []))
      .catch(() => toast('Failed to load transactions', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Transactions</h1>
          <p className="text-text-secondary text-sm mt-0.5">All platform financial activity</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 text-sm text-text-secondary hover:text-text-primary hover:bg-surface transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {typeList.map(t => {
          const count = t === 'all' ? transactions.length : transactions.filter(tx => tx.type === t).length
          return (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all flex items-center gap-1.5 ${filter === t
                ? 'card-gradient text-white shadow-md'
                : 'bg-surface text-text-secondary hover:bg-border'
              }`}
            >
              {t.replace(/_/g, ' ')}
              <span className={`${filter === t ? 'bg-white/20' : 'bg-border'} text-[10px] rounded-full px-1.5 py-0.5 font-bold`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="rounded-2xl border border-border/50 overflow-hidden" style={{ background: '#131A28' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 text-left" style={{ background: '#0d1117' }}>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <SkeletonTableRows cols={6} />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-text-muted">
                    <svg className="w-10 h-10 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    No transactions found
                  </td>
                </tr>
              ) : (
                filtered.map(t => {
                  const meta = typeConfig[t.type] || { icon: ArrowDownCircle, color: 'text-text-muted', bg: 'bg-surface', label: t.type }
                  const Icon = meta.icon
                  return (
                    <tr key={t.id} className="hover:bg-white/[0.02] transition-colors text-sm">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-4 h-4 ${meta.color}`} />
                          </div>
                          <span className="text-text-secondary font-medium text-xs capitalize">{t.type?.replace(/_/g, ' ')}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-text-primary">{t.profiles?.full_name || t.user_id?.slice(0, 8)}</p>
                        <p className="text-xs text-text-muted">{t.profiles?.email || ''}</p>
                      </td>
                      <td className="px-4 py-3 font-bold text-text-primary">{formatCurrency(t.amount, t.currency)}</td>
                      <td className="px-4 py-3 text-xs text-text-muted max-w-[160px] truncate">{t.description || '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                      <td className="px-4 py-3 text-xs text-text-muted">{formatDateTime(t.created_at)}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
