const express = require('express');
const router = express.Router();
const supabase = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cryptocurrencies')
      .select('*')
      .order('market_cap', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch markets' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cryptocurrencies')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(404).json({ error: 'Coin not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coin' });
  }
});

module.exports = router;
