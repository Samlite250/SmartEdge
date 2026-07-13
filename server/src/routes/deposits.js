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
    const { amount, paymentMethod, payerName, payerPhone, proofImage } = req.body;
    const userId = req.user.id;

    if (!proofImage) return res.status(400).json({ error: 'Payment proof screenshot is required' });
    if (!payerName?.trim()) return res.status(400).json({ error: 'Payer name is required' });
    if (!payerPhone?.trim()) return res.status(400).json({ error: 'Payer phone number is required' });

    const { data: profile } = await supabase
      .from('profiles')
      .select('country')
      .eq('id', userId)
      .single();

    const { data, error } = await supabase.from('deposits').insert({
      user_id: userId,
      amount,
      payment_method: paymentMethod,
      reference: generateDepositRef(),
      status: 'pending',
      country: profile?.country || 'International',
      metadata: {
        payer_name: payerName,
        payer_phone: payerPhone,
        proof_image: proofImage,
      },
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

const { adminOnly } = require('../middleware/auth');

// GET /api/deposits/instructions/country/:country
router.get('/instructions/country/:country', authenticate, async (req, res) => {
  try {
    const { country } = req.params;
    const { data, error } = await supabase
      .from('payment_instructions')
      .select('*')
      .eq('country', country)
      .maybeSingle();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch instructions' });
  }
});

// GET /api/deposits/instructions
router.get('/instructions', authenticate, adminOnly, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payment_instructions')
      .select('*')
      .order('country', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all instructions' });
  }
});

// POST /api/deposits/instructions
router.post('/instructions', authenticate, adminOnly, async (req, res) => {
  try {
    const { id, country, method, instructions } = req.body;

    if (!country?.trim()) return res.status(400).json({ error: 'Country is required' });
    if (!method?.trim()) return res.status(400).json({ error: 'Method is required' });
    if (!instructions?.trim()) return res.status(400).json({ error: 'Instructions are required' });

    let query;
    if (id) {
      query = supabase
        .from('payment_instructions')
        .update({ country, method, instructions, updated_at: new Date().toISOString() })
        .eq('id', id);
    } else {
      const { data: existing } = await supabase
        .from('payment_instructions')
        .select('id')
        .eq('country', country)
        .maybeSingle();

      if (existing) {
        query = supabase
          .from('payment_instructions')
          .update({ method, instructions, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        query = supabase
          .from('payment_instructions')
          .insert({ country, method, instructions });
      }
    }

    const { data, error } = await query.select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save instructions' });
  }
});

// DELETE /api/deposits/instructions/:id
router.delete('/instructions/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('payment_instructions')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete instructions' });
  }
});

module.exports = router;
