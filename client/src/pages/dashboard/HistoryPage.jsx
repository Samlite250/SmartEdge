import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, ArrowDownCircle, ArrowUpCircle, RefreshCw, Gift } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { walletApi } from '../../services/api'
import { formatDateTime, formatCurrency, getStatusColor } from '../../lib/utils'
import { useAuth } from '../../hooks/useAuth'

const typeIcons = {
  deposit: ArrowDownCircle,
  withdrawal: ArrowUpCircle,
  investment: RefreshCw,
  referral_bonus: Gift,
  daily_return: RefreshCw,
  transfer: RefreshCw,
}

export default function HistoryPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    walletApi.getTransactions(1, 100)
      .then(res => setTransactions(res.data || []))
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div><div className="h-8 w-48 bg-border/50 rounded-lg animate-pulse mb-2" /><div className="h-5 w-64 bg-border/50 rounded-lg animate-pulse" /></div>
        {[1, 2, 3, 4, 5].map(i => <Card key={i}><CardContent><div className="h-12 bg-border/50 rounded-lg animate-pulse" /></CardContent></Card>)}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Transaction History</h1>
        <p className="text-text-secondary">View all your transactions</p>
      </div>

      {transactions.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="font-semibold text-text-primary mb-1">No transactions yet</h3>
              <p className="text-sm text-text-secondary">Your transaction history will appear here.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, i) => {
            const Icon = typeIcons[tx.type] || RefreshCw
            return (
              <motion.div key={tx.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'deposit' ? 'accent-gradient' : tx.type === 'withdrawal' ? 'card-gradient' : tx.type === 'daily_return' ? 'green-gradient' : 'bg-surface'}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary capitalize">{tx.type?.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-text-muted">{formatDateTime(tx.created_at)}</p>
                      {tx.description && <p className="text-xs text-text-muted mt-0.5">{tx.description}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text-primary">{formatCurrency(tx.amount, tx.currency || user?.currency || 'USD')}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(tx.status)}`}>{tx.status}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
