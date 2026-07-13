import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Phone, Globe, Shield, Calendar, Lock, Save, KeyRound, LogOut, Headphones, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { CountrySelect } from '../../components/ui/CountrySelect'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../components/ui/Toast'
import { userApi } from '../../services/api'
import { formatDate, getInitials } from '../../lib/utils'
import { getCountryCurrency } from '../../lib/countries'

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [detailsForm, setDetailsForm] = useState({
    fullName: user?.full_name || '',
    phone: user?.phone || '',
    country: user?.country || '',
  })
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [updatingDetails, setUpdatingDetails] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)

  const handleUpdateDetails = async (e) => {
    e.preventDefault()
    if (!detailsForm.fullName.trim()) {
      return toast('Full name is required', 'warning')
    }
    setUpdatingDetails(true)
    try {
      const updated = await userApi.updateProfile(detailsForm)
      const currency = getCountryCurrency(detailsForm.country)
      updateUser({
        full_name: updated.full_name,
        phone: updated.phone,
        country: updated.country,
        currency: updated.currency || currency,
      })
      toast('Profile details updated successfully!', 'success')
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to update profile details', 'error')
    } finally {
      setUpdatingDetails(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!passwordForm.newPassword) {
      return toast('Please enter a new password', 'warning')
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast('Passwords do not match', 'warning')
    }
    setUpdatingPassword(true)
    try {
      await userApi.changePassword(passwordForm.newPassword)
      toast('Password changed successfully!', 'success')
      setPasswordForm({ newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to change password', 'error')
    } finally {
      setUpdatingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
        <p className="text-text-secondary">Manage your account details and security settings</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Account SumaryCard */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-20 h-20 rounded-full card-gradient flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                {getInitials(user?.full_name)}
              </div>
              <h2 className="text-xl font-bold text-text-primary">{user?.full_name || 'User'}</h2>
              <span className="mt-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                {user?.role || 'User'}
              </span>
              <p className="text-xs text-text-muted mt-3">Member since {user?.created_at ? formatDate(user.created_at) : 'N/A'}</p>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-text-muted" />
                  <div>
                    <p className="text-xs text-text-muted">Registered Email</p>
                    <p className="text-sm font-medium text-text-primary truncate max-w-[180px]">{user?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-text-muted" />
                  <div>
                    <p className="text-xs text-text-muted">Country / Currency</p>
                    <p className="text-sm font-medium text-text-primary">
                      {user?.country || 'N/A'} ({user?.currency || 'USD'})
                    </p>
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

          <Link to="/support" className="flex items-center gap-3 p-4 rounded-2xl bg-[#131A28] border border-white/5 hover:border-white/10 hover:bg-[#1a2332] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-5 h-5 text-[#25D366]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary group-hover:text-[#25D366] transition-colors">Support</p>
              <p className="text-xs text-text-muted">Get help via WhatsApp</p>
            </div>
            <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-[#25D366] transition-colors" />
          </Link>

          <Card>
            <CardContent className="pt-6">
              <Button
                variant="outline"
                className="w-full border-danger/30 text-danger hover:bg-danger/10 hover:border-danger"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Profile Edit Forms */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateDetails} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Enter full name"
                    icon={User}
                    value={detailsForm.fullName}
                    onChange={(e) => setDetailsForm({ ...detailsForm, fullName: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone Number"
                    placeholder="Enter phone number"
                    icon={Phone}
                    value={detailsForm.phone}
                    onChange={(e) => setDetailsForm({ ...detailsForm, phone: e.target.value })}
                  />
                </div>
                <CountrySelect
                  value={detailsForm.country}
                  onChange={country => setDetailsForm({ ...detailsForm, country })}
                />
                <div className="flex justify-end">
                  <Button type="submit" loading={updatingDetails}>
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Min 6 characters"
                    icon={Lock}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Repeat new password"
                    icon={Lock}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="outline" loading={updatingPassword}>
                    <KeyRound className="w-4 h-4 mr-2" /> Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
