import { motion } from 'framer-motion'
import { Shield, Zap, Globe, ArrowRight, BarChart3, Wallet, TrendingUp, Users, Gift, Headphones, Clock, Coins } from 'lucide-react'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'

const stats = [
  { label: 'Registered Users', value: '50,000+', icon: Users },
  { label: 'Total Investments', value: '$25M+', icon: BarChart3 },
  { label: 'Total Withdrawals', value: '$18M+', icon: Wallet },
  { label: 'Countries Supported', value: '150+', icon: Globe },
]

const features = [
  { title: 'Daily Earnings', description: 'Earn daily returns on your investments with automated payouts', icon: TrendingUp },
  { title: 'Fast Withdrawals', description: 'Withdraw your earnings instantly with zero delays', icon: Zap },
  { title: 'Mobile Money', description: 'Support for MTN MoMo, M-Pesa, Airtel Money & more', icon: Coins },
  { title: 'Crypto Payments', description: 'Invest with USDT, Bitcoin, Ethereum and other cryptocurrencies', icon: Wallet },
  { title: 'Secure Platform', description: 'Enterprise-grade security with encryption and 2FA', icon: Shield },
  { title: 'Referral Rewards', description: 'Earn bonuses by referring friends and family', icon: Gift },
  { title: '24/7 Support', description: 'Round-the-clock customer support via chat and email', icon: Headphones },
  { title: 'Easy Investing', description: 'Start investing in minutes with our simple platform', icon: Clock },
]

const steps = [
  { number: '01', title: 'Register Account', description: 'Create your free account in less than 2 minutes' },
  { number: '02', title: 'Deposit Funds', description: 'Add funds via mobile money or crypto payments' },
  { number: '03', title: 'Choose Plan', description: 'Select an investment plan that suits your goals' },
  { number: '04', title: 'Earn Daily', description: 'Receive daily returns directly to your wallet' },
  { number: '05', title: 'Withdraw', description: 'Withdraw your profits anytime, anywhere' },
]

const countries = [
  { name: 'Uganda', methods: ['MTN Mobile Money', 'Airtel Money'], flag: '🇺🇬' },
  { name: 'Kenya', methods: ['M-Pesa', 'Airtel Money'], flag: '🇰🇪' },
  { name: 'Rwanda', methods: ['MTN MoMo', 'Airtel Money'], flag: '🇷🇼' },
  { name: 'Burundi', methods: ['Lumicash', 'EcoCash'], flag: '🇧🇮' },
  { name: 'International', methods: ['USDT', 'Bitcoin', 'Ethereum'], flag: '🌍' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-accent/5" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" /> Trusted by 50,000+ investors
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6">
              Grow Your Digital Wealth With{' '}
              <span className="gradient-text">Smart Edge</span>
            </h1>

            <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-xl">
              Experience secure investing with daily rewards powered by modern financial technology. 
              Start building your digital wealth today.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg">Start Investing <ArrowRight className="w-5 h-5" /></Button>
              </Link>
              <Link to="/plans">
                <Button variant="outline" size="lg">View Plans</Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 mt-10">
              {['Secure Platform', 'Fast Withdrawals', 'Global Access'].map(badge => (
                <div key={badge} className="flex items-center gap-2 text-sm text-text-secondary">
                  <Shield className="w-4 h-4 text-primary" /> {badge}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="glass rounded-[32px] p-8 shadow-floating">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-muted">Portfolio Balance</p>
                      <p className="text-3xl font-bold text-text-primary">$127,450.00</p>
                      <p className="text-sm text-success flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> +12.5% this month
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl card-gradient flex items-center justify-center">
                      <Wallet className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Today\'s Earnings', value: '+$245.00', color: 'text-success' },
                      { label: 'Active Investments', value: '8 Plans', color: 'text-info' },
                      { label: 'Total Earned', value: '$12,450.00', color: 'text-primary' },
                      { label: 'Referral Bonus', value: '$850.00', color: 'text-accent' },
                    ].map(item => (
                      <div key={item.label} className="bg-background rounded-2xl p-4">
                        <p className="text-xs text-text-muted mb-1">{item.label}</p>
                        <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function StatsSection() {
  return (
    <section className="py-16 -mt-16 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-[32px] p-8 shadow-card">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-6 h-6 text-primary mx-auto mb-3" />
                  <p className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">{stat.value}</p>
                  <p className="text-sm text-text-muted">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export function HowItWorksSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">How It Works</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Start your investment journey in five simple steps
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-0 md:pl-20"
              >
                <div className="hidden md:flex absolute left-4 top-0 w-9 h-9 rounded-full card-gradient items-center justify-center text-white font-bold text-sm -translate-x-1/2">
                  {step.number}
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-card border border-border/50">
                  <span className="text-primary font-bold text-sm md:hidden">Step {step.number}</span>
                  <h3 className="text-lg font-semibold text-text-primary mt-1">{step.title}</h3>
                  <p className="text-text-secondary text-sm mt-1">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Why Choose Smart Edge</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Everything you need to grow your digital wealth
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-background rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl card-gradient flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function CountriesSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Supported Countries</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            We support investors from around the world
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {countries.map((country, i) => (
            <motion.div
              key={country.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-border/50 text-center hover:shadow-card-hover transition-all duration-300"
            >
              <span className="text-4xl block mb-3">{country.flag}</span>
              <h3 className="font-semibold text-text-primary mb-3">{country.name}</h3>
              <div className="space-y-2">
                {country.methods.map(method => (
                  <div key={method} className="text-xs bg-background rounded-lg px-3 py-1.5 text-text-secondary">
                    {method}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] card-gradient p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of investors already earning daily returns with Smart Edge.
            </p>
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Create Free Account <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
