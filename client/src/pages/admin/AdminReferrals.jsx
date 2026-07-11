import { useState, useEffect } from 'react'
import { Users, Gift, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { adminApi } from '../../services/api'
import { formatCurrency, formatDate } from '../../lib/utils'

export default function AdminReferrals() {
    const [referrals, setReferrals] = useState([])
    const [loading, setLoading] = useState(true)
    const toast = useToast()

    const load = () => {
        setLoading(true)
        adminApi.getReferrals()
            .then(data => setReferrals(data || []))
            .catch(() => toast('Failed to load referrals', 'error'))
            .finally(() => setLoading(false))
    }

    useEffect(load, [])

    const totalBonus = referrals.reduce((sum, r) => sum + Number(r.bonus || 0), 0)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-text-primary">Referrals</h1><p className="text-text-secondary">Track referral relationships and bonuses</p></div>
                <Button variant="outline" size="sm" onClick={load}><RefreshCw className="w-4 h-4 mr-1" /> Refresh</Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                    <div className="flex items-center gap-3 p-4">
                        <div className="w-10 h-10 rounded-xl card-gradient flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-text-muted">Total Referrals</p>
                            <p className="text-xl font-bold text-text-primary">{referrals.length}</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-3 p-4">
                        <div className="w-10 h-10 rounded-xl green-gradient flex items-center justify-center">
                            <Gift className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-text-muted">Total Bonuses Paid</p>
                            <p className="text-xl font-bold text-text-primary">{formatCurrency(totalBonus)}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Referral Details</CardTitle></CardHeader>
                <CardContent className="p-0">
                    {loading ? <div className="p-8 text-center text-text-muted">Loading...</div> : referrals.length === 0 ? (
                        <div className="p-8 text-center text-text-muted">No referrals yet</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/50 text-left text-sm text-text-muted">
                                        <th className="p-4 font-medium">Referrer</th>
                                        <th className="p-4 font-medium">Referred User</th>
                                        <th className="p-4 font-medium">Bonus Paid</th>
                                        <th className="p-4 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {referrals.map(r => (
                                        <tr key={r.id} className="hover:bg-background/50 text-sm">
                                            <td className="p-4">
                                                <p className="font-medium text-text-primary">{r.referrer?.full_name || r.referrer_id?.slice(0, 8)}</p>
                                                <p className="text-xs text-text-muted">{r.referrer?.email || ''}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-medium text-text-primary">{r.referred?.full_name || r.referred_id?.slice(0, 8)}</p>
                                                <p className="text-xs text-text-muted">{r.referred?.email || ''}</p>
                                            </td>
                                            <td className="p-4 font-semibold text-success">{formatCurrency(r.bonus || 0)}</td>
                                            <td className="p-4 text-xs text-text-muted">{formatDate(r.created_at)}</td>
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
