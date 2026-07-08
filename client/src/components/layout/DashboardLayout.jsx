import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { LogOut, Bell } from 'lucide-react'

export function DashboardLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg card-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">SE</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">{user?.full_name || 'User'}</p>
              <p className="text-xs text-text-muted">Welcome back</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl hover:bg-background text-text-muted relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
            <Button variant="ghost" size="sm" onClick={logout} className="hidden lg:flex">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
