const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { generateWithdrawRef, getPaymentMethodsForCountry } = require('../utils/helpers');

router.get('/methods', authenticate, async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('country')
      .eq('id', req.user.id)
      .single();

    const methods = getPaymentMethodsForCountry(profile?.country);
    res.json(methods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch methods' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { amount, paymentMethod, walletAddress, phoneNumber } = req.body;
    const userId = req.user.id;

    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (walletError || !wallet) return res.status(404).json({ error: 'Wallet not found' });
    if (Number(wallet.balance) < amount) return res.status(400).json({ error: 'Insufficient balance' });

    const { data: profile } = await supabase
      .from('profiles')
      .select('country')
      .eq('id', userId)
      .single();

    const { data, error } = await supabase.from('withdrawals').insert({
      user_id: userId,
      amount,
      payment_method: paymentMethod,
      reference: generateWithdrawRef(),
      status: 'pending',
      wallet_address: walletAddress || null,
      phone_number: phoneNumber || null,
      country: profile?.country,
    }).select().single();

    if (error) return res.status(400).json({ error: error.message });

    const newBalance = Number(wallet.balance) - amount;
    await supabase.from('wallets').update({ balance: newBalance }).eq('id', wallet.id);

    await supabase.from('transactions').insert({
      user_id: userId,
      type: 'withdrawal',
      amount,
      currency: wallet.currency,
      status: 'pending',
      reference: data.reference,
      description: `Withdrawal via ${paymentMethod}`,
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Withdrawal failed' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
});

module.exports = router;
