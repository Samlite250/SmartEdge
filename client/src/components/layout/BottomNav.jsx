import { Link, useLocation } from 'react-router-dom'
import { Home, TrendingUp, Wallet, History, User, Headphones } from 'lucide-react'
import { cn } from '../../lib/utils'

const tabs = [
  { name: 'Home', path: '/dashboard', icon: Home },
  { name: 'Invest', path: '/invest', icon: TrendingUp },
  { name: 'Wallet', path: '/wallet', icon: Wallet },
  { name: 'History', path: '/history', icon: History },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Support', path: '/support', icon: Headphones },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border/50 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = location.pathname === tab.path
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                'flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-colors',
                isActive ? 'text-primary' : 'text-text-muted'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
