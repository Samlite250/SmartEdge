import { User, Mail, Phone, Globe, Shield, Calendar } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'
import { formatDate, getInitials } from '../../lib/utils'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
        <p className="text-text-secondary">Manage your account details</p>
      </div>

      <Card>
        <div className="flex flex-col items-center py-6">
          <div className="w-20 h-20 rounded-full card-gradient flex items-center justify-center text-white text-2xl font-bold mb-4">
            {getInitials(user?.full_name)}
          </div>
          <h2 className="text-xl font-bold text-text-primary">{user?.full_name || 'User'}</h2>
          <p className="text-sm text-text-muted">Member since {user?.created_at ? formatDate(user.created_at) : 'N/A'}</p>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Email</p>
                <p className="text-sm font-medium text-text-primary">{user?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Phone</p>
                <p className="text-sm font-medium text-text-primary">{user?.phone || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Country</p>
                <p className="text-sm font-medium text-text-primary">{user?.country || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Referral Code</p>
                <p className="text-sm font-medium text-text-primary">{user?.referral_code || 'N/A'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
