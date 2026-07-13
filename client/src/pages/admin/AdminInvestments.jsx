import { useState, useEffect, useMemo } from 'react'
import { TrendingUp, Plus, Pencil, Trash2, RefreshCw, Users, DollarSign, Clock, CheckCircle, Globe } from 'lucide-react'
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
            if (plan?.id && !plan.id.startsWith('vip_')) {
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
                <Button type="submit" loading={loading}>{plan?.id && !plan.id.startsWith('vip_') ? 'Update Plan' : 'Create Plan'}</Button>
            </div>
        </form>
    )
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-border/50 bg-surface text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"

export default function AdminInvestments() {
    const [plans, setPlans] = useState([])
    const [allPlans, setAllPlans] = useState([])
    const [userInvestments, setUserInvestments] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editPlan, setEditPlan] = useState(null)
    const [tab, setTab] = useState('investments')
    const [countryFilter, setCountryFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const toast = useToast()

    const load = async () => {
        setLoading(true)
        try {
            const [p, ap, ui] = await Promise.all([
                adminApi.getPlans().catch(() => []),
                adminApi.getAllPlans().catch(() => []),
                adminApi.getUserInvestments().catch(() => []),
            ])
            setPlans(p || [])
            setAllPlans(ap || [])
            setUserInvestments(ui || [])
        } catch { toast('Failed to load data', 'error') }
        finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    const deletePlan = async (id) => {
        if (id.startsWith('vip_')) { toast('VIP plans cannot be deleted', 'warning'); return }
        if (!confirm('Delete this plan?')) return
        try { await adminApi.deletePlan(id); toast('Plan deleted', 'success'); load() }
        catch { toast('Failed to delete plan', 'error') }
    }

    const countries = useMemo(() => {
        const set = new Set()
        allPlans.forEach(p => { if (p.country) set.add(p.country) })
        userInvestments.forEach(i => { if (i.user_country) set.add(i.user_country) })
        return Array.from(set).sort()
    }, [allPlans, userInvestments])

    const filteredInvestments = useMemo(() => {
        return userInvestments.filter(i => {
            if (countryFilter !== 'all' && i.user_country !== countryFilter) return false
            if (statusFilter !== 'all' && i.status !== statusFilter) return false
            return true
        })
    }, [userInvestments, countryFilter, statusFilter])

    const groupedByCountry = useMemo(() => {
        const groups = {}
        filteredInvestments.forEach(inv => {
            const c = inv.user_country || 'Unknown'
            if (!groups[c]) groups[c] = []
            groups[c].push(inv)
        })
        return groups
    }, [filteredInvestments])

    const countryStats = useMemo(() => {
        const stats = {}
        userInvestments.forEach(inv => {
            const c = inv.user_country || 'Unknown'
            if (!stats[c]) stats[c] = { count: 0, totalInvested: 0, activeCount: 0, totalEarned: 0 }
            stats[c].count++
            stats[c].totalInvested += inv.amount
            stats[c].totalEarned += inv.total_earned
            if (inv.status === 'active') stats[c].activeCount++
        })
        return stats
    }, [userInvestments])

    const overallStats = useMemo(() => {
        const active = userInvestments.filter(i => i.status === 'active')
        return {
            totalInvestments: userInvestments.length,
            activeCount: active.length,
            totalInvested: userInvestments.reduce((s, i) => s + i.amount, 0),
            totalEarned: userInvestments.reduce((s, i) => s + i.total_earned, 0),
        }
    }, [userInvestments])

    const riskColors = { low: 'bg-success/10 text-success', medium: 'bg-warning/10 text-warning', high: 'bg-danger/10 text-danger' }
    const statusTabCls = (active) => `px-4 py-2 rounded-xl text-sm font-medium transition-all ${active ? 'card-gradient text-white' : 'text-text-muted hover:text-text-primary hover:bg-surface'}`

    if (loading) return (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-surface rounded w-48" />
            {[1, 2].map(i => (
                <div key={i} className="rounded-2xl border border-border/50 p-6 space-y-4" style={{ background: '#131A28' }}>
                    <div className="h-5 bg-surface rounded w-32" />
                    <div className="grid md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(j => <div key={j} className="h-10 bg-surface rounded-xl" />)}
                    </div>
                </div>
            ))}
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Investments</h1>
                    <p className="text-text-secondary text-sm mt-0.5">Manage plans and view user investments</p>
                </div>
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

            <div className="flex gap-2 flex-wrap">
                <button onClick={() => setTab('investments')} className={statusTabCls(tab === 'investments')}>
                    <span className="flex items-center gap-2"><Users className="w-4 h-4" /> User Investments</span>
                </button>
                <button onClick={() => setTab('plans')} className={statusTabCls(tab === 'plans')}>
                    <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> All Plans</span>
                </button>
            </div>

            {tab === 'investments' && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: 'Total Investments', value: overallStats.totalInvestments, icon: TrendingUp, color: 'text-primary' },
                            { label: 'Active', value: overallStats.activeCount, icon: Clock, color: 'text-success' },
                            { label: 'Total Invested', value: `$${overallStats.totalInvested.toLocaleString()}`, icon: DollarSign, color: 'text-warning' },
                            { label: 'Total Earned', value: `$${overallStats.totalEarned.toLocaleString()}`, icon: CheckCircle, color: 'text-success' },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="rounded-xl border border-border/50 p-4" style={{ background: '#131A28' }}>
                                <div className="flex items-center gap-2 mb-1">
                                    <Icon className={`w-4 h-4 ${color}`} />
                                    <span className="text-xs text-text-muted">{label}</span>
                                </div>
                                <p className={`text-xl font-bold ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <div className="space-y-1.5">
                            <label className="text-xs text-text-muted">Country</label>
                            <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} className={`${inputCls} !py-2 w-44`}>
                                <option value="all">All Countries</option>
                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs text-text-muted">Status</label>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`${inputCls} !py-2 w-36`}>
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {filteredInvestments.length === 0 ? (
                        <Card><CardContent className="p-8 text-center text-text-muted">No investments found.</CardContent></Card>
                    ) : (
                        Object.entries(groupedByCountry).map(([country, invs]) => {
                            const cs = countryStats[country]
                            return (
                                <div key={country} className="space-y-3">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h2 className="text-lg font-bold text-text-primary">{country}</h2>
                                        <span className="text-xs px-2.5 py-1 rounded-full card-gradient text-white font-medium">{invs.length} investment{invs.length !== 1 ? 's' : ''}</span>
                                        {cs && (
                                            <span className="text-xs text-text-muted">
                                                ${cs.totalInvested.toLocaleString()} invested · ${cs.totalEarned.toLocaleString()} earned · {cs.activeCount} active
                                            </span>
                                        )}
                                    </div>
                                    <Card>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-border/50 text-left text-sm text-text-muted">
                                                            <th className="p-4 font-medium">User</th>
                                                            <th className="p-4 font-medium">Plan</th>
                                                            <th className="p-4 font-medium">Invested ($)</th>
                                                            <th className="p-4 font-medium">Daily Return</th>
                                                            <th className="p-4 font-medium">Earned ($)</th>
                                                            <th className="p-4 font-medium">Remaining ($)</th>
                                                            <th className="p-4 font-medium">Days Left</th>
                                                            <th className="p-4 font-medium">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border/50">
                                                        {invs.map(inv => (
                                                            <tr key={inv.id} className="hover:bg-background/50 text-sm">
                                                                <td className="p-4">
                                                                    <p className="font-semibold text-text-primary">{inv.user_name}</p>
                                                                    <p className="text-xs text-text-muted">{inv.user_email}</p>
                                                                </td>
                                                                <td className="p-4 text-text-secondary">{inv.plan_name}</td>
                                                                <td className="p-4 font-semibold text-text-primary">${inv.amount.toLocaleString()}</td>
                                                                <td className="p-4 text-success">{inv.daily_return_pct}% <span className="text-text-muted">(${inv.daily_return_amt.toFixed(2)}/d)</span></td>
                                                                <td className="p-4 font-semibold text-success">${inv.total_earned.toFixed(2)}</td>
                                                                <td className="p-4 font-semibold text-warning">${inv.remaining_return.toFixed(2)}</td>
                                                                <td className="p-4 text-text-secondary">{inv.days_remaining}d <span className="text-text-muted">/ {inv.duration}d</span></td>
                                                                <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs capitalize ${getStatusColor(inv.status)}`}>{inv.status}</span></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })
                    )}
                </>
            )}

            {tab === 'plans' && (
                <>
                    {countries.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            <button onClick={() => setCountryFilter('all')} className={statusTabCls(countryFilter === 'all')}>All</button>
                            <button onClick={() => setCountryFilter('global')} className={statusTabCls(countryFilter === 'global')}>Global Plans</button>
                            {countries.map(c => (
                                <button key={c} onClick={() => setCountryFilter(c)} className={statusTabCls(countryFilter === c)}>{c}</button>
                            ))}
                        </div>
                    )}

                    <Card>
                        <CardHeader><CardTitle>All Plans ({allPlans.filter(p => {
                            if (countryFilter === 'all') return true
                            if (countryFilter === 'global') return p.type === 'global'
                            return p.country === countryFilter
                        }).length})</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border/50 text-left text-sm text-text-muted">
                                            <th className="p-4 font-medium">Plan</th>
                                            <th className="p-4 font-medium">Country</th>
                                            <th className="p-4 font-medium">Investment Range ($)</th>
                                            <th className="p-4 font-medium">Daily Return</th>
                                            <th className="p-4 font-medium">Duration</th>
                                            <th className="p-4 font-medium">Total ROI</th>
                                            <th className="p-4 font-medium">Risk</th>
                                            <th className="p-4 font-medium">Status</th>
                                            <th className="p-4 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {allPlans.filter(p => {
                                            if (countryFilter === 'all') return true
                                            if (countryFilter === 'global') return p.type === 'global'
                                            return p.country === countryFilter
                                        }).map(plan => (
                                            <tr key={plan.id} className="hover:bg-background/50 text-sm">
                                                <td className="p-4">
                                                    <p className="font-semibold text-text-primary">{plan.name}</p>
                                                    <p className="text-xs text-text-muted truncate max-w-[180px]">{plan.description}</p>
                                                </td>
                                                <td className="p-4">
                                                    {plan.country ? (
                                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium card-gradient text-white">{plan.country}</span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-surface text-text-muted">Global</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-text-secondary">${plan.min_investment.toLocaleString()} – {plan.max_investment ? `$${plan.max_investment.toLocaleString()}` : '∞'}</td>
                                                <td className="p-4 font-semibold text-success">{plan.daily_return}%</td>
                                                <td className="p-4 text-text-secondary">{plan.duration}d</td>
                                                <td className="p-4 font-semibold text-primary">{plan.total_return}%</td>
                                                <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${riskColors[plan.risk_level] || 'bg-surface text-text-muted'}`}>{plan.risk_level}</span></td>
                                                <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(plan.status)}`}>{plan.status}</span></td>
                                                <td className="p-4">
                                                    {plan.type === 'global' ? (
                                                        <div className="flex gap-1">
                                                            <button onClick={() => { setEditPlan(plan); setShowForm(false) }} className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary"><Pencil className="w-4 h-4" /></button>
                                                            <button onClick={() => deletePlan(plan.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-text-muted italic">VIP Auto</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
