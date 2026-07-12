import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { adminApi } from '../../services/api'
import { formatCurrency, formatDate } from '../../lib/utils'

function StatCard({ label, value, icon, color, bg, change }) {
  return (
    <div className="rounded-2xl border border-border/50 p-5 flex flex-col gap-4" style={{ background: '#131A28' }}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">{label}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
          <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        {change !== undefined && (
          <p className={`text-xs mt-1 font-medium ${change >= 0 ? 'text-success' : 'text-danger'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last period
          </p>
        )}
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-surface" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-surface rounded w-32" />
        <div className="h-2.5 bg-surface rounded w-48" />
      </div>
      <div className="h-2.5 bg-surface rounded w-16" />
    </div>
  )
}

function BarChart({ data }) {
  if (!data || Object.keys(data).length === 0) return (
    <div className="flex flex-col items-center justify-center py-12 text-text-muted">
      <svg className="w-10 h-10 mb-2 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
      <p className="text-sm">No revenue data yet</p>
    </div>
  )
  const entries = Object.entries(data).slice(-14)
  const max = Math.max(...entries.map(([, v]) => v), 1)
  return (
    <div className="space-y-2">
      {entries.map(([date, amount]) => (
        <div key={date} className="flex items-center gap-3 text-xs">
          <span className="text-text-muted w-24 shrink-0">{date}</span>
          <div className="flex-1 h-4 rounded-full bg-surface overflow-hidden">
            <div
              className="h-full rounded-full card-gradient transition-all duration-500"
              style={{ width: `${Math.min(100, (amount / max) * 100)}%` }}
            />
          </div>
          <span className="font-semibold text-text-primary w-20 text-right">{formatCurrency(amount)}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminApi.getDashboard()
      .then(setData)
      .catch(() => { })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const stats = [
    {
      label: 'Total Users',
      value: loading ? '—' : String(data?.totalUsers || 0),
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      color: 'text-blue-400', bg: 'bg-blue-500/10', change: 12,
    },
    {
      label: 'Active Investments',
      value: loading ? '—' : String(data?.activeInvestments || 0),
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      color: 'text-success', bg: 'bg-success/10', change: 5,
    },
    {
      label: "Today's Deposits",
      value: loading ? '—' : formatCurrency(data?.todayDeposits || 0),
      icon: 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4',
      color: 'text-primary', bg: 'bg-primary/10', change: 8,
    },
    {
      label: 'Pending Withdrawals',
      value: loading ? '—' : String(data?.pendingWithdrawals || 0),
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-warning', bg: 'bg-warning/10',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Platform Overview</h1>
          <p className="text-text-secondary text-sm mt-0.5">Live stats and recent activity</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 text-sm text-text-secondary hover:text-text-primary hover:bg-surface transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Two-column lower section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="rounded-2xl border border-border/50 overflow-hidden" style={{ background: '#131A28' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <h2 className="font-semibold text-text-primary">Recent Users</h2>
            <span className="text-xs text-text-muted">{data?.recentUsers?.length || 0} recent</span>
          </div>
          <div className="px-5 py-2 divide-y divide-border/30">
            {loading ? (
              [1, 2, 3, 4].map(i => <SkeletonRow key={i} />)
            ) : data?.recentUsers?.length > 0 ? (
              data.recentUsers.map(u => (
                <div key={u.id} className="flex items-center gap-3 py-3">
                  <div className="w-9 h-9 rounded-full card-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {u.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{u.full_name || u.email}</p>
                    <p className="text-xs text-text-muted truncate">{u.email}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${u.status === 'active' ? 'bg-success/10 text-success' : 'bg-surface text-text-muted'}`}>
                      {u.status || 'active'}
                    </span>
                    <p className="text-[10px] text-text-muted mt-0.5">{formatDate(u.created_at)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-text-muted text-sm">No recent users</div>
            )}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="rounded-2xl border border-border/50 overflow-hidden" style={{ background: '#131A28' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <h2 className="font-semibold text-text-primary">Revenue (30 days)</h2>
            <span className="text-xs text-primary font-semibold">
              {data?.revenueChart ? formatCurrency(Object.values(data.revenueChart).reduce((a, b) => a + b, 0)) : '$0.00'} total
            </span>
          </div>
          <div className="px-5 py-4">
            {loading ? (
              <div className="space-y-2 animate-pulse">
                {[100, 70, 85, 60, 90, 75, 50].map((w, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-2.5 bg-surface rounded w-20" />
                    <div className="flex-1 h-4 bg-surface rounded-full" style={{ width: `${w}%` }} />
                    <div className="h-2.5 bg-surface rounded w-14" />
                  </div>
                ))}
              </div>
            ) : (
              <BarChart data={data?.revenueChart} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
