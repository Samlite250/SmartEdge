import { useState, useEffect } from 'react'
import { Save, RefreshCw, AlertTriangle, Plus, Trash2, Edit2, X } from 'lucide-react'
import { useToast } from '../../components/ui/Toast'
import { adminApi } from '../../services/api'
import { CountrySelect } from '../../components/ui/CountrySelect'

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
    maintenance_mode: false,
    support_email: 'support@smartedge.com',
    support_phone: '+256 700 000 000',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [truncating, setTruncating] = useState(false)
  const toast = useToast()

  const [instructionsList, setInstructionsList] = useState([])
  const [editingInstruction, setEditingInstruction] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formState, setFormState] = useState({ country: '', method: '', instructions: '' })

  const load = () => {
    setLoading(true)
    Promise.all([
      adminApi.getSettings(),
      adminApi.getInstructions()
    ])
      .then(([settingsData, listData]) => {
        if (settingsData) setSettings(s => ({ ...s, ...settingsData }))
        if (listData) setInstructionsList(listData)
      })
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

  const handleTruncateAll = async () => {
    const doubleConfirm = window.confirm("WARNING: This will permanently delete all logs, transactions, user investments, deposits, withdrawals, and set all user wallets back to 0. Are you absolutely sure you want to proceed?")
    if (!doubleConfirm) return
    
    setTruncating(true)
    try {
      await adminApi.truncateAll()
      toast('System truncated and reset to clean state successfully!', 'success')
      load()
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to reset system data', 'error')
    } finally {
      setTruncating(false)
    }
  }

  const handleSaveInstruction = async (e) => {
    e.preventDefault()
    if (!formState.country?.trim() || !formState.method?.trim() || !formState.instructions?.trim()) {
      return toast('Please fill in all fields', 'warning')
    }
    try {
      await adminApi.upsertInstructions(formState)
      toast('Payment instruction saved successfully!', 'success')
      setFormState({ country: '', method: '', instructions: '' })
      setEditingInstruction(null)
      setShowAddForm(false)
      load()
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to save instruction', 'error')
    }
  }

  const handleDeleteInstruction = async (id) => {
    if (!confirm('Are you sure you want to delete instructions for this country?')) return
    try {
      await adminApi.deleteInstructions(id)
      toast('Instruction deleted successfully!', 'success')
      load()
    } catch {
      toast('Failed to delete instruction', 'error')
    }
  }

  const startEdit = (item) => {
    setEditingInstruction(item.id)
    setFormState({ id: item.id, country: item.country, method: item.method, instructions: item.instructions })
    setShowAddForm(true)
  }

  const startAdd = () => {
    setEditingInstruction(null)
    setFormState({ country: '', method: '', instructions: '' })
    setShowAddForm(true)
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
                <input className={`${inputCls} opacity-60 cursor-not-allowed`} placeholder="SmartEdge" value={settings.platform_name ?? ''} readOnly />
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

        {/* Payment Instructions Section */}
        <div className="rounded-2xl border border-border/50 overflow-hidden" style={{ background: '#131A28' }}>
          <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between" style={{ background: '#0d1117' }}>
            <div>
              <h2 className="font-semibold text-text-primary">Country Payment Instructions</h2>
              <p className="text-xs text-text-muted mt-0.5">Customize payment instructions shown on deposit pages by country</p>
            </div>
            {!showAddForm && (
              <button
                type="button"
                onClick={startAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" /> Add Country
              </button>
            )}
          </div>
          <div className="p-6 space-y-4">
            {showAddForm && (
              <div className="p-4 rounded-xl border border-border/50 bg-surface/50 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/20">
                  <h3 className="text-sm font-semibold text-text-primary">
                    {editingInstruction ? 'Edit Instructions' : 'Add Country Instructions'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => { setShowAddForm(false); setEditingInstruction(null); }}
                    className="p-1 rounded-lg hover:bg-surface text-text-muted"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {editingInstruction ? (
                    <Field label="Country">
                      <input className={`${inputCls} opacity-60`} value={formState.country} readOnly />
                    </Field>
                  ) : (
                    <div className="space-y-1.5">
                      <CountrySelect
                        value={formState.country}
                        onChange={country => setFormState({ ...formState, country })}
                      />
                    </div>
                  )}
                  <Field label="Payment Method" hint="e.g. Rwanda Mobile Money, Burundi Payment">
                    <input
                      className={inputCls}
                      placeholder="e.g. MTN Mobile Money"
                      value={formState.method}
                      onChange={e => setFormState({ ...formState, method: e.target.value })}
                    />
                  </Field>
                </div>

                <Field label="Instructions (Preserves layout and newlines)">
                  <textarea
                    rows={6}
                    className={`${inputCls} font-mono text-xs`}
                    placeholder="Enter instructions, dial codes, numbers..."
                    value={formState.instructions}
                    onChange={e => setFormState({ ...formState, instructions: e.target.value })}
                  />
                </Field>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowAddForm(false); setEditingInstruction(null); }}
                    className="px-4 py-2 rounded-xl border border-border/50 text-xs text-text-secondary hover:text-text-primary transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveInstruction}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    Save Country Instructions
                  </button>
                </div>
              </div>
            )}

            {instructionsList.length === 0 ? (
              <p className="text-text-muted text-xs text-center py-4">No country-specific instructions configured yet. Default methods apply.</p>
            ) : (
              <div className="divide-y divide-border/30">
                {instructionsList.map(item => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary text-sm">{item.country}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full card-gradient text-white font-medium">{item.method}</span>
                      </div>
                      <p className="font-mono text-xs text-text-muted whitespace-pre-wrap line-clamp-3 bg-surface/30 p-2.5 rounded-lg border border-border/30 mt-1.5">
                        {item.instructions}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="p-2 rounded-lg hover:bg-surface text-text-secondary hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteInstruction(item.id)}
                        className="p-2 rounded-lg hover:bg-surface text-text-secondary hover:text-danger transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* System Reset / Danger Zone */}
        <div className="rounded-2xl border border-danger/30 overflow-hidden bg-danger/5">
          <div className="px-6 py-4 border-b border-danger/20 flex items-center justify-between" style={{ background: '#0d1117' }}>
            <div>
              <h2 className="font-semibold text-danger">Danger Zone</h2>
              <p className="text-xs text-text-muted mt-0.5">Permanent actions that cannot be undone</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-text-primary">Truncate and Reset Platform Data</p>
                <p className="text-xs text-text-muted mt-0.5">
                  Deletes all deposits, withdrawals, active investments, other transactions, and resets all wallet balances to 0.
                </p>
              </div>
              <button
                type="button"
                disabled={truncating}
                onClick={handleTruncateAll}
                className="px-4 py-2 rounded-xl bg-danger hover:bg-danger/80 disabled:bg-danger/40 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shrink-0 font-sans"
              >
                {truncating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                {truncating ? 'Resetting...' : 'Reset System Data'}
              </button>
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
