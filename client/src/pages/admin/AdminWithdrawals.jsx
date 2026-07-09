import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { adminApi } from '../../services/api'
import { formatDateTime, formatCurrency, getStatusColor } from '../../lib/utils'

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const load = () => {
    setLoading(true)
    adminApi.getWithdrawals()
      .then(setWithdrawals)
      .catch(() => toast('Failed to load withdrawals', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const approve = async (id) => {
    try { await adminApi.approveWithdrawal(id); toast('Withdrawal approved', 'success'); load() }
    catch { toast('Failed to approve', 'error') }
  }

  const reject = async (id) => {
    try { await adminApi.rejectWithdrawal(id); toast('Withdrawal rejected', 'success'); load() }
    catch { toast('Failed to reject', 'error') }
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-text-primary">Withdrawals</h1><p className="text-text-secondary">Manage withdrawal requests</p></div>
      <Card>
        <CardContent className="p-0">
          {loading ? <div className="p-8 text-center text-text-muted">Loading...</div> : withdrawals.length === 0 ? (
            <div className="p-8 text-center text-text-muted">No withdrawals yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-border/50 text-left text-sm text-text-muted">
                  <th className="p-4 font-medium">User</th><th className="p-4 font-medium">Amount</th><th className="p-4 font-medium">Method</th><th className="p-4 font-medium">Reference</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-border/50">
                  {withdrawals.map(w => (
                    <tr key={w.id} className="hover:bg-background/50 text-sm">
                      <td className="p-4">
                        <p className="font-medium text-text-primary">{w.profiles?.full_name || w.user_id?.slice(0, 8)}</p>
                        <p className="text-xs text-text-muted">{w.profiles?.email || ''}</p>
                      </td>
                      <td className="p-4 font-semibold text-text-primary">{formatCurrency(w.amount)}</td>
                      <td className="p-4 text-text-secondary">{w.payment_method}</td>
                      <td className="p-4 text-xs text-text-muted">{w.reference}</td>
                      <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(w.status)}`}>{w.status}</span></td>
                      <td className="p-4 text-xs text-text-muted">{formatDateTime(w.created_at)}</td>
                      <td className="p-4">
                        {w.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button size="sm" onClick={() => approve(w.id)}>Approve</Button>
                            <Button size="sm" variant="outline" onClick={() => reject(w.id)} className="text-danger border-danger">Reject</Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
