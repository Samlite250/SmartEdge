const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { generateTransactionRef, calculateDailyReturn } = require('../utils/helpers');
const { getCountryPlans, hasVIPPlans } = require('../config/countryPlans');

async function ensureVIPPlanInDB(country, planData) {
  const planName = `${planData.name} (${country})`;
  const { data: existing } = await supabase
    .from('investment_plans')
    .select('id')
    .eq('name', planName)
    .maybeSingle();
  if (existing) return existing.id;
  const { data: created, error } = await supabase.from('investment_plans').insert({
    name: planName,
    description: `${country} ${planData.name} \u2014 ${planData.duration} days, ${planData.daily_return}% daily`,
    min_investment: planData.min,
    max_investment: planData.max,
    daily_return: planData.daily_return,
    duration: planData.duration,
    total_return: planData.daily_return * planData.duration,
    risk_level: 'low',
    status: 'active',
    features: ['Daily returns', 'Capital preservation', `Country: ${country}`],
  }).select().single();
  if (error) throw error;
  return created.id;
}

router.get('/plans', async (req, res) => {
  try {
    const { country } = req.query;
    if (country && hasVIPPlans(country)) {
      const plans = getCountryPlans(country);
      return res.json(plans.map(p => ({
        id: `vip_${country.toLowerCase()}_${p.level}`,
        name: p.name,
        country,
        min_investment: p.min,
        max_investment: p.max,
        daily_return: p.daily_return,
        duration: p.duration,
        total_return: p.daily_return * p.duration,
        risk_level: 'low',
        is_vip: true,
      })));
    }
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
    const { planId, amount, coinId, country } = req.body;
    const userId = req.user.id;
    let plan;

    if (planId && planId.startsWith('vip_')) {
      if (!country || !hasVIPPlans(country)) {
        return res.status(400).json({ error: 'Invalid country for VIP plan' });
      }
      const level = parseInt(planId.split('_').pop(), 10);
      const plans = getCountryPlans(country);
      const planData = plans.find(p => p.level === level);
      if (!planData) return res.status(404).json({ error: 'VIP plan not found' });
      if (amount < planData.min || amount > planData.max) {
        return res.status(400).json({ error: `Amount must be ${planData.min} - ${planData.max}` });
      }
      const dbPlanId = await ensureVIPPlanInDB(country, planData);
      const { data: dbPlan } = await supabase.from('investment_plans').select('*').eq('id', dbPlanId).single();
      plan = dbPlan;
    } else {
      const { data: dbPlan, error: planError } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('id', planId)
        .single();
      if (planError || !dbPlan) return res.status(404).json({ error: 'Plan not found' });
      if (amount < dbPlan.min_investment) return res.status(400).json({ error: `Minimum investment is ${dbPlan.min_investment}` });
      if (dbPlan.max_investment && amount > dbPlan.max_investment) return res.status(400).json({ error: `Maximum investment is ${dbPlan.max_investment}` });
      plan = dbPlan;
    }

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
      plan_id: plan.id,
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
    console.error('Investment error:', error);
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
