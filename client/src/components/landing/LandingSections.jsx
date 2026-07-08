import { motion } from 'framer-motion'
import { Shield, Zap, Globe, ArrowRight, BarChart3, Wallet, TrendingUp, Users, Gift, Headphones, Clock, Coins, CheckCircle, LineChart, Network, Sparkles } from 'lucide-react'
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

const cryptoIcons = ['₿', 'Ξ', '◎', '₳', '●', '⬡']

function ChartLine() {
  return (
    <svg className="absolute bottom-0 left-0 w-full h-32 opacity-[0.04]" viewBox="0 0 1200 128" preserveAspectRatio="none">
      <path d="M0,64 C200,96 300,16 400,48 C500,80 600,0 700,32 C800,64 900,48 1000,16 C1100,32 1150,48 1200,64 L1200,128 L0,128 Z" fill="currentColor" />
    </svg>
  )
}

function CryptoCoin({ symbol, className, delay = 0 }) {
  return (
    <motion.span
      className={`absolute font-bold select-none pointer-events-none ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.08, 0.06], scale: [0, 1, 0.9] }}
      transition={{ duration: 2, delay, repeat: Infinity, repeatDelay: 3 }}
    >
      {symbol}
    </motion.span>
  )
}

function NetworkNodes() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1200 800" preserveAspectRatio="none">
      <circle cx="100" cy="200" r="3" fill="currentColor" />
      <circle cx="300" cy="100" r="2" fill="currentColor" />
      <circle cx="500" cy="300" r="4" fill="currentColor" />
      <circle cx="800" cy="150" r="2" fill="currentColor" />
      <circle cx="1000" cy="400" r="3" fill="currentColor" />
      <circle cx="1100" cy="200" r="2" fill="currentColor" />
      <circle cx="200" cy="500" r="2" fill="currentColor" />
      <circle cx="600" cy="600" r="3" fill="currentColor" />
      <circle cx="900" cy="700" r="2" fill="currentColor" />
      <line x1="100" y1="200" x2="300" y2="100" stroke="currentColor" strokeWidth="0.5" />
      <line x1="300" y1="100" x2="500" y2="300" stroke="currentColor" strokeWidth="0.5" />
      <line x1="500" y1="300" x2="800" y2="150" stroke="currentColor" strokeWidth="0.5" />
      <line x1="800" y1="150" x2="1000" y2="400" stroke="currentColor" strokeWidth="0.5" />
      <line x1="1000" y1="400" x2="1100" y2="200" stroke="currentColor" strokeWidth="0.5" />
      <line x1="200" y1="500" x2="600" y2="600" stroke="currentColor" strokeWidth="0.5" />
      <line x1="600" y1="600" x2="900" y2="700" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  )
}

function CandlestickChart() {
  return (
    <svg className="absolute right-12 bottom-12 w-48 h-32 opacity-[0.04]" viewBox="0 0 200 120" fill="currentColor">
      <rect x="10" y="60" width="8" height="40" rx="1" />
      <rect x="10" y="55" width="8" height="5" rx="1" opacity="0.5" />
      <rect x="10" y="100" width="8" height="5" rx="1" opacity="0.5" />
      <rect x="35" y="30" width="8" height="50" rx="1" />
      <rect x="35" y="25" width="8" height="5" rx="1" opacity="0.5" />
      <rect x="35" y="80" width="8" height="5" rx="1" opacity="0.5" />
      <rect x="60" y="70" width="8" height="35" rx="1" className="text-danger" />
      <rect x="60" y="65" width="8" height="5" rx="1" opacity="0.5" className="text-danger" />
      <rect x="60" y="105" width="8" height="5" rx="1" opacity="0.5" className="text-danger" />
      <rect x="85" y="20" width="8" height="55" rx="1" />
      <rect x="85" y="15" width="8" height="5" rx="1" opacity="0.5" />
      <rect x="85" y="75" width="8" height="5" rx="1" opacity="0.5" />
      <rect x="110" y="50" width="8" height="45" rx="1" className="text-danger" />
      <rect x="110" y="45" width="8" height="5" rx="1" opacity="0.5" className="text-danger" />
      <rect x="110" y="95" width="8" height="5" rx="1" opacity="0.5" className="text-danger" />
      <rect x="135" y="35" width="8" height="40" rx="1" />
      <rect x="135" y="30" width="8" height="5" rx="1" opacity="0.5" />
      <rect x="135" y="75" width="8" height="5" rx="1" opacity="0.5" />
      <rect x="160" y="65" width="8" height="30" rx="1" />
      <rect x="160" y="60" width="8" height="5" rx="1" opacity="0.5" />
      <rect x="160" y="95" width="8" height="5" rx="1" opacity="0.5" />
      <path d="M5,85 L30,70 L55,80 L80,55 L105,65 L130,45 L155,55 L180,40 L195,50" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
    </svg>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] min-h-dvh flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
      </div>

      <div className="absolute inset-0 bg-grid opacity-[0.04]" />
      <NetworkNodes />
      <CandlestickChart />
      <ChartLine />
      <CryptoCoin symbol="₿" className="text-primary top-[15%] left-[8%] text-5xl" delay={0} />
      <CryptoCoin symbol="Ξ" className="text-primary top-[25%] right-[12%] text-4xl" delay={0.5} />
      <CryptoCoin symbol="◎" className="text-accent bottom-[30%] left-[5%] text-3xl" delay={1} />
      <CryptoCoin symbol="₳" className="text-accent top-[10%] right-[25%] text-2xl" delay={1.5} />
      <CryptoCoin symbol="●" className="text-primary bottom-[20%] right-[8%] text-3xl" delay={2} />
      <CryptoCoin symbol="⬡" className="text-accent bottom-[40%] left-[15%] text-2xl" delay={2.5} />

      <div className="container-page relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/15 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" /> Trusted by 50,000+ investors
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
              <div className="absolute -inset-1 card-gradient rounded-[33px] opacity-20 blur" />
              <div className="relative glass-strong rounded-[32px] p-8 shadow-floating border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-muted">Portfolio Balance</p>
                      <p className="text-3xl font-bold text-text-primary tracking-tight">$127,450.00</p>
                      <p className="text-sm text-success flex items-center gap-1 mt-1">
                        <TrendingUp className="w-4 h-4" /> +12.5% this month
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl card-gradient flex items-center justify-center shadow-lg shadow-primary/30">
                      <Wallet className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <div className="relative h-20 overflow-hidden rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-transparent">
                    <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                      <path
                        d="M0,60 C20,65 40,45 60,50 C80,55 100,30 120,35 C140,40 160,15 180,20 C200,25 220,10 240,25 C260,40 280,30 300,35 L300,80 L0,80 Z"
                        fill="url(#chartGradient)"
                        opacity="0.3"
                      />
                      <path
                        d="M0,60 C20,65 40,45 60,50 C80,55 100,30 120,35 C140,40 160,15 180,20 C200,25 220,10 240,25 C260,40 280,30 300,35"
                        stroke="var(--color-primary)"
                        strokeWidth="2"
                        fill="none"
                      />
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/60" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Today's Earnings", value: '+$245.00', color: 'text-success' },
                      { label: 'Active Investments', value: '8 Plans', color: 'text-info' },
                      { label: 'Total Earned', value: '$12,450.00', color: 'text-primary' },
                      { label: 'Referral Bonus', value: '$850.00', color: 'text-accent' },
                    ].map(item => (
                      <div key={item.label} className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border/30">
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />
      <div className="container-page relative">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.06] via-transparent to-accent/[0.06] rounded-[32px]" />
          <div className="relative glass-strong rounded-[32px] p-8 lg:p-10 shadow-card border border-white/20">
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
                    <div className="w-12 h-12 rounded-xl card-gradient flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
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
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover opacity-[0.03]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white" />
      <div className="absolute inset-0 bg-dots opacity-30" />
      <CandlestickChart />

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
                <div className="bg-background rounded-2xl p-6 border border-border/50 hover:border-primary/20 hover:shadow-sm transition-all duration-300">
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
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover opacity-[0.03]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <NetworkNodes />

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
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
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
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover opacity-[0.03]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white" />
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
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-dark to-primary/95" />
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
      </div>
      <CryptoCoin symbol="₿" className="text-white/5 top-[10%] left-[8%] text-7xl" delay={0} />
      <CryptoCoin symbol="Ξ" className="text-white/5 bottom-[15%] right-[10%] text-6xl" delay={0.8} />
      <CryptoCoin symbol="◎" className="text-white/5 top-[30%] right-[20%] text-4xl" delay={1.6} />

      <div className="container-page relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[32px] p-10 lg:p-16 text-center"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.06] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/[0.04] rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 border border-white/10">
              <TrendingUp className="w-4 h-4" /> Start earning today
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-white/60 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Join over 50,000 investors already earning daily returns with Smart Edge. 
              No hidden fees, no lock-in periods.
            </p>
            <Link to="/register">
              <Button
                variant="secondary"
                size="lg"
                className="shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20"
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
