import { useState, useEffect } from 'react'
import { TrendingUp, Plus, Pencil, Trash2, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useToast } from '../../components/ui/Toast'
import { adminApi } from '../../services/api'
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils'

function PlanForm({ plan, onSave, onCancel }) {
    const [form, setForm] = useState(
        plan || { name: '', description: '', min_investment: '', max_investment: '', daily_return: '', duration: '', total_return: '', risk_level: 'low', status: 'active' }
    )
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (plan?.id) {
                await adminApi.updatePlan(plan.id, form)
                toast('Plan updated', 'success')
            } else {
                await adminApi.createPlan(form)
                toast('Plan created', 'success')
            }
            onSave()
        } catch { toast('Failed to save plan', 'error') }
        finally { setLoading(false) }
    }

    const f = (k) => ({ value: form[k] ?? '', onChange: e => setForm({ ...form, [k]: e.target.value }) })

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <Input label="Plan Name" placeholder="e.g. Starter Plan" {...f('name')} required />
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-text-secondary">Risk Level</label>
                    <select {...f('risk_level')} className="w-full px-4 py-3 bg-white border-2 border-border rounded-xl text-sm focus:outline-none focus:border-primary">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <Input label="Min Investment ($)" type="number" placeholder="10" {...f('min_investment')} required />
                <Input label="Max Investment ($)" type="number" placeholder="999 (leave blank for unlimited)" {...f('max_investment')} />
                <Input label="Daily Return (%)" type="number" step="0.01" placeholder="0.5" {...f('daily_return')} required />
                <Input label="Duration (days)" type="number" placeholder="30" {...f('duration')} required />
                <Input label="Total Return (%)" type="number" step="0.01" placeholder="15" {...f('total_return')} required />
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-text-secondary">Status</label>
                    <select {...f('status')} className="w-full px-4 py-3 bg-white border-2 border-border rounded-xl text-sm focus:outline-none focus:border-primary">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-secondary">Description</label>
                <textarea {...f('description')} rows={2} placeholder="Plan description..." className="w-full px-4 py-3 bg-white border-2 border-border rounded-xl text-sm focus:outline-none focus:border-primary resize-none" />
            </div>
            <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" loading={loading}>{plan?.id ? 'Update Plan' : 'Create Plan'}</Button>
            </div>
        </form>
    )
}

export default function AdminInvestments() {
    const [plans, setPlans] = useState([])
    const [investments, setInvestments] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editPlan, setEditPlan] = useState(null)
    const [tab, setTab] = useState('plans')
    const toast = useToast()

    const load = async () => {
        setLoading(true)
        try {
            const [p] = await Promise.all([adminApi.getPlans()])
            setPlans(p || [])
        } catch { toast('Failed to load data', 'error') }
        finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    const deletePlan = async (id) => {
        if (!confirm('Delete this plan?')) return
        try { await adminApi.deletePlan(id); toast('Plan deleted', 'success'); load() }
        catch { toast('Failed to delete plan', 'error') }
    }

    const riskColors = { low: 'bg-success/10 text-success', medium: 'bg-warning/10 text-warning', high: 'bg-danger/10 text-danger' }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-text-primary">Investments</h1><p className="text-text-secondary">Manage investment plans</p></div>
                <div className="flex gap-3 items-center">
                    <Button variant="outline" size="sm" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
                    <Button size="sm" onClick={() => { setEditPlan(null); setShowForm(true) }}><Plus className="w-4 h-4" /> New Plan</Button>
                </div>
            </div>

            {(showForm || editPlan) && (
                <Card>
                    <CardHeader><CardTitle>{editPlan ? 'Edit Plan' : 'Create New Plan'}</CardTitle></CardHeader>
                    <CardContent>
                        <PlanForm plan={editPlan} onSave={() => { setShowForm(false); setEditPlan(null); load() }} onCancel={() => { setShowForm(false); setEditPlan(null) }} />
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader><CardTitle>Investment Plans ({plans.length})</CardTitle></CardHeader>
                <CardContent className="p-0">
                    {loading ? <div className="p-8 text-center text-text-muted">Loading...</div> : plans.length === 0 ? (
                        <div className="p-8 text-center text-text-muted">No plans yet. Create your first plan!</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/50 text-left text-sm text-text-muted">
                                        <th className="p-4 font-medium">Plan</th>
                                        <th className="p-4 font-medium">Investment Range</th>
                                        <th className="p-4 font-medium">Daily Return</th>
                                        <th className="p-4 font-medium">Duration</th>
                                        <th className="p-4 font-medium">Total ROI</th>
                                        <th className="p-4 font-medium">Risk</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {plans.map(plan => (
                                        <tr key={plan.id} className="hover:bg-background/50 text-sm">
                                            <td className="p-4">
                                                <p className="font-semibold text-text-primary">{plan.name}</p>
                                                <p className="text-xs text-text-muted truncate max-w-[180px]">{plan.description}</p>
                                            </td>
                                            <td className="p-4 text-text-secondary">{formatCurrency(plan.min_investment)} – {plan.max_investment ? formatCurrency(plan.max_investment) : '∞'}</td>
                                            <td className="p-4 font-semibold text-success">{plan.daily_return}%</td>
                                            <td className="p-4 text-text-secondary">{plan.duration}d</td>
                                            <td className="p-4 font-semibold text-primary">{plan.total_return}%</td>
                                            <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${riskColors[plan.risk_level] || 'bg-surface text-text-muted'}`}>{plan.risk_level}</span></td>
                                            <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(plan.status)}`}>{plan.status}</span></td>
                                            <td className="p-4">
                                                <div className="flex gap-1">
                                                    <button onClick={() => { setEditPlan(plan); setShowForm(false) }} className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary"><Pencil className="w-4 h-4" /></button>
                                                    <button onClick={() => deletePlan(plan.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"><Trash2 className="w-4 h-4" /></button>
                                                </div>
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
