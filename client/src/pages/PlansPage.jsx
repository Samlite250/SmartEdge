import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TrendingUp, DollarSign, Calendar, Shield, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'

const plans = [
  { name: 'Starter', min: 10, max: 99, daily: 0.5, duration: 30, color: 'from-secondary to-secondary-dark', badge: null },
  { name: 'Growth', min: 100, max: 999, daily: 0.8, duration: 45, color: 'from-primary to-primary-dark', badge: 'green-gradient' },
  { name: 'Premium', min: 1000, max: 9999, daily: 1.2, duration: 60, color: 'from-accent to-accent-light', badge: 'accent-gradient' },
  { name: 'Elite', min: 10000, max: 100000, daily: 2.0, duration: 90, color: 'from-accent to-accent-light', badge: null },
  { name: 'Staking', min: 50, max: 5000, daily: 0.35, duration: 180, color: 'from-secondary-light to-secondary', badge: null },
  { name: 'Gold', min: 500, max: 50000, daily: 1.5, duration: 60, color: 'from-accent to-accent-light', badge: null },
]

export default function PlansPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Investment Plans</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Choose the perfect plan to start earning daily returns on your investment
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card hover className="relative overflow-hidden h-full flex flex-col">
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[40px] bg-gradient-to-br ${plan.color} opacity-10`} />
                {plan.badge && (
                  <div className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full ${plan.badge} text-white text-[10px] font-bold uppercase tracking-wider shadow-lg`}>
                    {plan.badge === 'accent-gradient' ? 'Popular' : 'Best ROI'}
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${plan.color} text-white text-xs font-semibold`}>
                      {plan.daily}% Daily
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="text-center mb-6">
                    <p className="text-3xl font-bold text-text-primary">${plan.min.toLocaleString()}</p>
                    <p className="text-sm text-text-muted">Minimum investment</p>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span>${plan.min.toLocaleString()} - ${plan.max.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span>{(plan.min * plan.daily / 100 * plan.duration).toFixed(0)}% - {(plan.max * plan.daily / 100 * plan.duration).toFixed(0)}% total return</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{plan.duration} days</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>Daily profit payout</span>
                    </div>
                  </div>

                  <Link to="/register" className="mt-6">
                    <Button className="w-full">Invest Now <ArrowRight className="w-4 h-4" /></Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
