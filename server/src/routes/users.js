const express = require('express');
const router = express.Router();
const supabase = require('../config/database'); // service key client — bypasses RLS
const { authenticate } = require('../middleware/auth');
const { getCountryCurrency } = require('../utils/helpers');
const config = require('../config');

const isMock = process.env.USE_MOCK === 'true' || !config.supabase?.url || config.supabase?.url?.includes('your-project');

// Use service-key client (supabase) for all data queries — bypasses RLS entirely.
// Only use a user-scoped client for auth operations that need user context (change-password).
function getUserScopedClient(accessToken) {
  if (isMock) return supabase;
  const { createClient } = require('@supabase/supabase-js');
  return createClient(config.supabase.url, config.supabase.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } }
  });
}

router.get('/profile', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      console.error('[Profile Fetch Error]', error);
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(data);
  } catch (error) {
    console.error('[Profile Route Error]', error.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { fullName, phone, country, notificationSettings, language } = req.body;
    const updates = {};
    if (fullName) updates.full_name = fullName;
    if (phone) updates.phone = phone;
    if (notificationSettings) updates.notification_settings = notificationSettings;
    if (language) updates.language = language;
    if (country) {
      updates.country = country;
      updates.currency = getCountryCurrency(country);
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    if (country) {
      const userCurrency = getCountryCurrency(country);
      await supabase.from('wallets').update({ currency: userCurrency }).eq('user_id', req.user.id);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { newPassword } = req.body;
    // Use user-scoped client so that auth.updateUser works in the correct user context
    const client = getUserScopedClient(req.token);
    const { error } = await client.auth.updateUser({ password: newPassword });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const safeQuery = (promise) => Promise.resolve(promise).catch(err => ({ data: null, error: err }));

    const [wallet, investments, transactions, deposits, referrals] = await Promise.all([
      safeQuery(supabase.from('wallets').select('*').eq('user_id', userId).limit(1)),
      safeQuery(supabase.from('user_investments').select('*, investment_plans(*)').eq('user_id', userId).order('created_at', { ascending: false })),
      safeQuery(supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5)),
      safeQuery(supabase.from('deposits').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5)),
      safeQuery(supabase.from('referrals').select('*').eq('referrer_id', userId)),
    ]);

    const today = new Date().toISOString().split('T')[0];
    const { data: todayEarnings } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'daily_return')
      .gte('created_at', today);

    const todayEarningsTotal = todayEarnings?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    const walletData = wallet.data?.[0] || wallet.data || { balance: 0, currency: 'USD' };

    let referralsData = referrals.data || [];
    if (referralsData.length > 0 && referralsData[0].referred_id) {
      const referredIds = referralsData.map(r => r.referred_id).filter(Boolean);
      if (referredIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email, created_at')
          .in('id', referredIds);
        const profileMap = {};
        if (profiles) profiles.forEach(p => { profileMap[p.id] = p; });
        referralsData = referralsData.map(r => ({ ...r, referred: profileMap[r.referred_id] || null }));
      }
    }

    res.json({
      wallet: walletData,
      investments: investments.data || [],
      recentTransactions: transactions.data || [],
      recentDeposits: deposits.data || [],
      referrals: referralsData,
      todayEarnings: todayEarningsTotal,
    });
  } catch (error) {
    console.error('[Dashboard Error]', error.message);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

module.exports = router;
