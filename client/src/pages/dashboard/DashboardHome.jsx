import { motion } from 'framer-motion'
import { Wallet, TrendingUp, Users, ArrowUpRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'

const stats = [
  { label: 'Portfolio Balance', value: '$0.00', icon: Wallet, color: 'text-primary' },
  { label: "Today's Earnings", value: '$0.00', icon: TrendingUp, color: 'text-success' },
  { label: 'Active Investments', value: '0', icon: ArrowUpRight, color: 'text-info' },
  { label: 'Referral Bonus', value: '$0.00', icon: Users, color: 'text-accent' },
]

export default function DashboardHome() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome back, {user?.full_name || 'User'}
        </h1>
        <p className="text-text-secondary">Here's your portfolio overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-text-muted font-medium">{stat.label}</CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary text-center py-8">
            No recent activity. Start investing to see your transactions here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
