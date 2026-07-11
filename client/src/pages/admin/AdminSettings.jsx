import { useState, useEffect } from 'react'
import { Settings, Save, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useToast } from '../../components/ui/Toast'
import { adminApi } from '../../services/api'

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        platform_name: 'SmartEdge',
        min_deposit: '10',
        max_deposit: '50000',
        min_withdrawal: '5',
        max_withdrawal: '10000',
        referral_bonus_percent: '5',
        withdrawal_fee_percent: '1',
        maintenance_mode: false,
        support_email: 'support@smartedge.com',
        support_phone: '+256 700 000 000',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const toast = useToast()

    const load = () => {
        setLoading(true)
        adminApi.getSettings()
            .then(data => { if (data) setSettings(s => ({ ...s, ...data })) })
            .catch(() => { }) // Use defaults if not available
            .finally(() => setLoading(false))
    }

    useEffect(load, [])

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await adminApi.updateSettings(settings)
            toast('Settings saved successfully!', 'success')
        } catch {
            toast('Failed to save settings', 'error')
        } finally {
            setSaving(false)
        }
    }

    const f = (k) => ({
        value: settings[k] ?? '',
        onChange: e => setSettings({ ...settings, [k]: e.target.value })
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
                    <p className="text-text-secondary">Platform configuration and preferences</p>
                </div>
                <Button variant="outline" size="sm" onClick={load}><RefreshCw className="w-4 h-4 mr-1" /> Reload</Button>
            </div>

            {loading ? (
                <div className="p-8 text-center text-text-muted">Loading settings...</div>
            ) : (
                <form onSubmit={handleSave} className="space-y-6">
                    {/* General */}
                    <Card>
                        <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input label="Platform Name" placeholder="SmartEdge" {...f('platform_name')} />
                                <Input label="Support Email" type="email" placeholder="support@smartedge.com" {...f('support_email')} />
                                <Input label="Support Phone" placeholder="+256 700 000 000" {...f('support_phone')} />
                            </div>
                            <label className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" checked={settings.maintenance_mode}
                                        onChange={e => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                                        className="sr-only" />
                                    <div className={`w-10 h-6 rounded-full transition-colors ${settings.maintenance_mode ? 'bg-danger' : 'bg-border'}`} />
                                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.maintenance_mode ? 'translate-x-4' : 'translate-x-0'}`} />
                                </div>
                                <div>
                                    <p className="font-medium text-text-primary text-sm">Maintenance Mode</p>
                                    <p className="text-xs text-text-muted">Disable user access except for admins</p>
                                </div>
                            </label>
                        </CardContent>
                    </Card>

                    {/* Financial */}
                    <Card>
                        <CardHeader><CardTitle>Financial Limits</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input label="Min Deposit ($)" type="number" placeholder="10" {...f('min_deposit')} />
                                <Input label="Max Deposit ($)" type="number" placeholder="50000" {...f('max_deposit')} />
                                <Input label="Min Withdrawal ($)" type="number" placeholder="5" {...f('min_withdrawal')} />
                                <Input label="Max Withdrawal ($)" type="number" placeholder="10000" {...f('max_withdrawal')} />
                                <Input label="Referral Bonus (%)" type="number" step="0.1" placeholder="5" {...f('referral_bonus_percent')} />
                                <Input label="Withdrawal Fee (%)" type="number" step="0.1" placeholder="1" {...f('withdrawal_fee_percent')} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" loading={saving}>
                            <Save className="w-4 h-4 mr-2" /> Save All Settings
                        </Button>
                    </div>
                </form>
            )}
        </div>
    )
}
