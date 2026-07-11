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
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminDeposits from './pages/admin/AdminDeposits'
import AdminWithdrawals from './pages/admin/AdminWithdrawals'
import AdminInvestments from './pages/admin/AdminInvestments'
import AdminTransactions from './pages/admin/AdminTransactions'
import AdminReferrals from './pages/admin/AdminReferrals'
import AdminSettings from './pages/admin/AdminSettings'
import AdminSetupPage from './pages/AdminSetupPage'

const adminNavItems = [
  { label: 'Overview', path: '/admin' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Deposits', path: '/admin/deposits' },
  { label: 'Withdrawals', path: '/admin/withdrawals' },
  { label: 'Investments', path: '/admin/investments' },
  { label: 'Transactions', path: '/admin/transactions' },
  { label: 'Referrals', path: '/admin/referrals' },
  { label: 'Settings', path: '/admin/settings' },
]

function AdminLayout() {
  const { isAdmin, logout } = useAuth()
  const location = useLocation()

  if (!isAdmin) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="w-8 h-8 rounded-lg card-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">SE</span>
            </Link>
            <span className="hidden sm:block text-xs font-semibold text-primary uppercase tracking-wider">Admin Panel</span>
          </div>
          {/* Scrollable nav tabs on mobile */}
          <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-none mx-4 flex-1">
            {adminNavItems.map(item => (
              <Link key={item.path} to={item.path}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="text-xs text-text-muted hover:text-text-primary whitespace-nowrap">← Dashboard</Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6"><Outlet /></main>
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
