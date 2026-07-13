import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { LogOut, Bell, ShieldCheck } from 'lucide-react'
import { getCountryFlag } from '../../lib/countries'

const navLinks = [
  { name: 'Home', path: '/dashboard' },
  { name: 'Invest', path: '/invest' },
  { name: 'Wallet', path: '/wallet' },
  { name: 'History', path: '/history' },
  { name: 'Profile', path: '/profile' },
]

export function DashboardLayout() {
  const { user, loading, logout, isAdmin } = useAuth()
  const location = useLocation()
  const countryFlag = getCountryFlag(user?.country)

  if (!loading && !user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link to="/dashboard" className="w-8 h-8 rounded-lg card-gradient flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">SE</span>
            </Link>
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-text-primary">SmartEdge</p>
              <p className="text-[9px] sm:text-[10px] text-text-muted whitespace-nowrap tracking-wide">Invest High and Earn More!</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface'}`}
              >
                {navLinks.find(nl => nl.path === link.path)?.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {isAdmin && (
              <Link to="/admin" className="relative flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Panel</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
              </Link>
            )}
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

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
