const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const config = require('../config');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('id', req.user.id)
      .single();

    const { data: referrals, error } = await supabase
      .from('referrals')
      .select('*, referred:profiles!referred_id(full_name, email, created_at, status)')
      .eq('referrer_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    const totalBonus = referrals?.reduce((sum, r) => sum + Number(r.bonus || 0), 0) || 0;

    res.json({
      referralCode: profile?.referral_code,
      referrals: referrals || [],
      totalBonus,
      referralLink: `${config.frontendUrl}/register?ref=${profile?.referral_code}`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch referrals' });
  }
});

router.get('/team', authenticate, async (req, res) => {
  try {
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select('*, referred:profiles!referred_id(id, full_name, email, created_at, status, country, currency)')
      .eq('referrer_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    const team = referrals || [];
    const totalBonus = team.reduce((sum, r) => sum + Number(r.bonus || 0), 0);
    const activeCount = team.filter(r => r.referred?.status === 'active').length;
    const paidCount = team.filter(r => r.status === 'paid').length;

    res.json({
      team,
      stats: {
        totalMembers: team.length,
        activeMembers: activeCount,
        paidBonuses: paidCount,
        totalBonusEarned: totalBonus,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

module.exports = router;
