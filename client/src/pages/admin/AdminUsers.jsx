import { useState, useEffect } from 'react'
import { Search, Shield, ShieldOff, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { adminApi } from '../../services/api'
import { formatDate, getStatusColor } from '../../lib/utils'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const toast = useToast()

  const load = () => {
    setLoading(true)
    adminApi.getUsers()
      .then(setUsers)
      .catch(() => toast('Failed to load users', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    try {
      await adminApi.updateUserStatus(id, newStatus)
      toast(`User ${newStatus}`, 'success')
      load()
    } catch { toast('Failed to update status', 'error') }
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await adminApi.deleteUser(id)
      toast('User deleted', 'success')
      load()
    } catch { toast('Failed to delete user', 'error') }
  }

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-text-primary">Users</h1><p className="text-text-secondary">Manage platform users</p></div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border-2 border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 w-64"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-text-muted">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-text-muted">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 text-left text-sm text-text-muted">
                    <th className="p-4 font-medium">User</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Country</th>
                    <th className="p-4 font-medium">Role</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Joined</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filtered.map(u => (
                    <tr key={u.id} className="hover:bg-background/50 text-sm">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full card-gradient flex items-center justify-center text-white text-xs font-bold">{u.full_name?.charAt(0) || '?'}</div>
                          <span className="font-medium text-text-primary">{u.full_name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-text-secondary">{u.email}</td>
                      <td className="p-4 text-text-secondary">{u.country || 'N/A'}</td>
                      <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'accent-gradient text-white' : 'bg-surface text-text-secondary'}`}>{u.role}</span></td>
                      <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(u.status)}`}>{u.status}</span></td>
                      <td className="p-4 text-text-secondary text-xs">{formatDate(u.created_at)}</td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <button onClick={() => toggleStatus(u.id, u.status)} className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text-primary" title={u.status === 'active' ? 'Suspend' : 'Activate'}>
                            {u.status === 'active' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                          </button>
                          <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"><Trash2 className="w-4 h-4" /></button>
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
