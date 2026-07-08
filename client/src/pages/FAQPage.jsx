import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'

const faqs = [
  {
    category: 'Getting Started',
    items: [
      { q: 'How do I create an account?', a: 'Click the "Get Started" button and fill in your details. You\'ll need to verify your email address before you can start investing.' },
      { q: 'Is there a minimum investment?', a: 'Yes, our minimum investment starts at $10 with the Starter plan. You can choose any plan that suits your budget.' },
      { q: 'How do I verify my account?', a: 'After registration, you\'ll receive a verification email. Click the link to verify your account and start investing.' },
    ]
  },
  {
    category: 'Investments',
    items: [
      { q: 'How do daily returns work?', a: 'Returns are calculated based on your investment amount and the daily percentage of your chosen plan. They are credited to your wallet every 24 hours.' },
      { q: 'Can I withdraw my investment early?', a: 'Early withdrawals are subject to terms of your specific plan. Some plans may have penalties for early withdrawal.' },
      { q: 'How are returns calculated?', a: 'Daily return = (Investment Amount × Daily Percentage) / 100. For example, investing $1,000 at 1% daily earns you $10 per day.' },
    ]
  },
  {
    category: 'Payments',
    items: [
      { q: 'What payment methods are accepted?', a: 'We accept mobile money (MTN MoMo, M-Pesa, Airtel Money), cryptocurrencies (USDT, BTC, ETH), and bank transfers.' },
      { q: 'How long do withdrawals take?', a: 'Withdrawals are processed within 24 hours. Mobile money withdrawals are typically instant once approved.' },
      { q: 'Are there any fees?', a: 'We charge minimal processing fees on withdrawals. Deposits are free. Check our fee schedule for details.' },
    ]
  },
  {
    category: 'Security',
    items: [
      { q: 'Is my money safe?', a: 'We use enterprise-grade security measures including encryption, secure servers, and regular security audits to protect your funds and data.' },
      { q: 'How do you protect my personal information?', a: 'Your data is encrypted and stored securely. We never share your personal information with third parties without your consent.' },
    ]
  },
]

export default function FAQPage() {
  const [search, setSearch] = useState('')
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (catIdx, itemIdx) => {
    setOpenItems(prev => ({ ...prev, [`${catIdx}-${itemIdx}`]: !prev[`${catIdx}-${itemIdx}`] }))
  }

  const filtered = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Frequently Asked Questions</h1>
          <p className="text-text-secondary text-lg">Find answers to common questions about Smart Edge</p>
        </div>

        <div className="relative max-w-md mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="space-y-8">
          {filtered.map((cat, catIdx) => (
            <div key={cat.category}>
              <h2 className="text-xl font-bold text-text-primary mb-4">{cat.category}</h2>
              <div className="space-y-3">
                {cat.items.map((item, itemIdx) => {
                  const isOpen = openItems[`${catIdx}-${itemIdx}`]
                  return (
                    <motion.div
                      key={itemIdx}
                      className="bg-white rounded-2xl shadow-card border border-border/50 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(catIdx, itemIdx)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className="font-medium text-text-primary pr-4">{item.q}</span>
                        <ChevronDown className={`w-5 h-5 text-text-muted shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5">
                          <p className="text-text-secondary text-sm leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
