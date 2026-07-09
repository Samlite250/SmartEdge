import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Search } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { marketApi } from '../services/api'
import { formatCurrency } from '../lib/utils'

export default function MarketsPage() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    marketApi.getAll()
      .then(setCoins)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = coins.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Crypto Markets</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">Real-time cryptocurrency prices and market data</p>
        </div>

        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input type="text" placeholder="Search coins..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        {loading ? (
          <Card><div className="p-8 text-center text-text-muted">Loading markets...</div></Card>
        ) : (
          <div className="bg-white rounded-[20px] overflow-hidden shadow-card border border-border/50">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-4 bg-background border-b border-border/50 text-sm font-medium text-text-muted">
              <div className="sm:col-span-2">Coin</div>
              <div className="text-right">Price</div>
              <div className="text-right hidden sm:block">24h Change</div>
            </div>
            <div className="divide-y divide-border/50">
              {filtered.map((coin, i) => (
                <motion.div key={coin.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-4 hover:bg-background/50 transition-colors items-center"
                >
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                      {coin.symbol?.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{coin.name}</p>
                      <p className="text-xs text-text-muted">{coin.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text-primary">{formatCurrency(coin.current_price)}</p>
                  </div>
                  <div className={`text-right hidden sm:flex items-center justify-end gap-1 ${coin.price_change_24h >= 0 ? 'text-success' : 'text-danger'}`}>
                    {coin.price_change_24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="font-medium">{Math.abs(coin.price_change_24h).toFixed(2)}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
