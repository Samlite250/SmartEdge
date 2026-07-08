import { motion } from 'framer-motion'
import { Clock, ArrowDownCircle, ArrowUpCircle, RefreshCw, Gift } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { getStatusColor } from '../../lib/utils'

const transactions = []

const typeIcons = {
  deposit: ArrowDownCircle,
  withdrawal: ArrowUpCircle,
  investment: RefreshCw,
  referral_bonus: Gift,
  daily_return: RefreshCw,
}

export default function HistoryPage() {
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
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(tx.status)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary capitalize">{tx.type.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-text-muted">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text-primary">${Number(tx.amount).toLocaleString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
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
