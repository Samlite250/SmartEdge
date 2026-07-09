import { useState, useEffect } from 'react'
import { Users, TrendingUp, DollarSign, ArrowUpRight, RefreshCw, Settings } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { adminApi } from '../../services/api'
import { formatCurrency, formatDate } from '../../lib/utils'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminApi.getDashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const stats = data ? [
    { label: 'Total Users', value: String(data.totalUsers || 0), icon: Users, color: 'card-gradient' },
    { label: 'Active Investments', value: String(data.activeInvestments || 0), icon: TrendingUp, color: 'green-gradient' },
    { label: "Today's Deposits", value: formatCurrency(data.todayDeposits || 0), icon: DollarSign, color: 'accent-gradient' },
    { label: 'Pending Withdrawals', value: String(data.pendingWithdrawals || 0), icon: ArrowUpRight, color: 'card-gradient' },
  ] : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
          <p className="text-text-secondary">Platform overview and management</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} loading={loading}>
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <CardHeader>
                <CardTitle className="text-sm text-text-muted font-medium">{s.label}</CardTitle>
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-text-primary">{s.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Recent Users</CardTitle></CardHeader>
          <CardContent>
            {data?.recentUsers?.length > 0 ? (
              <div className="divide-y divide-border/50">
                {data.recentUsers.map(u => (
                  <div key={u.id} className="flex items-center gap-3 py-2.5">
                    <div className="w-8 h-8 rounded-full card-gradient flex items-center justify-center text-white text-xs font-bold">
                      {u.full_name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{u.full_name || u.email}</p>
                      <p className="text-xs text-text-muted">{u.email}</p>
                    </div>
                    <span className="text-xs text-text-muted">{formatDate(u.created_at)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-sm text-center py-4">No recent users</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Revenue (30 days)</CardTitle></CardHeader>
          <CardContent>
            {data?.revenueChart && Object.keys(data.revenueChart).length > 0 ? (
              <div className="space-y-1">
                {Object.entries(data.revenueChart).slice(-14).map(([date, amount]) => (
                  <div key={date} className="flex items-center gap-3 text-sm">
                    <span className="text-text-muted w-24 text-xs">{date}</span>
                    <div className="flex-1 h-5 rounded bg-background overflow-hidden">
                      <div className="h-full card-gradient rounded" style={{ width: `${Math.min(100, (amount / Math.max(...Object.values(data.revenueChart))) * 100)}%` }} />
                    </div>
                    <span className="font-medium text-text-primary w-20 text-right text-xs">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-sm text-center py-4">No revenue data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
