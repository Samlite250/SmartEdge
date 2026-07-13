import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Gift, Copy, UserCheck, UserX, ArrowLeft, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components/ui/Toast'
import { formatCurrency, formatDate } from '../../lib/utils'
import api from '../../lib/api'

export default function MyTeamPage() {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const userCurrency = user?.currency || 'USD'

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data: res } = await api.get('/referrals/team')
        setData(res)
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        setError('Failed to load team data')
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [])

  const copyReferral = () => {
    const link = `${window.location.origin}/register?ref=${user?.referral_code || ''}`
    navigator.clipboard.writeText(link)
    toast('Referral link copied!', 'success')
  }

  if (loading) {
    return (
      <div className="space-y-6 pb-8">
        <div className="h-8 w-48 bg-border/50 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}><CardContent>
              <div className="h-4 w-24 bg-border/50 rounded animate-pulse mb-3" />
              <div className="h-8 w-20 bg-border/50 rounded animate-pulse" />
            </CardContent></Card>
          ))}
        </div>
        <div className="h-64 bg-border/50 rounded-3xl animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <Card><CardContent className="text-center py-12">
          <p className="text-danger mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-primary hover:underline text-sm">Try again</button>
        </CardContent></Card>
      </div>
    )
  }

  const { team = [], stats = {} } = data || {}

  const statCards = [
    { label: 'Total Members', value: stats.totalMembers || 0, icon: Users, color: 'bg-[#4285F4]' },
    { label: 'Active Members', value: stats.activeMembers || 0, icon: UserCheck, color: 'bg-[#0F9D58]' },
    { label: 'Paid Bonuses', value: stats.paidBonuses || 0, icon: Gift, color: 'bg-[#F4B400]' },
    { label: 'Total Earned', value: formatCurrency(stats.totalBonusEarned || 0, userCurrency), icon: TrendingUp, color: 'bg-[#DB4437]' },
  ]

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-bold text-text-primary">My Team</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className={`relative overflow-hidden group rounded-3xl ${stat.color} border border-white/5 p-5`}>
                <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 bg-white rounded-full" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs md:text-sm text-white/90 font-medium mb-1">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-white tracking-tight">{stat.value}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="bg-[#131A28] rounded-3xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-text-primary">Invite Link</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 px-4 py-3 bg-surface rounded-xl border border-white/10 text-sm text-text-secondary truncate">
            {`${window.location.origin}/register?ref=${user?.referral_code || ''}`}
          </div>
          <button onClick={copyReferral} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-all">
            <Copy className="w-4 h-4" /> Copy
          </button>
        </div>
      </div>

      <div className="bg-[#131A28] rounded-3xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-text-primary">Team Members ({team.length})</h3>
        </div>
        {team.length > 0 ? (
          <div className="space-y-3">
            {team.map((member, i) => (
              <motion.div
                key={member.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-sm">
                    {member.referred?.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{member.referred?.full_name || 'Unknown'}</p>
                  <p className="text-xs text-text-muted truncate">{member.referred?.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${Number(member.bonus) > 0 ? 'text-emerald-400' : 'text-text-muted'}`}>
                    {Number(member.bonus) > 0 ? `+${formatCurrency(member.bonus, userCurrency)}` : 'Pending'}
                  </p>
                  <p className="text-[10px] text-text-muted mt-0.5 capitalize">{member.status}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-text-muted" />
            </div>
            <p className="text-text-secondary font-medium mb-1">No team members yet</p>
            <p className="text-sm text-text-muted mb-4">Share your referral link to start building your team</p>
            <button onClick={copyReferral} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-all">
              <Copy className="w-4 h-4" /> Copy Referral Link
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
