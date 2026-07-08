const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { generateTransactionRef, calculateDailyReturn } = require('../utils/helpers');

router.get('/plans', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('investment_plans')
      .select('*, cryptocurrencies(*)')
      .eq('status', 'active')
      .order('min_investment', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

router.get('/plans/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('investment_plans')
      .select('*, cryptocurrencies(*)')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(404).json({ error: 'Plan not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

router.post('/invest', authenticate, async (req, res) => {
  try {
    const { planId, amount, coinId } = req.body;
    const userId = req.user.id;

    const { data: plan, error: planError } = await supabase
      .from('investment_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) return res.status(404).json({ error: 'Plan not found' });
    if (amount < plan.min_investment) return res.status(400).json({ error: `Minimum investment is ${plan.min_investment}` });
    if (plan.max_investment && amount > plan.max_investment) return res.status(400).json({ error: `Maximum investment is ${plan.max_investment}` });

    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (walletError || !wallet) return res.status(404).json({ error: 'Wallet not found' });
    if (Number(wallet.balance) < amount) return res.status(400).json({ error: 'Insufficient balance' });

    const newBalance = Number(wallet.balance) - amount;
    const dailyReturn = calculateDailyReturn(amount, plan.daily_return);

    const { error: investError, data: investment } = await supabase.from('user_investments').insert({
      user_id: userId,
      plan_id: planId,
      coin_id: coinId || plan.coin_id,
      amount,
      daily_return: dailyReturn,
      total_expected_return: dailyReturn * plan.duration,
      duration: plan.duration,
      status: 'active',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + plan.duration * 86400000).toISOString(),
    }).select().single();

    if (investError) return res.status(400).json({ error: investError.message });

    await supabase.from('wallets').update({ balance: newBalance }).eq('id', wallet.id);

    await supabase.from('transactions').insert({
      user_id: userId,
      type: 'investment',
      amount,
      currency: wallet.currency,
      status: 'completed',
      reference: generateTransactionRef(),
      description: `Investment in ${plan.name}`,
    });

    res.status(201).json({ message: 'Investment successful', investment });
  } catch (error) {
    res.status(500).json({ error: 'Investment failed' });
  }
});

router.get('/active', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_investments')
      .select('*, investment_plans(*), cryptocurrencies(*)')
      .eq('user_id', req.user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch investments' });
  }
});

router.get('/history', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_investments')
      .select('*, investment_plans(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
