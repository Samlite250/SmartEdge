import { useState, useEffect, useCallback } from 'react'
import api from '../lib/api'

function normalizeUser(raw) {
  if (!raw) return null
  const profile = raw.profile || raw.user_metadata || {}
  return {
    id: raw.id,
    email: raw.email,
    token: raw.token || null,
    full_name: profile.full_name || raw.full_name || raw.email?.split('@')[0] || '',
    username: profile.username || raw.username || '',
    phone: profile.phone || raw.phone || '',
    country: profile.country || raw.country || '',
    currency: profile.currency || raw.currency || 'USD',
    role: profile.role || raw.role || 'user',
    status: profile.status || raw.status || 'active',
    referral_code: profile.referral_code || raw.referral_code || '',
    avatar_url: profile.avatar_url || raw.avatar_url || null,
    notification_settings: profile.notification_settings || raw.notification_settings || { email: true, push: true, sms: false },
    language: profile.language || raw.language || 'en',
    created_at: raw.created_at || profile.created_at || new Date().toISOString(),
    updated_at: raw.updated_at || profile.updated_at || null,
  }
}

export function useAuth() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('se_user')
    return stored ? normalizeUser(JSON.parse(stored)) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('se_token')
    if (token) {
      setLoading(true)
      api.get('/users/profile')
        .then(res => {
          const u = normalizeUser({ ...res.data, token })
          setUser(u)
          localStorage.setItem('se_user', JSON.stringify(u))
        })
        .catch(() => {
          localStorage.removeItem('se_token')
          localStorage.removeItem('se_user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback((rawUser, token, refreshToken) => {
    const u = normalizeUser({ ...rawUser, token })
    localStorage.setItem('se_token', token)
    if (refreshToken) localStorage.setItem('se_refresh_token', refreshToken)
    localStorage.setItem('se_user', JSON.stringify(u))
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('se_token')
    localStorage.removeItem('se_refresh_token')
    localStorage.removeItem('se_user')
    setUser(null)
  }, [])

  const updateUser = useCallback((profileData) => {
    setUser(prev => {
      const updated = { ...prev, ...profileData }
      localStorage.setItem('se_user', JSON.stringify(updated))
      return updated
    })
  }, [])

  const isAdmin = user?.role === 'admin'

  return { user, loading, login, logout, updateUser, isAdmin }
}
