-- Smart Edge Database Schema for Supabase PostgreSQL
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(50),
  country VARCHAR(100) DEFAULT 'International',
  currency VARCHAR(10) DEFAULT 'USD',
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  avatar_url TEXT,
  referral_code VARCHAR(20) UNIQUE,
  notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WALLETS
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  balance DECIMAL(18, 8) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- CRYPTOCURRENCIES
CREATE TABLE cryptocurrencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  logo_url TEXT,
  current_price DECIMAL(18, 8) DEFAULT 0,
  price_change_24h DECIMAL(10, 2) DEFAULT 0,
  market_cap DECIMAL(20, 2) DEFAULT 0,
  volume_24h DECIMAL(20, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVESTMENT PLANS
CREATE TABLE investment_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  coin_id UUID REFERENCES cryptocurrencies(id) ON DELETE SET NULL,
  min_investment DECIMAL(18, 2) NOT NULL,
  max_investment DECIMAL(18, 2),
  daily_return DECIMAL(5, 2) NOT NULL,
  duration INTEGER NOT NULL,
  total_return DECIMAL(5, 2) NOT NULL,
  risk_level VARCHAR(20) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  features JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER INVESTMENTS
CREATE TABLE user_investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES investment_plans(id) ON DELETE CASCADE,
  coin_id UUID REFERENCES cryptocurrencies(id) ON DELETE SET NULL,
  amount DECIMAL(18, 2) NOT NULL,
  daily_return DECIMAL(18, 8) NOT NULL,
  total_earned DECIMAL(18, 8) DEFAULT 0,
  total_expected_return DECIMAL(18, 2) NOT NULL,
  duration INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'investment', 'daily_return', 'referral_bonus', 'transfer')),
  amount DECIMAL(18, 8) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  reference VARCHAR(100) UNIQUE,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DEPOSITS
CREATE TABLE deposits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(18, 2) NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  reference VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  country VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WITHDRAWALS
CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(18, 2) NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  reference VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  wallet_address TEXT,
  phone_number VARCHAR(50),
  country VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REFERRALS
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bonus DECIMAL(18, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referred_id)
);

-- ANNOUNCEMENTS
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'update', 'promotion', 'maintenance')),
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'general',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SETTINGS
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name VARCHAR(255) DEFAULT 'Smart Edge',
  site_description TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  min_deposit DECIMAL(18, 2) DEFAULT 10,
  min_withdrawal DECIMAL(18, 2) DEFAULT 5,
  referral_bonus DECIMAL(5, 2) DEFAULT 5,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_deposits_user_id ON deposits(user_id);
CREATE INDEX idx_deposits_status ON deposits(status);
CREATE INDEX idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
CREATE INDEX idx_user_investments_user_id ON user_investments(user_id);
CREATE INDEX idx_user_investments_status ON user_investments(status);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_announcements_status ON announcements(status);

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
-- Profiles: users can read/update own profile, admins can read all
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Wallets: users can read own wallet
CREATE POLICY "Users can read own wallet" ON wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can update wallets" ON wallets
  FOR UPDATE USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Transactions: users can read own transactions
CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Deposits: users can read/insert own deposits
CREATE POLICY "Users can read own deposits" ON deposits
  FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can insert deposits" ON deposits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Withdrawals: users can read/insert own withdrawals
CREATE POLICY "Users can read own withdrawals" ON withdrawals
  FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can insert withdrawals" ON withdrawals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Investments: users can read own investments
CREATE POLICY "Users can read own investments" ON user_investments
  FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can insert investments" ON user_investments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Referrals: users can read own referrals
CREATE POLICY "Users can read own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Notifications: users can read own notifications
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- TRIGGER to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, username, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    upper(substr(md5(random()::text), 1, 8))
  );
  INSERT INTO public.wallets (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- DEMO DATA
INSERT INTO cryptocurrencies (name, symbol, logo_url, current_price, price_change_24h, market_cap, volume_24h) VALUES
  ('Bitcoin', 'BTC', '/images/coins/btc.svg', 67500.00, 2.45, 1320000000000, 45000000000),
  ('Ethereum', 'ETH', '/images/coins/eth.svg', 3450.00, 1.89, 415000000000, 22000000000),
  ('Tether', 'USDT', '/images/coins/usdt.svg', 1.00, 0.01, 112000000000, 68000000000),
  ('Solana', 'SOL', '/images/coins/sol.svg', 145.00, 5.67, 62000000000, 3800000000),
  ('Cardano', 'ADA', '/images/coins/ada.svg', 0.45, -1.23, 15800000000, 890000000),
  ('Polkadot', 'DOT', '/images/coins/dot.svg', 7.20, 3.45, 9200000000, 560000000),
  ('Chainlink', 'LINK', '/images/coins/link.svg', 14.50, 4.12, 8500000000, 720000000),
  ('Avalanche', 'AVAX', '/images/coins/avax.svg', 35.80, -0.89, 13500000000, 1100000000);

INSERT INTO investment_plans (name, description, coin_id, min_investment, max_investment, daily_return, duration, total_return, risk_level, features) VALUES
  ('Starter Plan', 'Perfect for beginners starting their investment journey', (SELECT id FROM cryptocurrencies WHERE symbol = 'BTC'), 10, 99, 0.50, 30, 15.00, 'low', '["Daily returns","Capital preservation","Instant withdrawals"]'),
  ('Growth Plan', 'Balanced growth with moderate returns', (SELECT id FROM cryptocurrencies WHERE symbol = 'ETH'), 100, 999, 0.80, 45, 36.00, 'medium', '["Higher daily returns","Compound interest","Priority support"]'),
  ('Premium Plan', 'Maximum returns for serious investors', (SELECT id FROM cryptocurrencies WHERE symbol = 'SOL'), 1000, 9999, 1.20, 60, 72.00, 'medium', '["Premium daily returns","VIP support","Exclusive insights","Early withdrawals"]'),
  ('Elite Plan', 'The ultimate investment experience', (SELECT id FROM cryptocurrencies WHERE symbol = 'BTC'), 10000, 100000, 2.00, 90, 180.00, 'high', '["Elite daily returns","Dedicated account manager","Custom strategies","Instant priority withdrawals","Quarterly bonuses"]'),
  ('Staking Plan', 'Earn passive income through staking', (SELECT id FROM cryptocurrencies WHERE symbol = 'ADA'), 50, 5000, 0.35, 30, 10.50, 'low', '["Staking rewards","Low risk","Flexible period","Auto-compound"]'),
  ('Gold Plan', 'Premium gold-tier investment opportunity', (SELECT id FROM cryptocurrencies WHERE symbol = 'LINK'), 500, 50000, 1.50, 60, 90.00, 'medium', '["Gold tier returns","Market analysis","Dedicated support","Flexible withdrawal"]');
