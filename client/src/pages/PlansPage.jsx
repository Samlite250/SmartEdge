import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TrendingUp, DollarSign, Calendar, Shield, ArrowRight, Check } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { investmentApi } from '../services/api'
import { formatCurrency } from '../lib/utils'

export default function PlansPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    investmentApi.getPlans()
      .then(setPlans)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const colors = [
    'from-secondary to-secondary-dark',
    'from-primary to-primary-dark',
    'from-accent to-accent-light',
    'from-accent to-accent-light',
    'from-secondary-light to-secondary',
    'from-accent to-accent-light',
  ]
  const badges = [null, 'green-gradient', 'accent-gradient', null, null, null]

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Investment Plans</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">Choose the perfect plan to start earning daily returns on your investment</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <Card key={i}><CardContent><div className="h-48 bg-border/50 rounded-lg animate-pulse" /></CardContent></Card>)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card hover className="relative overflow-hidden h-full flex flex-col">
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[40px] bg-gradient-to-br ${colors[i % colors.length]} opacity-10`} />
                  {badges[i] && (
                    <div className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full ${badges[i]} text-white text-[10px] font-bold uppercase tracking-wider shadow-lg`}>
                      {badges[i] === 'accent-gradient' ? 'Popular' : 'Best ROI'}
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{plan.name}</CardTitle>
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${colors[i % colors.length]} text-white text-xs font-semibold`}>
                        {plan.daily_return}% Daily
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="text-center mb-6">
                      <p className="text-3xl font-bold text-text-primary">{formatCurrency(plan.min_investment)}</p>
                      <p className="text-sm text-text-muted">Minimum investment</p>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 text-sm text-text-secondary">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span>{formatCurrency(plan.min_investment)} - {plan.max_investment ? formatCurrency(plan.max_investment) : '∞'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-text-secondary">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span>{plan.total_return}% total return ({plan.daily_return}% × {plan.duration}d)</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-text-secondary">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{plan.duration} days</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-text-secondary">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="capitalize">{plan.risk_level} risk</span>
                      </div>
                      {plan.features?.length > 0 && (
                        <div className="pt-2 space-y-1">
                          {plan.features.map(f => (
                            <div key={f} className="flex items-center gap-1.5 text-xs text-text-muted">
                              <Check className="w-3 h-3 text-success" /> {f}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link to="/register" className="mt-6">
                      <Button className="w-full">Get Started <ArrowRight className="w-4 h-4" /></Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
