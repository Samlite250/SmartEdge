import { useState } from 'react'
import { Routes, Route, Outlet, Link, Navigate, useLocation } from 'react-router-dom'
import { ToastProvider } from './components/ui/Toast'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { useAuth } from './hooks/useAuth'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import PlansPage from './pages/PlansPage'
import AboutPage from './pages/AboutPage'
import FAQPage from './pages/FAQPage'
import ContactPage from './pages/ContactPage'
import DashboardHome from './pages/dashboard/DashboardHome'
import InvestPage from './pages/dashboard/InvestPage'
import WalletPage from './pages/dashboard/WalletPage'
import HistoryPage from './pages/dashboard/HistoryPage'
import ProfilePage from './pages/dashboard/ProfilePage'
import SupportPage from './pages/dashboard/SupportPage'
import MyTeamPage from './pages/dashboard/MyTeamPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminDeposits from './pages/admin/AdminDeposits'
import AdminWithdrawals from './pages/admin/AdminWithdrawals'
import AdminInvestments from './pages/admin/AdminInvestments'
import AdminTransactions from './pages/admin/AdminTransactions'
import AdminReferrals from './pages/admin/AdminReferrals'
import AdminSettings from './pages/admin/AdminSettings'
import AdminSetupPage from './pages/AdminSetupPage'
import AdminLoginPage from './pages/AdminLoginPage'

const adminNavItems = [
  { label: 'Overview', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'Users', path: '/admin/users', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { label: 'Deposits', path: '/admin/deposits', icon: 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4' },
  { label: 'Withdrawals', path: '/admin/withdrawals', icon: 'M17 8V20m0 0l4-4m-4 4l-4-4M7 4v12m0 0L3 12m4 4l4-4' },
  { label: 'Investments', path: '/admin/investments', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { label: 'Transactions', path: '/admin/transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { label: 'Referrals', path: '/admin/referrals', icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' },
  { label: 'Settings', path: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]

function SidebarContent({ isActive, logout, onClose }) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-border/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl card-gradient flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-white font-bold text-sm">SE</span>
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">SmartEdge</p>
            <p className="text-[10px] font-semibold text-primary uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-surface text-text-muted hover:text-text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {adminNavItems.map(item => {
          const active = isActive(item.path)
          return (
            <Link key={item.path} to={item.path} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${active
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              <svg className={`w-5 h-5 flex-shrink-0 transition-colors ${active ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'}`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span>{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-border/50 space-y-1 flex-shrink-0">
        <Link to="/dashboard" onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-all">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
        <button onClick={() => { logout(); onClose?.() }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger/70 hover:text-danger hover:bg-danger/10 transition-all">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </>
  )
}

function AdminLayout() {
  const { isAdmin, logout } = useAuth()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (!isAdmin) return <Navigate to="/dashboard" replace />

  const isActive = (path) => path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path)
  const currentLabel = adminNavItems.find(n => isActive(n.path))?.label || 'Overview'

  return (
    <div className="min-h-screen bg-background flex">

      {/* ── Desktop Sidebar (always visible ≥ lg) ── */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-50 border-r border-border/50" style={{ background: '#0d1117' }}>
        <SidebarContent isActive={isActive} logout={logout} onClose={null} />
      </aside>

      {/* ── Mobile Drawer overlay ── */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50"
          onClick={() => setDrawerOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          {/* Drawer panel */}
          <aside
            className="absolute inset-y-0 left-0 w-72 flex flex-col border-r border-border/50 shadow-2xl"
            style={{ background: '#0d1117' }}
            onClick={e => e.stopPropagation()}
          >
            <SidebarContent isActive={isActive} logout={logout} onClose={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Mobile Top Bar (< lg) ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 border-b border-border/50" style={{ background: '#0d1117' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg hover:bg-surface text-text-muted hover:text-text-primary transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg card-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">SE</span>
            </div>
            <span className="text-xs font-bold text-text-primary">{currentLabel}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">Admin</span>
          <Link to="/dashboard" className="text-xs text-text-muted hover:text-text-primary whitespace-nowrap">← Exit</Link>
        </div>
      </div>

      {/* ── Main content area ── */}
      <div className="flex-1 lg:pl-64 min-w-0">
        {/* Desktop topbar */}
        <header className="hidden lg:flex sticky top-0 z-40 h-14 items-center justify-between px-6 border-b border-border/50" style={{ background: 'rgba(13,17,23,0.92)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>Admin Panel</span>
            <span className="opacity-40">/</span>
            <span className="text-text-primary font-medium">{currentLabel}</span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            Administrator
          </span>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-6 pt-20 lg:pt-6 max-w-[1400px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-setup" element={<AdminSetupPage />} />

        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="invest" element={<InvestPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="my-team" element={<MyTeamPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="deposits" element={<AdminDeposits />} />
          <Route path="withdrawals" element={<AdminWithdrawals />} />
          <Route path="investments" element={<AdminInvestments />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="referrals" element={<AdminReferrals />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}

export default App
