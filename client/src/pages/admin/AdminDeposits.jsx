import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { adminApi } from '../../services/api'
import { formatDateTime, formatCurrency, getStatusColor } from '../../lib/utils'

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState([])
  const [loading, setLoading] = useState(true)
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

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-text-primary">Deposits</h1><p className="text-text-secondary">Manage user deposits</p></div>
      <Card>
        <CardContent className="p-0">
          {loading ? <div className="p-8 text-center text-text-muted">Loading...</div> : deposits.length === 0 ? (
            <div className="p-8 text-center text-text-muted">No deposits yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-border/50 text-left text-sm text-text-muted">
                  <th className="p-4 font-medium">User</th><th className="p-4 font-medium">Amount</th><th className="p-4 font-medium">Method</th><th className="p-4 font-medium">Reference</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-border/50">
                  {deposits.map(d => (
                    <tr key={d.id} className="hover:bg-background/50 text-sm">
                      <td className="p-4">
                        <p className="font-medium text-text-primary">{d.profiles?.full_name || d.user_id?.slice(0, 8)}</p>
                        <p className="text-xs text-text-muted">{d.profiles?.email || ''}</p>
                      </td>
                      <td className="p-4 font-semibold text-text-primary">{formatCurrency(d.amount)}</td>
                      <td className="p-4 text-text-secondary">{d.payment_method}</td>
                      <td className="p-4 text-xs text-text-muted">{d.reference}</td>
                      <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(d.status)}`}>{d.status}</span></td>
                      <td className="p-4 text-xs text-text-muted">{formatDateTime(d.created_at)}</td>
                      <td className="p-4">
                        {d.status === 'pending' && (
                          <Button size="sm" onClick={() => approve(d.id)}>Approve</Button>
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
