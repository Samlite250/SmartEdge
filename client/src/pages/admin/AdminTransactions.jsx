import { useState, useEffect } from 'react'
import { RefreshCw, ArrowDownCircle, ArrowUpCircle, Gift, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { adminApi } from '../../services/api'
import { formatCurrency, formatDateTime, getStatusColor } from '../../lib/utils'

const typeIcons = {
    deposit: { icon: ArrowDownCircle, color: 'text-success' },
    withdrawal: { icon: ArrowUpCircle, color: 'text-danger' },
    referral_bonus: { icon: Gift, color: 'text-purple-400' },
    daily_return: { icon: TrendingUp, color: 'text-primary' },
    investment: { icon: TrendingUp, color: 'text-amber-400' },
}

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [page, setPage] = useState(1)
    const toast = useToast()

    const load = (p = 1) => {
        setLoading(true)
        adminApi.getTransactions(p, 50)
            .then(res => setTransactions(res.data || res || []))
            .catch(() => toast('Failed to load transactions', 'error'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter)

    const typeList = ['all', 'deposit', 'withdrawal', 'daily_return', 'referral_bonus', 'investment']

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div><h1 className="text-2xl font-bold text-text-primary">Transactions</h1><p className="text-text-secondary">All platform transactions</p></div>
                <Button variant="outline" size="sm" onClick={() => load()}><RefreshCw className="w-4 h-4 mr-1" /> Refresh</Button>
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap">
                {typeList.map(t => (
                    <button key={t} onClick={() => setFilter(t)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${filter === t ? 'card-gradient text-white shadow' : 'bg-surface text-text-secondary hover:bg-border'}`}>
                        {t.replace(/_/g, ' ')}
                    </button>
                ))}
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? <div className="p-8 text-center text-text-muted">Loading...</div> : filtered.length === 0 ? (
                        <div className="p-8 text-center text-text-muted">No transactions found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/50 text-left text-sm text-text-muted">
                                        <th className="p-4 font-medium">Type</th>
                                        <th className="p-4 font-medium">User</th>
                                        <th className="p-4 font-medium">Amount</th>
                                        <th className="p-4 font-medium">Description</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filtered.map(t => {
                                        const meta = typeIcons[t.type] || { icon: ArrowDownCircle, color: 'text-text-muted' }
                                        const Icon = meta.icon
                                        return (
                                            <tr key={t.id} className="hover:bg-background/50 text-sm">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-full bg-surface flex items-center justify-center`}>
                                                            <Icon className={`w-4 h-4 ${meta.color}`} />
                                                        </div>
                                                        <span className="text-text-secondary capitalize">{t.type?.replace(/_/g, ' ')}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <p className="text-text-primary font-medium">{t.profiles?.full_name || t.user_id?.slice(0, 8)}</p>
                                                    <p className="text-xs text-text-muted">{t.profiles?.email || ''}</p>
                                                </td>
                                                <td className="p-4 font-semibold text-text-primary">{formatCurrency(t.amount, t.currency)}</td>
                                                <td className="p-4 text-xs text-text-muted max-w-[160px] truncate">{t.description || '—'}</td>
                                                <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(t.status)}`}>{t.status}</span></td>
                                                <td className="p-4 text-xs text-text-muted">{formatDateTime(t.created_at)}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
