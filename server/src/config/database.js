const config = require('./index');

const db = {
  wallets: [],
  profiles: [],
  transactions: [],
  deposits: [],
  withdrawals: [],
  referrals: [],
  user_investments: [],
  investment_plans: [
    { id: 'plan_1', name: 'Starter Plan', description: 'Perfect for beginners starting their investment journey', min_investment: 10, max_investment: 99, daily_return: 0.50, duration: 30, total_return: 15.00, risk_level: 'low', status: 'active', features: ['Daily returns', 'Capital preservation', 'Instant withdrawals'], coin_id: 'coin_1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'plan_2', name: 'Growth Plan', description: 'Balanced growth with moderate returns', min_investment: 100, max_investment: 999, daily_return: 0.80, duration: 45, total_return: 36.00, risk_level: 'medium', status: 'active', features: ['Higher daily returns', 'Compound interest', 'Priority support'], coin_id: 'coin_2', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'plan_3', name: 'Premium Plan', description: 'Maximum returns for serious investors', min_investment: 1000, max_investment: 9999, daily_return: 1.20, duration: 60, total_return: 72.00, risk_level: 'medium', status: 'active', features: ['Premium daily returns', 'VIP support', 'Exclusive insights', 'Early withdrawals'], coin_id: 'coin_4', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'plan_4', name: 'Elite Plan', description: 'The ultimate investment experience', min_investment: 10000, max_investment: 100000, daily_return: 2.00, duration: 90, total_return: 180.00, risk_level: 'high', status: 'active', features: ['Elite daily returns', 'Dedicated account manager', 'Custom strategies', 'Instant priority withdrawals', 'Quarterly bonuses'], coin_id: 'coin_1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'plan_5', name: 'Staking Plan', description: 'Earn passive income through staking', min_investment: 50, max_investment: 5000, daily_return: 0.35, duration: 30, total_return: 10.50, risk_level: 'low', status: 'active', features: ['Staking rewards', 'Low risk', 'Flexible period', 'Auto-compound'], coin_id: 'coin_5', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'plan_6', name: 'Gold Plan', description: 'Premium gold-tier investment opportunity', min_investment: 500, max_investment: 50000, daily_return: 1.50, duration: 60, total_return: 90.00, risk_level: 'medium', status: 'active', features: ['Gold tier returns', 'Market analysis', 'Dedicated support', 'Flexible withdrawal'], coin_id: 'coin_7', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  cryptocurrencies: [
    { id: 'coin_1', name: 'Bitcoin', symbol: 'BTC', current_price: 67432.10, price_change_24h: 2.45, market_cap: 1320000000000, volume_24h: 45000000000, logo_url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'coin_2', name: 'Ethereum', symbol: 'ETH', current_price: 3521.80, price_change_24h: 1.89, market_cap: 423000000000, volume_24h: 22000000000, logo_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'coin_3', name: 'Tether', symbol: 'USDT', current_price: 1.00, price_change_24h: 0.01, market_cap: 95000000000, volume_24h: 68000000000, logo_url: 'https://cryptologos.cc/logos/tether-usdt-logo.png', status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'coin_4', name: 'Solana', symbol: 'SOL', current_price: 148.25, price_change_24h: 5.67, market_cap: 65000000000, volume_24h: 3800000000, logo_url: 'https://cryptologos.cc/logos/solana-sol-logo.png', status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'coin_5', name: 'Cardano', symbol: 'ADA', current_price: 0.45, price_change_24h: -1.23, market_cap: 15800000000, volume_24h: 890000000, logo_url: 'https://cryptologos.cc/logos/cardano-ada-logo.png', status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'coin_6', name: 'XRP', symbol: 'XRP', current_price: 0.62, price_change_24h: 3.10, market_cap: 33000000000, volume_24h: 1500000000, logo_url: 'https://cryptologos.cc/logos/xrp-xrp-logo.png', status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'coin_7', name: 'Polkadot', symbol: 'DOT', current_price: 7.84, price_change_24h: 4.12, market_cap: 10500000000, volume_24h: 560000000, logo_url: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png', status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'coin_8', name: 'Avalanche', symbol: 'AVAX', current_price: 35.61, price_change_24h: -0.89, market_cap: 13000000000, volume_24h: 1100000000, logo_url: 'https://cryptologos.cc/logos/avalanche-avax-logo.png', status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'coin_9', name: 'Chainlink', symbol: 'LINK', current_price: 14.28, price_change_24h: 6.70, market_cap: 8400000000, volume_24h: 720000000, logo_url: 'https://cryptologos.cc/logos/chainlink-link-logo.png', status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'coin_10', name: 'Polygon', symbol: 'MATIC', current_price: 0.72, price_change_24h: 3.50, market_cap: 7200000000, volume_24h: 400000000, logo_url: 'https://cryptologos.cc/logos/polygon-matic-logo.png', status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  announcements: [
    { id: 'ann_1', title: 'Welcome to SmartEdge', content: 'Start your investment journey today!', type: 'general', status: 'published', created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  settings: [
    { id: 'settings_1', site_name: 'Smart Edge', site_description: 'Investment Platform', logo_url: null, favicon_url: null, min_deposit: 10, min_withdrawal: 5, referral_bonus: 5, maintenance_mode: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
};

const sessions = new Map();

function resolveSubQuery(table, selectStr) {
  if (!selectStr || selectStr === '*') return;
  const joins = selectStr.match(/,?\s*(\w+)(?::(\w+))?!(\w+)\(([^)]*)\)/g);
  if (!joins) return;
  for (const join of joins) {
    const m = join.match(/(\w+)(?::(\w+))?!(\w+)\(([^)]*)\)/);
    if (!m) continue;
    const alias = m[2] || m[3];
    const fkTable = m[3];
    const fields = m[4].split(',').map(f => f.trim());
    const items = db[table] || [];
    const relatedTable = fkTable === 'profiles' ? db.profiles : db[fkTable];
    if (!relatedTable) continue;
    for (const item of items) {
      const fkVal = item[`${alias}_id`] || item[`${fkTable.slice(0, -1)}_id`] || item.id;
      const related = relatedTable.find(r => r.id === fkVal);
      if (related) {
        const obj = {};
        for (const f of fields) obj[f] = related[f];
        item[alias] = obj;
      }
    }
  }
}

class QueryBuilder {
  constructor(table) {
    this.table = table;
    this._filters = [];
    this._orderCol = null;
    this._orderAsc = true;
    this._limitVal = null;
    this._offsetVal = null;
    this._singleMode = false;
    this._selectStr = null;
    this._countExact = false;
  }

  select(columns, opts) {
    this._selectStr = columns || '*';
    if (opts && opts.count === 'exact') this._countExact = true;
    return this;
  }

  textSearch(col, query, opts) {
    this._filters.push({ col, val: query.toLowerCase(), textSearch: true });
    return this;
  }

  or(filters, opts) {
    this._orFilters = filters;
    return this;
  }

  insert(values) {
    this._operation = 'insert';
    this._values = values;
    return this;
  }

  update(values) {
    this._operation = 'update';
    this._values = values;
    return this;
  }

  delete() {
    this._operation = 'delete';
    return this;
  }

  eq(col, val) { if (col !== 'id' || val !== undefined) this._filters.push({ col, val }); return this; }
  neq(col, val) { this._filters.push({ col, val, neq: true }); return this; }
  gte(col, val) { this._filters.push({ col, val, gte: true }); return this; }
  lte(col, val) { this._filters.push({ col, val, lte: true }); return this; }
  lt(col, val) { this._filters.push({ col, val, lt: true }); return this; }
  gt(col, val) { this._filters.push({ col, val, gt: true }); return this; }
  in(col, vals) { this._filters.push({ col, val: vals, in: true }); return this; }
  not(col, op, val) { this._filters.push({ col, val, neq: true }); return this; }
  order(col, { ascending = true } = {}) { this._orderCol = col; this._orderAsc = ascending; return this; }
  limit(val) { this._limitVal = val; return this; }
  range(start, end) { this._offsetVal = start; this._limitVal = end - start + 1; return this; }
  single() { this._singleMode = true; return this; }
  maybeSingle() { this._singleMode = true; return this; }
  contains(col, val) { this._filters.push({ col, val: JSON.stringify(val), contains: true }); return this; }

  then(resolve, reject) {
    try {
      if (!db[this.table]) db[this.table] = [];

      if (this._operation === 'insert') {
        let items = Array.isArray(this._values) ? this._values : [this._values];
        items = items.map(item => ({
          ...item,
          id: item.id || `dev_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          created_at: item.created_at || new Date().toISOString(),
        }));
        db[this.table].push(...items);

        const result = this._singleMode ? { data: items[0] || null, error: null } : { data: items, error: null };
        return resolve(result);
      }

      if (this._operation === 'update') {
        let items = this._applyFilters();
        for (const item of items) {
          Object.assign(item, this._values, { updated_at: new Date().toISOString() });
        }
        const result = this._singleMode
          ? { data: items[0] || null, error: items.length === 0 ? { message: 'Not found', code: 'PGRST116' } : null }
          : { data: items, error: null };
        return resolve(result);
      }

      if (this._operation === 'delete') {
        let items = this._applyFilters();
        for (const item of items) {
          const idx = db[this.table].indexOf(item);
          if (idx !== -1) db[this.table].splice(idx, 1);
        }
        return resolve({ data: items, error: null });
      }

      let data = this._applyFilters();
      if (this._orderCol) {
        data.sort((a, b) => {
          const av = a[this._orderCol], bv = b[this._orderCol];
          if (av == null) return 1;
          if (bv == null) return -1;
          return this._orderAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
        });
      }
      if (this._offsetVal) data = data.slice(this._offsetVal);
      if (this._limitVal) data = data.slice(0, this._limitVal);

      resolveSubQuery(this.table, this._selectStr);

      if (this._singleMode) {
        resolve({ data: data.length > 0 ? data[0] : null, error: data.length === 0 ? { message: 'Not found', code: 'PGRST116' } : null });
      } else {
        resolve({ data, error: null, count: this._countExact ? data.length : undefined });
      }
    } catch (e) {
      reject(e);
    }
  }

  _applyFilters() {
    let data = [...(db[this.table] || [])];

    for (const f of this._filters) {
      if (f.neq) {
        data = data.filter(item => String(item[f.col]) !== String(f.val));
      } else if (f.gte) {
        data = data.filter(item => Number(item[f.col]) >= Number(f.val));
      } else if (f.lte) {
        data = data.filter(item => Number(item[f.col]) <= Number(f.val));
      } else if (f.lt) {
        data = data.filter(item => Number(item[f.col]) < Number(f.val));
      } else if (f.gt) {
        data = data.filter(item => Number(item[f.col]) > Number(f.val));
      } else if (f.in) {
        data = data.filter(item => (f.val || []).includes(item[f.col]));
      } else if (f.contains && Array.isArray(f.val)) {
        data = data.filter(item => {
          const arr = item[f.col];
          return arr && Array.isArray(arr) && f.val.every(v => arr.includes(v));
        });
      } else if (f.textSearch) {
        data = data.filter(item => String(item[f.col] || '').toLowerCase().includes(f.val));
      } else {
        data = data.filter(item => String(item[f.col]) === String(f.val));
      }
    }

    if (this._orFilters) {
      const conditions = this._orFilters.split(',');
      data = data.filter(item => {
        return conditions.some(cond => {
          const [col, val] = cond.split('.').map(s => s.trim());
          return String(item[col]) === String(val);
        });
      });
    }

    return data;
  }
}

const mockSupabase = {
  auth: {
    async signUp({ email, password, options }) {
      const exists = db.profiles.find(p => p.email === email);
      if (exists) return { data: { user: null }, error: { message: 'User already registered' } };

      const now = new Date().toISOString();
      const userId = `dev_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

      const user = {
        id: userId,
        email,
        user_metadata: options?.data || {},
        app_metadata: {},
        created_at: now,
        confirmed_at: now,
        aud: 'authenticated',
      };

      return { data: { user, session: null }, error: null };
    },

    async signInWithPassword({ email, password }) {
      const profile = db.profiles.find(p => p.email === email);
      if (!profile) return { data: { user: null, session: null }, error: { message: 'Invalid credentials' } };

      const token = `dev_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      sessions.set(token, profile.id);

      return {
        data: {
          user: { id: profile.id, email: profile.email, aud: 'authenticated', app_metadata: {}, user_metadata: {} },
          session: { access_token: token, refresh_token: token, expires_in: 604800, token_type: 'bearer' },
        },
        error: null,
      };
    },

    async signOut() { return { error: null } },

    async getUser(token) {
      const userId = sessions.get(token);
      if (!userId) return { data: { user: null }, error: { message: 'Invalid token' } };
      const profile = db.profiles.find(p => p.id === userId);
      if (!profile) return { data: { user: null }, error: { message: 'User not found' } };
      return { data: { user: { id: profile.id, email: profile.email, aud: 'authenticated', app_metadata: {}, user_metadata: {} } }, error: null };
    },

    async resetPasswordForEmail() { return { data: {}, error: null } },
    async updateUser() { return { data: { user: {} }, error: null } },

    onAuthStateChange() {
      return { data: { subscription: { unsubscribe: () => { } } } };
    },
  },

  from(table) { return new QueryBuilder(table) },

  rpc() { return Promise.resolve({ data: null, error: null }) },

  storage: {
    from() {
      return {
        upload() { return Promise.resolve({ data: { path: '' }, error: null }) },
        getPublicUrl() { return { data: { publicUrl: '' } } },
        list() { return Promise.resolve({ data: [], error: null }) },
        remove() { return Promise.resolve({ data: [], error: null }) },
      };
    },
  },
};

const useMock = process.env.USE_MOCK === 'true' || !config.supabase.url || config.supabase.url.includes('your-project');

module.exports = useMock ? mockSupabase : require('@supabase/supabase-js').createClient(config.supabase.url, config.supabase.serviceKey);
