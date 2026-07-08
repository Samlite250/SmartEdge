import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Search } from 'lucide-react'
import { Card } from '../components/ui/Card'

const coins = [
  { name: 'Bitcoin', symbol: 'BTC', price: 67450.00, change: 2.45, icon: '₿', color: 'text-orange-500' },
  { name: 'Ethereum', symbol: 'ETH', price: 3450.80, change: -1.23, icon: 'Ξ', color: 'text-blue-500' },
  { name: 'Tether', symbol: 'USDT', price: 1.00, change: 0.01, icon: '₮', color: 'text-green-500' },
  { name: 'Solana', symbol: 'SOL', price: 142.30, change: 5.67, icon: '◎', color: 'text-purple-500' },
  { name: 'Cardano', symbol: 'ADA', price: 0.45, change: -0.89, icon: '₳', color: 'text-blue-600' },
  { name: 'Polkadot', symbol: 'DOT', price: 7.82, change: 3.21, icon: '●', color: 'text-pink-500' },
  { name: 'Chainlink', symbol: 'LINK', price: 14.56, change: -2.34, icon: '⬡', color: 'text-blue-400' },
  { name: 'Avalanche', symbol: 'AVAX', price: 35.20, change: 1.45, icon: '▲', color: 'text-red-500' },
]

function formatPrice(price) {
  if (price >= 1) return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumSignificantDigits: 2 })
}

export default function MarketsPage() {
  const [search, setSearch] = useState('')

  const filtered = coins.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Crypto Markets</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Real-time cryptocurrency prices and market data
          </p>
        </div>

        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search coins..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="bg-white rounded-[20px] overflow-hidden shadow-card border border-border/50">
          <div className="grid grid-cols-3 gap-4 p-4 bg-background border-b border-border/50 text-sm font-medium text-text-muted">
            <div>Coin</div>
            <div className="text-right">Price</div>
            <div className="text-right">24h Change</div>
          </div>
          <div className="divide-y divide-border/50">
            {filtered.map((coin, i) => (
              <motion.div
                key={coin.symbol}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-3 gap-4 p-4 hover:bg-background/50 transition-colors items-center"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xl font-bold ${coin.color}`}>{coin.icon}</span>
                  <div>
                    <p className="font-semibold text-text-primary">{coin.name}</p>
                    <p className="text-xs text-text-muted">{coin.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-text-primary">{formatPrice(coin.price)}</p>
                </div>
                <div className={`text-right flex items-center justify-end gap-1 ${coin.change >= 0 ? 'text-success' : 'text-danger'}`}>
                  {coin.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="font-medium">{Math.abs(coin.change)}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
