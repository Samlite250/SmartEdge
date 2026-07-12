import { useState, useEffect } from 'react'
import { Save, RefreshCw, AlertTriangle } from 'lucide-react'
import { useToast } from '../../components/ui/Toast'
import { adminApi } from '../../services/api'

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-primary">{label}</label>
      {hint && <p className="text-xs text-text-muted">{hint}</p>}
      {children}
    </div>
  )
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-border/50 bg-surface text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
const selectCls = "w-full px-4 py-2.5 rounded-xl border border-border/50 bg-surface text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none"

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
      .catch(() => { })
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
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-secondary text-sm mt-0.5">Platform configuration and preferences</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 text-sm text-text-secondary hover:text-text-primary hover:bg-surface transition-all">
          <RefreshCw className="w-4 h-4" /> Reload
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General */}
        <div className="rounded-2xl border border-border/50 overflow-hidden" style={{ background: '#131A28' }}>
          <div className="px-6 py-4 border-b border-border/50" style={{ background: '#0d1117' }}>
            <h2 className="font-semibold text-text-primary">General Settings</h2>
            <p className="text-xs text-text-muted mt-0.5">Basic platform information and contact</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Platform Name">
                <input className={inputCls} placeholder="SmartEdge" {...f('platform_name')} />
              </Field>
              <Field label="Support Email">
                <input className={inputCls} type="email" placeholder="support@smartedge.com" {...f('support_email')} />
              </Field>
              <Field label="Support Phone">
                <input className={inputCls} placeholder="+256 700 000 000" {...f('support_phone')} />
              </Field>
            </div>

            {/* Maintenance toggle */}
            <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${settings.maintenance_mode ? 'border-danger/30 bg-danger/5' : 'border-border/50 bg-surface/50'}`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${settings.maintenance_mode ? 'text-danger' : 'text-text-muted'}`} />
                <div>
                  <p className="font-medium text-text-primary text-sm">Maintenance Mode</p>
                  <p className="text-xs text-text-muted mt-0.5">When enabled, only admins can access the platform</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, maintenance_mode: !settings.maintenance_mode })}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${settings.maintenance_mode ? 'bg-danger' : 'bg-border'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${settings.maintenance_mode ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Financial */}
        <div className="rounded-2xl border border-border/50 overflow-hidden" style={{ background: '#131A28' }}>
          <div className="px-6 py-4 border-b border-border/50" style={{ background: '#0d1117' }}>
            <h2 className="font-semibold text-text-primary">Financial Limits</h2>
            <p className="text-xs text-text-muted mt-0.5">Deposit, withdrawal limits and fee configuration</p>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Min Deposit ($)">
                <input className={inputCls} type="number" placeholder="10" {...f('min_deposit')} />
              </Field>
              <Field label="Max Deposit ($)">
                <input className={inputCls} type="number" placeholder="50000" {...f('max_deposit')} />
              </Field>
              <Field label="Min Withdrawal ($)">
                <input className={inputCls} type="number" placeholder="5" {...f('min_withdrawal')} />
              </Field>
              <Field label="Max Withdrawal ($)">
                <input className={inputCls} type="number" placeholder="10000" {...f('max_withdrawal')} />
              </Field>
              <Field label="Referral Bonus (%)" hint="Percentage bonus given to referrers">
                <input className={inputCls} type="number" step="0.1" placeholder="5" {...f('referral_bonus_percent')} />
              </Field>
              <Field label="Withdrawal Fee (%)" hint="Platform fee charged on withdrawals">
                <input className={inputCls} type="number" step="0.1" placeholder="1" {...f('withdrawal_fee_percent')} />
              </Field>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl card-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
