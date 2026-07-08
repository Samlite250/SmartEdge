import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Calendar } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'

const plans = [
  { name: 'Starter', min: 10, max: 99, daily: 0.5, duration: 30, color: 'from-secondary to-secondary-dark', badge: null },
  { name: 'Growth', min: 100, max: 999, daily: 0.8, duration: 45, color: 'from-primary to-primary-dark', badge: 'green-gradient' },
  { name: 'Premium', min: 1000, max: 9999, daily: 1.2, duration: 60, color: 'from-accent to-accent-light', badge: 'accent-gradient' },
  { name: 'Elite', min: 10000, max: 100000, daily: 2.0, duration: 90, color: 'from-accent to-accent-light', badge: null },
]

export default function InvestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Investment Plans</h1>
        <p className="text-text-secondary">Choose a plan that suits your investment goals</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hover className="relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[40px] bg-gradient-to-br ${plan.color} opacity-10`} />
              {plan.badge && (
                <div className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full ${plan.badge} text-white text-[10px] font-bold uppercase tracking-wider shadow-lg`}>
                  {plan.badge === 'accent-gradient' ? 'Popular' : 'Best ROI'}
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${plan.color} text-white text-xs font-semibold`}>
                  {plan.daily}% Daily
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <DollarSign className="w-4 h-4" />
                    <span>${plan.min.toLocaleString()} - ${plan.max.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <TrendingUp className="w-4 h-4" />
                    <span>Up to {(plan.min * plan.daily / 100 * plan.duration).toFixed(0)}% total return</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Calendar className="w-4 h-4" />
                    <span>{plan.duration} days duration</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
