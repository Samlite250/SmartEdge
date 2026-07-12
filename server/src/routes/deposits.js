const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { generateDepositRef, getPaymentMethodsForCountry } = require('../utils/helpers');

router.get('/methods', authenticate, async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('country')
      .eq('id', req.user.id)
      .single();

    const methods = getPaymentMethodsForCountry(profile?.country || 'International');
    res.json(methods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch methods' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const userId = req.user.id;

    const depositAmount = Number(amount);
    if (!amount || isNaN(depositAmount) || depositAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('country')
      .eq('id', userId)
      .single();

    const { data, error } = await supabase.from('deposits').insert({
      user_id: userId,
      amount: depositAmount,
      payment_method: paymentMethod,
      reference: generateDepositRef(),
      status: 'pending',
      country: profile?.country || 'International',
    }).select().single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Deposit failed' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('deposits')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deposits' });
  }
});

module.exports = router;
