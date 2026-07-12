const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { getCountryCurrency } = require('../utils/helpers');

router.get('/profile', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) return res.status(404).json({ error: 'Profile not found' });
    res.json(data);
  } catch (error) {
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
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const [wallet, investments, transactions, deposits, referrals] = await Promise.all([
      supabase.from('wallets').select('*').eq('user_id', userId).single(),
      supabase.from('user_investments').select('*, investment_plans(*)').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      supabase.from('deposits').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      supabase.from('referrals').select('*, referred:profiles!referred_id(full_name, email, created_at)').eq('referrer_id', userId),
    ]);

    const today = new Date().toISOString().split('T')[0];
    const { data: todayEarnings } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'daily_return')
      .gte('created_at', today);

    const todayEarningsTotal = todayEarnings?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    res.json({
      wallet: wallet.data || { balance: 0, currency: 'USD' },
      investments: investments.data || [],
      recentTransactions: transactions.data || [],
      recentDeposits: deposits.data || [],
      referrals: referrals.data || [],
      todayEarnings: todayEarningsTotal,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

module.exports = router;
