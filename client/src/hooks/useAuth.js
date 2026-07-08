import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('se_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('se_token')
    if (token && !user) {
      setLoading(true)
      fetch('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            localStorage.removeItem('se_token')
            localStorage.removeItem('se_user')
            setUser(null)
          } else {
            const userData = { ...data, token }
            setUser(userData)
            localStorage.setItem('se_user', JSON.stringify(userData))
          }
        })
        .catch(() => {
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('se_token', token)
    localStorage.setItem('se_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('se_token')
    localStorage.removeItem('se_user')
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'

  return { user, loading, login, logout, isAdmin }
}
