import { useState, useEffect } from 'react'
import { CheckCircle, RefreshCw } from 'lucide-react'
import { useToast } from '../../components/ui/Toast'
import { adminApi } from '../../services/api'
import { formatDateTime, formatCurrency } from '../../lib/utils'

function StatusBadge({ status }) {
  const map = {
    pending: 'bg-warning/10 text-warning border-warning/20',
    approved: 'bg-success/10 text-success border-success/20',
    rejected: 'bg-danger/10 text-danger border-danger/20',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${map[status] || 'bg-surface text-text-muted border-border'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

function SkeletonTableRows({ cols = 7, rows = 5 }) {
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

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const toast = useToast()

  const load = () => {
    setLoading(true)
    adminApi.getDeposits()
      .then(setDeposits)
      .catch(() => toast('Failed to load deposits', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const approve = async (id) => {
    try { await adminApi.approveDeposit(id); toast('Deposit approved', 'success'); load() }
    catch { toast('Failed to approve', 'error') }
  }

  const filtered = filter === 'all' ? deposits : deposits.filter(d => d.status === filter)
  const counts = {
    all: deposits.length,
    pending: deposits.filter(d => d.status === 'pending').length,
    approved: deposits.filter(d => d.status === 'approved').length,
    rejected: deposits.filter(d => d.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Deposits</h1>
          <p className="text-text-secondary text-sm mt-0.5">Review and approve user deposits</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 text-sm text-text-secondary hover:text-text-primary hover:bg-surface transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all flex items-center gap-1.5 ${filter === f
              ? 'card-gradient text-white shadow-md'
              : 'bg-surface text-text-secondary hover:bg-border'
            }`}
          >
            {f}
            <span className={`${filter === f ? 'bg-white/20' : 'bg-border'} text-[10px] rounded-full px-1.5 py-0.5 font-bold`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border/50 overflow-hidden" style={{ background: '#131A28' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 text-left" style={{ background: '#0d1117' }}>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Method</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Reference</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <SkeletonTableRows cols={7} />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-text-muted">
                    <svg className="w-10 h-10 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    No deposits found
                  </td>
                </tr>
              ) : (
                filtered.map(d => (
                  <tr key={d.id} className="hover:bg-white/[0.02] transition-colors text-sm">
                    <td className="px-4 py-3">
                      <p className="font-medium text-text-primary">{d.profiles?.full_name || d.user_id?.slice(0, 8)}</p>
                      <p className="text-xs text-text-muted">{d.profiles?.email || ''}</p>
                    </td>
                    <td className="px-4 py-3 font-bold text-success text-base">{formatCurrency(d.amount)}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-lg text-xs bg-surface text-text-secondary border border-border/50">{d.payment_method}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted font-mono">{d.reference}</td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-3 text-xs text-text-muted">{formatDateTime(d.created_at)}</td>
                    <td className="px-4 py-3">
                      {d.status === 'pending' && (
                        <button
                          onClick={() => approve(d.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 text-success border border-success/20 text-xs font-semibold hover:bg-success/20 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
