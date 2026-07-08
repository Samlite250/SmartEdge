import { motion } from 'framer-motion'
import { Shield, Zap, Globe, ArrowRight, BarChart3, Wallet, TrendingUp, Users, Gift, Headphones, Clock, Coins, CheckCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'

const stats = [
  { label: 'Registered Users', value: '50,000+', icon: Users },
  { label: 'Total Investments', value: '$25M+', icon: BarChart3 },
  { label: 'Total Withdrawals', value: '$18M+', icon: Wallet },
  { label: 'Countries Supported', value: '150+', icon: Globe },
]

const features = [
  { title: 'Daily Earnings', description: 'Automated daily returns credited to your wallet every 24 hours', icon: TrendingUp },
  { title: 'Fast Withdrawals', description: 'Instant withdrawal processing with support for mobile money and crypto', icon: Zap },
  { title: 'Mobile Money', description: 'Seamless payments via MTN MoMo, M-Pesa, Airtel Money & more', icon: Coins },
  { title: 'Crypto Payments', description: 'Invest with USDT, Bitcoin, Ethereum and major cryptocurrencies', icon: Wallet },
  { title: 'Secure Platform', description: 'Enterprise-grade encryption and advanced security protocols', icon: Shield },
  { title: 'Referral Rewards', description: 'Earn passive income by referring friends and family', icon: Gift },
  { title: '24/7 Support', description: 'Dedicated support team available around the clock via chat and email', icon: Headphones },
  { title: 'Easy Investing', description: 'Start building your portfolio in minutes with a simple 3-step process', icon: Clock },
]

const steps = [
  { number: '01', title: 'Create Your Account', description: 'Sign up free in under 2 minutes with just your email' },
  { number: '02', title: 'Fund Your Wallet', description: 'Deposit via mobile money, crypto, or bank transfer' },
  { number: '03', title: 'Select a Plan', description: 'Choose from 6 investment plans tailored to your goals' },
  { number: '04', title: 'Earn Daily Returns', description: 'Watch your wealth grow with automated daily payouts' },
  { number: '05', title: 'Withdraw Anytime', description: 'Access your funds instantly with zero withdrawal delays' },
]

const countries = [
  { name: 'Uganda', methods: ['MTN Mobile Money', 'Airtel Money'], flag: '🇺🇬' },
  { name: 'Kenya', methods: ['M-Pesa', 'Airtel Money'], flag: '🇰🇪' },
  { name: 'Rwanda', methods: ['MTN MoMo', 'Airtel Money'], flag: '🇷🇼' },
  { name: 'Burundi', methods: ['Lumicash', 'EcoCash'], flag: '🇧🇮' },
  { name: 'Global', methods: ['USDT', 'Bitcoin', 'Ethereum'], flag: '🌍' },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5 },
}

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] min-h-dvh flex items-center overflow-hidden bg-gradient-to-br from-primary/[0.03] via-white to-accent/[0.03]">
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/[0.06] rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-accent/[0.06] rounded-full blur-[100px]" />

      <div className="container-page relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary text-sm font-medium mb-6 border border-primary/10">
              <Shield className="w-4 h-4" /> Trusted by 50,000+ investors
            </div>

            <h1 className="text-[2rem] sm:text-[2.75rem] lg:text-[3.5rem] font-bold text-text-primary leading-[1.1] tracking-tight mb-6">
              Grow Your Digital Wealth With{' '}
              <span className="gradient-text">Smart Edge</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-8 max-w-lg">
              Experience secure investing with automated daily returns powered by modern financial technology.
              Start building your wealth today.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg">
                  Start Investing <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/plans">
                <Button variant="outline" size="lg">View Investment Plans</Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-10">
              {[
                { text: 'Secure Platform', icon: Shield },
                { text: 'Fast Withdrawals', icon: Zap },
                { text: 'Global Access', icon: Globe },
              ].map(item => {
                const Icon = item.icon
                return (
                  <div key={item.text} className="flex items-center gap-2 text-sm text-text-secondary">
                    <Icon className="w-4 h-4 text-primary" /> {item.text}
                  </div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="glass-strong rounded-[32px] p-8 shadow-floating">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-muted">Portfolio Balance</p>
                      <p className="text-3xl font-bold text-text-primary tracking-tight">$127,450.00</p>
                      <p className="text-sm text-success flex items-center gap-1 mt-1">
                        <TrendingUp className="w-4 h-4" /> +12.5% this month
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl card-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                      <Wallet className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <div className="h-px bg-border/50" />

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Today's Earnings", value: '+$245.00', color: 'text-success' },
                      { label: 'Active Investments', value: '8 Plans', color: 'text-info' },
                      { label: 'Total Earned', value: '$12,450.00', color: 'text-primary' },
                      { label: 'Referral Bonus', value: '$850.00', color: 'text-accent' },
                    ].map(item => (
                      <div key={item.label} className="bg-background rounded-xl p-4">
                        <p className="text-xs text-text-muted mb-1">{item.label}</p>
                        <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/15 rounded-full blur-2xl animate-float" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }} />
            </div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 relative">
      <div className="container-page">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-[32px]" />
          <div className="relative glass-strong rounded-[32px] p-8 lg:p-10 shadow-card">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 rounded-xl card-gradient flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/15">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">{stat.value}</p>
                    <p className="text-sm text-text-muted">{stat.label}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-50" />
      <div className="container-page relative">
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-4 block">Simple Process</span>
          <h2 className="section-title mb-4">How It Works</h2>
          <p className="section-subtitle">
            Start your investment journey in five simple steps
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/30 to-transparent hidden md:block" />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-0 md:pl-16"
              >
                <div className="hidden md:flex absolute left-0 top-0 w-[46px] h-[46px] rounded-2xl card-gradient items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20">
                  {step.number}
                </div>
                <div className="bg-background rounded-2xl p-6 border border-border/50 hover:border-primary/20 transition-colors duration-300">
                  <span className="text-primary font-bold text-sm md:hidden mb-2 block">Step {step.number}</span>
                  <h3 className="text-lg font-semibold text-text-primary">{step.title}</h3>
                  <p className="text-text-secondary text-sm mt-1.5 leading-relaxed">{step.description}</p>
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
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="container-page relative">
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-4 block">Why Choose Us</span>
          <h2 className="section-title mb-4">Everything You Need</h2>
          <p className="section-subtitle">
            A comprehensive platform designed to help you grow and manage your digital wealth
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white rounded-2xl p-6 border border-border/50 hover:border-primary/20 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl card-gradient flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
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
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="container-page relative">
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-4 block">Global Reach</span>
          <h2 className="section-title mb-4">Supported Countries</h2>
          <p className="section-subtitle">
            We support investors from across Africa and around the world with local payment methods
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {countries.map((country, i) => (
            <motion.div
              key={country.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-background rounded-2xl p-6 border border-border/50 hover:border-primary/20 hover:shadow-card-hover transition-all duration-300 text-center group"
            >
              <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform duration-300">{country.flag}</span>
              <h3 className="font-semibold text-text-primary mb-3 text-sm">{country.name}</h3>
              <div className="space-y-1.5">
                {country.methods.map(method => (
                  <div key={method} className="inline-flex items-center gap-1 text-xs bg-white rounded-lg px-2.5 py-1.5 text-text-secondary border border-border/50">
                    <CheckCircle className="w-3 h-3 text-primary" /> {method}
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
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[32px] card-gradient p-10 lg:p-16 text-center"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.06] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/[0.04] rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-white/70 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Join over 50,000 investors already earning daily returns with Smart Edge. 
              No hidden fees, no lock-in periods.
            </p>
            <Link to="/register">
              <Button
                variant="secondary"
                size="lg"
                className="shadow-xl shadow-white/10 hover:shadow-2xl hover:shadow-white/20"
              >
                Create Free Account <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
