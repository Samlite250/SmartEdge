import { motion } from 'framer-motion'
import { Shield, Users, Globe, Award, TrendingUp, Heart } from 'lucide-react'

const values = [
  { title: 'Security First', description: 'Enterprise-grade security measures to protect your investments and data.', icon: Shield },
  { title: 'Global Access', description: 'Invest from anywhere in the world with support for multiple payment methods.', icon: Globe },
  { title: 'Trust & Transparency', description: 'Clear terms, real-time tracking, and full visibility into your investments.', icon: Award },
  { title: 'Community Driven', description: 'Built by investors, for investors. Your success is our mission.', icon: Users },
]

const milestones = [
  { year: '2023', title: 'Platform Launch', desc: 'Smart Edge launched with a vision to democratize digital investing.' },
  { year: '2024', title: '50K+ Users', desc: 'Reached over 50,000 registered users across 150+ countries.' },
  { year: '2025', title: '$25M Invested', desc: 'Total investments on the platform surpassed $25 million.' },
  { year: '2026', title: 'Global Expansion', desc: 'Expanded payment options and launched in new markets worldwide.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-text-primary mb-4">
            About Smart Edge
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-text-secondary text-lg max-w-3xl mx-auto">
            We're on a mission to make digital wealth creation accessible to everyone through secure, 
            transparent, and innovative investment solutions.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl font-bold text-text-primary mb-4">Our Mission</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Smart Edge was founded with a simple yet powerful vision: to bridge the gap between 
              traditional finance and the digital economy, empowering individuals worldwide to build 
              sustainable wealth through smart investments.
            </p>
            <p className="text-text-secondary leading-relaxed">
              We combine cutting-edge technology with deep financial expertise to create a platform 
              that is secure, user-friendly, and profitable for investors of all experience levels.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-[32px] p-8">
            <div className="grid grid-cols-2 gap-6 text-center">
              {[
                { value: '50K+', label: 'Users' },
                { value: '$25M+', label: 'Invested' },
                { value: '150+', label: 'Countries' },
                { value: '99.9%', label: 'Uptime' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map((value, i) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-card border border-border/50"
              >
                <div className="w-12 h-12 rounded-xl card-gradient flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{value.title}</h3>
                <p className="text-sm text-text-secondary">{value.description}</p>
              </motion.div>
            )
          })}
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent hidden md:block" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-0 md:pl-20"
                >
                  <div className="hidden md:flex absolute left-4 top-1 w-9 h-9 rounded-full card-gradient items-center justify-center text-white font-bold text-sm -translate-x-1/2">
                    {m.year.slice(-2)}
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-card border border-border/50">
                    <span className="text-primary font-bold text-sm">{m.year}</span>
                    <h3 className="text-lg font-semibold text-text-primary mt-1">{m.title}</h3>
                    <p className="text-text-secondary text-sm mt-1">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
