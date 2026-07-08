const config = require('./index');

const db = {
  wallets: [],
  profiles: [],
  transactions: [],
  deposits: [],
  withdrawals: [],
  referrals: [],
  userInvestments: [],
  investmentPlans: [
    { id: 1, name: 'Starter', min_amount: 10, max_amount: 99, daily_return: 0.5, duration_days: 30, status: 'active', created_at: new Date().toISOString() },
    { id: 2, name: 'Growth', min_amount: 100, max_amount: 999, daily_return: 0.8, duration_days: 45, status: 'active', created_at: new Date().toISOString() },
    { id: 3, name: 'Premium', min_amount: 1000, max_amount: 9999, daily_return: 1.2, duration_days: 60, status: 'active', created_at: new Date().toISOString() },
    { id: 4, name: 'Elite', min_amount: 10000, max_amount: 100000, daily_return: 2.0, duration_days: 90, status: 'active', created_at: new Date().toISOString() },
    { id: 5, name: 'Staking', min_amount: 50, max_amount: 5000, daily_return: 0.35, duration_days: 180, status: 'active', created_at: new Date().toISOString() },
    { id: 6, name: 'Gold', min_amount: 500, max_amount: 50000, daily_return: 1.5, duration_days: 60, status: 'active', created_at: new Date().toISOString() },
  ],
  cryptocurrencies: [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 67432.10, market_cap: 1320000000000, change_24h: 2.4, logo_url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', status: 'active' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', price: 3521.80, market_cap: 423000000000, change_24h: 1.8, logo_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', status: 'active' },
    { id: 3, name: 'Tether', symbol: 'USDT', price: 1.00, market_cap: 95000000000, change_24h: 0.0, logo_url: 'https://cryptologos.cc/logos/tether-usdt-logo.png', status: 'active' },
    { id: 4, name: 'Solana', symbol: 'SOL', price: 148.25, market_cap: 65000000000, change_24h: 5.2, logo_url: 'https://cryptologos.cc/logos/solana-sol-logo.png', status: 'active' },
    { id: 5, name: 'Cardano', symbol: 'ADA', price: 0.45, market_cap: 15800000000, change_24h: -0.8, logo_url: 'https://cryptologos.cc/logos/cardano-ada-logo.png', status: 'active' },
    { id: 6, name: 'XRP', symbol: 'XRP', price: 0.62, market_cap: 33000000000, change_24h: 3.1, logo_url: 'https://cryptologos.cc/logos/xrp-xrp-logo.png', status: 'active' },
    { id: 7, name: 'Polkadot', symbol: 'DOT', price: 7.84, market_cap: 10500000000, change_24h: 4.2, logo_url: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png', status: 'active' },
    { id: 8, name: 'Avalanche', symbol: 'AVAX', price: 35.61, market_cap: 13000000000, change_24h: -1.3, logo_url: 'https://cryptologos.cc/logos/avalanche-avax-logo.png', status: 'active' },
    { id: 9, name: 'Chainlink', symbol: 'LINK', price: 14.28, market_cap: 8400000000, change_24h: 6.7, logo_url: 'https://cryptologos.cc/logos/chainlink-link-logo.png', status: 'active' },
    { id: 10, name: 'Polygon', symbol: 'MATIC', price: 0.72, market_cap: 7200000000, change_24h: 3.5, logo_url: 'https://cryptologos.cc/logos/polygon-matic-logo.png', status: 'active' },
  ],
  announcements: [
    { id: 1, title: 'Welcome to SmartEdge', content: 'Start your investment journey today!', published_at: new Date().toISOString(), status: 'published' },
  ],
  settings: { min_deposit: 10, max_deposit: 100000, min_withdrawal: 5, max_withdrawal: 50000 },
}

const sessions = new Map()

class QueryBuilder {
  constructor(table) {
    this.table = table
    this._filters = []
    this._orderCol = null
    this._orderAsc = true
    this._limitVal = null
    this._singleMode = false
  }

  select() { return this }

  insert(values) {
    this._operation = 'insert'
    this._values = values
    return this
  }

  update(values) {
    this._operation = 'update'
    this._values = values
    return this
  }

  delete() {
    this._operation = 'delete'
    return this
  }

  eq(col, val) { this._filters.push({ col, val }); return this }
  neq(col, val) { this._filters.push({ col, val, neq: true }); return this }
  gte(col, val) { this._filters.push({ col, val, gte: true }); return this }
  not(col, op, val) { this._filters.push({ col, val, neq: true }); return this }
  order(col, { ascending = true } = {}) { this._orderCol = col; this._orderAsc = ascending; return this }
  limit(val) { this._limitVal = val; return this }
  single() { this._singleMode = true; return this }

  then(resolve, reject) {
    try {
      if (this._operation === 'insert') {
        let items = Array.isArray(this._values) ? this._values : [this._values]
        items = items.map(item => ({
          ...item,
          id: db[this.table] ? db[this.table].length + 1 : 1,
        }))
        if (!db[this.table]) db[this.table] = []
        db[this.table].push(...items)
        return resolve({ data: items, error: null })
      }

      if (this._operation === 'update') {
        let data = [...(db[this.table] || [])]
        for (const f of this._filters) {
          data = data.filter(item => item[f.col] == f.val)
        }
        data.forEach(item => Object.assign(item, this._values))
        if (this._singleMode) resolve({ data: data[0] || null, error: null })
        else resolve({ data, error: null })
        return
      }

      if (this._operation === 'delete') {
        let data = [...(db[this.table] || [])]
        for (const f of this._filters) {
          data = data.filter(item => item[f.col] == f.val)
        }
        data.forEach(item => {
          const idx = db[this.table].indexOf(item)
          if (idx !== -1) db[this.table].splice(idx, 1)
        })
        return resolve({ data, error: null })
      }

      let data = [...(db[this.table] || [])]
      for (const f of this._filters) {
        if (f.neq) data = data.filter(item => item[f.col] !== f.val)
        else if (f.gte) data = data.filter(item => item[f.col] >= f.val)
        else data = data.filter(item => item[f.col] == f.val)
      }
      if (this._orderCol) {
        data.sort((a, b) => {
          const av = a[this._orderCol], bv = b[this._orderCol]
          return this._orderAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
        })
      }
      if (this._limitVal) data = data.slice(0, this._limitVal)
      if (this._singleMode) resolve({ data: data.length > 0 ? data[0] : null, error: null })
      else resolve({ data, error: null })
    } catch (e) {
      reject(e)
    }
  }
}

const mockSupabase = {
  auth: {
    async signUp({ email, password, options }) {
      const exists = db.profiles.find(p => p.email === email)
      if (exists) return { data: null, error: { message: 'User already registered' } }

      const now = new Date().toISOString()
      const userId = `dev_${Date.now()}`
      const user = { id: userId, email, user_metadata: options?.data || {}, created_at: now, confirmed_at: now }

      db.profiles.push({
        id: userId, email, ...(options?.data || {}),
        full_name: options?.data?.full_name || '',
        username: options?.data?.username || '',
        phone: '',
        country: 'International',
        currency: 'USD',
        role: 'user',
        referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        created_at: now,
        notification_settings: null,
        language: 'en',
      })

      return { data: { user }, error: null }
    },

    async signInWithPassword({ email, password }) {
      const profile = db.profiles.find(p => p.email === email)
      if (!profile) return { data: null, error: { message: 'Invalid credentials' } }

      const token = `dev_token_${Date.now()}_${Math.random().toString(36).substring(2)}`
      sessions.set(token, profile.id)
      profile._password = password

      return {
        data: {
          user: { id: profile.id, email: profile.email },
          session: { access_token: token },
        },
        error: null,
      }
    },

    async signOut() { return { data: null, error: null } },

    async getUser(token) {
      const userId = sessions.get(token)
      if (!userId) return { data: { user: null }, error: { message: 'Invalid token' } }
      const profile = db.profiles.find(p => p.id === userId)
      if (!profile) return { data: { user: null }, error: { message: 'User not found' } }
      return { data: { user: { id: profile.id, email: profile.email } }, error: null }
    },

    async resetPasswordForEmail() { return { data: null, error: null } },
    async updateUser() { return { data: null, error: null } },
  },

  from(table) { return new QueryBuilder(table) },
}

const useMock = config.supabase.url.includes('your-project')
module.exports = useMock ? mockSupabase : require('@supabase/supabase-js').createClient(config.supabase.url, config.supabase.serviceKey);
