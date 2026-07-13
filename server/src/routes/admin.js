const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { authenticate, adminOnly } = require('../middleware/auth');
const config = require('../config');

// Setup-admin: Promote any user to admin by email using a secret key.
// This endpoint is NOT protected by adminOnly, so it can bootstrap the first admin.
// Usage: POST /admin/setup-admin  { email, secret }
router.post('/setup-admin', async (req, res) => {
  try {
    const { email, secret } = req.body;
    const expectedSecret = process.env.SETUP_SECRET || 'smartedge-setup-2025';
    if (secret !== expectedSecret) {
      return res.status(403).json({ error: 'Invalid setup secret' });
    }
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('email', email)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: error?.message || 'User not found with that email' });
    }
    res.json({ message: `User ${email} has been promoted to admin`, profile: data });
  } catch (error) {
    res.status(500).json({ error: 'Setup failed' });
  }
});

// Dev-only: promote currently logged-in user to admin
router.post('/dev-promote', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', req.user.id)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Promoted to admin', profile: data });
  } catch (error) {
    res.status(500).json({ error: 'Promotion failed' });
  }
});

router.use(authenticate, adminOnly);

router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [users, investments, deposits, withdrawals, transactions, recentUsersRes] = await Promise.all([
      supabase.from('profiles').select('id, role, created_at, country', { count: 'exact' }),
      supabase.from('user_investments').select('id, amount, status', { count: 'exact' }).eq('status', 'active'),
      supabase.from('deposits').select('id, amount').gte('created_at', today),
      supabase.from('withdrawals').select('id, amount').eq('status', 'pending'),
      supabase.from('transactions').select('amount, created_at').gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString()),
      supabase.from('profiles').select('id, full_name, email, status, country, created_at').order('created_at', { ascending: false }).limit(10),
    ]);

    const revenueData = transactions.data?.reduce((acc, t) => {
      const date = t.created_at.split('T')[0];
      acc[date] = (acc[date] || 0) + Number(t.amount);
      return acc;
    }, {});

    const countryStats = users.data?.reduce((acc, u) => {
      const country = u.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalUsers: users.count || 0,
      activeInvestments: investments.count || 0,
      todayDeposits: deposits.data?.reduce((sum, d) => sum + Number(d.amount), 0) || 0,
      pendingWithdrawals: withdrawals.count || 0,
      recentUsers: recentUsersRes.data || [],
      recentDeposits: deposits.data?.slice(-5).reverse() || [],
      pendingWithdrawalsList: withdrawals.data || [],
      revenueChart: revenueData || {},
      countryStats: countryStats || {},
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "user" or "admin"' });
    }
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.get('/investment-plans', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('investment_plans')
      .select('*, cryptocurrencies(*)')
      .order('min_investment', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

router.post('/investment-plans', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('investment_plans')
      .insert(req.body)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

router.put('/investment-plans/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('investment_plans')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

router.delete('/investment-plans/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('investment_plans')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Plan deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

router.get('/user-investments', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_investments')
      .select('*, investment_plans!plan_id(name, daily_return, duration, total_return, risk_level, description), profiles!user_id(full_name, email, username, country, currency)')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    const enriched = (data || []).map(inv => {
      const daysPassed = inv.start_date
        ? Math.floor((Date.now() - new Date(inv.start_date).getTime()) / 86400000)
        : (inv.days_passed || 0);
      const daysRemaining = Math.max(0, (inv.duration || 30) - daysPassed);
      const amount = Number(inv.amount) || 0;
      const dailyReturnPct = Number(inv.investment_plans?.daily_return || inv.daily_return || 0);
      const dailyReturnAmt = amount * (dailyReturnPct / 100);
      const totalEarned = dailyReturnAmt * daysPassed;
      const remainingReturn = dailyReturnAmt * daysRemaining;

      return {
        id: inv.id,
        user_id: inv.user_id,
        user_name: inv.profiles?.full_name || inv.profiles?.username || 'Unknown',
        user_email: inv.profiles?.email || '',
        user_country: inv.profiles?.country || 'Unknown',
        user_currency: inv.profiles?.currency || 'USD',
        plan_name: inv.investment_plans?.name || inv.plan_id,
        amount,
        daily_return_pct: dailyReturnPct,
        daily_return_amt: dailyReturnAmt,
        total_earned: totalEarned,
        remaining_return: remainingReturn,
        duration: inv.duration || 30,
        days_passed: daysPassed,
        days_remaining: daysRemaining,
        status: inv.status,
        start_date: inv.start_date,
        end_date: inv.end_date,
        created_at: inv.created_at,
      };
    });

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user investments' });
  }
});

router.get('/all-plans', async (req, res) => {
  try {
    const { country } = require('../config/countryPlans');
    const { VIP_COUNTRIES, getCountryPlans } = require('../config/countryPlans');

    const { data: dbPlans, error } = await supabase
      .from('investment_plans')
      .select('*, cryptocurrencies(*)')
      .order('min_investment', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });

    const result = (dbPlans || []).map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      min_investment: Number(p.min_investment),
      max_investment: p.max_investment ? Number(p.max_investment) : null,
      daily_return: Number(p.daily_return),
      duration: p.duration,
      total_return: Number(p.total_return),
      risk_level: p.risk_level,
      status: p.status,
      country: null,
      type: 'global',
    }));

    for (const c of VIP_COUNTRIES) {
      const plans = getCountryPlans(c);
      if (!plans) continue;
      for (const p of plans) {
        result.push({
          id: `vip_${c.toLowerCase()}_${p.level}`,
          name: `${p.name} (${c})`,
          description: `${c} VIP ${p.level} — ${p.duration} days, ${p.daily_return}% daily`,
          min_investment: p.min,
          max_investment: p.max,
          daily_return: p.daily_return,
          duration: p.duration,
          total_return: p.daily_return * p.duration,
          risk_level: 'low',
          status: 'active',
          country: c,
          type: 'vip',
        });
      }
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all plans' });
  }
});

router.get('/deposits', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('deposits')
      .select('*, profiles(full_name, email, username, currency)')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deposits' });
  }
});

router.put('/deposits/:id/approve', async (req, res) => {
  try {
    const { data: deposit } = await supabase
      .from('deposits')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!deposit) return res.status(404).json({ error: 'Deposit not found' });

    const { data, error } = await supabase
      .from('deposits')
      .update({ status: 'approved' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', deposit.user_id)
      .single();

    if (wallet) {
      await supabase.from('wallets').update({
        balance: Number(wallet.balance) + Number(deposit.amount),
      }).eq('id', wallet.id);
    }

    // Fetch user's currency from their profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('currency')
      .eq('id', deposit.user_id)
      .single();

    await supabase.from('transactions').insert({
      user_id: deposit.user_id,
      type: 'deposit',
      amount: deposit.amount,
      currency: deposit.currency || profile?.currency || 'USD',
      status: 'completed',
      reference: deposit.reference,
      description: `Deposit via ${deposit.payment_method}`,
    });

    // Referral bonus: 10% of first approved deposit
    const { data: referral } = await supabase
      .from('referrals')
      .select('*')
      .eq('referred_id', deposit.user_id)
      .maybeSingle();

    if (referral && referral.status === 'pending') {
      const bonusAmount = Number(deposit.amount) * 0.10;
      const bonusRef = 'REF' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();

      await supabase.from('referrals').update({
        bonus: bonusAmount,
        status: 'paid',
      }).eq('id', referral.id);

      const { data: referrerWallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', referral.referrer_id)
        .maybeSingle();

      if (referrerWallet) {
        await supabase.from('wallets').update({
          balance: Number(referrerWallet.balance) + bonusAmount,
        }).eq('id', referrerWallet.id);
      }

      const { data: referrerProfile } = await supabase
        .from('profiles')
        .select('currency')
        .eq('id', referral.referrer_id)
        .maybeSingle();

      await supabase.from('transactions').insert({
        user_id: referral.referrer_id,
        type: 'referral_bonus',
        amount: bonusAmount,
        currency: referrerProfile?.currency || 'USD',
        status: 'completed',
        reference: bonusRef,
        description: `10% referral bonus from ${profile?.currency || 'USD'} ${deposit.amount} deposit`,
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve deposit' });
  }
});

router.put('/deposits/:id/reject', async (req, res) => {
  try {
    const { data: deposit } = await supabase
      .from('deposits')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!deposit) return res.status(404).json({ error: 'Deposit not found' });

    const { data, error } = await supabase
      .from('deposits')
      .update({ status: 'rejected' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    // Record a failed transaction for audit trail
    await supabase.from('transactions').insert({
      user_id: deposit.user_id,
      type: 'deposit',
      amount: deposit.amount,
      currency: 'USD',
      status: 'failed',
      reference: deposit.reference,
      description: `Deposit rejected — ${deposit.payment_method}`,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject deposit' });
  }
});

router.get('/withdrawals', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*, profiles(full_name, email, username, currency)')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
});

router.put('/withdrawals/:id/approve', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('withdrawals')
      .update({ status: 'approved' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    await supabase.from('transactions').update({ status: 'completed' })
      .eq('reference', data.reference);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve withdrawal' });
  }
});

router.put('/withdrawals/:id/reject', async (req, res) => {
  try {
    const { data: withdrawal } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', req.params.id)
      .single();

    const { data, error } = await supabase
      .from('withdrawals')
      .update({ status: 'rejected' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', withdrawal.user_id)
      .single();

    if (wallet) {
      await supabase.from('wallets').update({
        balance: Number(wallet.balance) + Number(withdrawal.amount),
      }).eq('id', wallet.id);
    }

    await supabase.from('transactions').update({ status: 'failed' })
      .eq('reference', data.reference);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject withdrawal' });
  }
});

router.get('/coins', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cryptocurrencies')
      .select('*')
      .order('name', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
});

router.post('/coins', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cryptocurrencies')
      .insert(req.body)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create coin' });
  }
});

router.put('/coins/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cryptocurrencies')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update coin' });
  }
});

router.get('/announcements', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

router.post('/announcements', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .insert({ ...req.body, created_by: req.user.id })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

router.delete('/announcements/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('transactions')
      .select('*, profiles(full_name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ data, total: count, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Approve a pending transaction (mark as completed)
router.put('/transactions/:id/approve', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({ status: 'completed' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve transaction' });
  }
});

// Delete a transaction permanently
router.delete('/transactions/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// Truncate all financial data to prepare system for production
router.post('/truncate-all', async (req, res) => {
  try {
    // Delete all transactions
    const { error: txErr } = await supabase
      .from('transactions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Delete all deposits
    const { error: depErr } = await supabase
      .from('deposits')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Delete all withdrawals
    const { error: wdErr } = await supabase
      .from('withdrawals')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Delete all user investments
    const { error: invErr } = await supabase
      .from('user_investments')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Reset all wallet balances to 0
    const { error: walErr } = await supabase
      .from('wallets')
      .update({ balance: 0 })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    const errors = [txErr, depErr, wdErr, invErr, walErr].filter(Boolean);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.map(e => e.message).join('; ') });
    }

    res.json({ success: true, message: 'All transactions, deposits, withdrawals, investments cleared. Wallets reset to 0.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to truncate data' });
  }
});

router.get('/referrals', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('*, referrer:profiles!referrer_id(full_name, email), referred:profiles!referred_id(full_name, email)')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch referrals' });
  }
});

router.get('/settings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') return res.status(400).json({ error: error.message });
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const { platform_name, maintenance_mode } = req.body;

    const payload = {};
    if (platform_name !== undefined) payload.site_name = platform_name;
    if (maintenance_mode !== undefined) payload.maintenance_mode = maintenance_mode;
    payload.updated_at = new Date().toISOString();

    const { data: rows, error: fetchErr } = await supabase
      .from('settings')
      .select('id')
      .limit(1);

    if (fetchErr) return res.status(400).json({ error: fetchErr.message });

    const existing = rows && rows.length > 0 ? rows[0] : null;

    let result;
    if (existing) {
      const { data, error } = await supabase
        .from('settings')
        .update(payload)
        .eq('id', existing.id)
        .select();
      if (error) return res.status(400).json({ error: error.message });
      result = data && data[0];
    } else {
      const { data, error } = await supabase
        .from('settings')
        .insert({ ...payload, id: existing?.id || undefined });
      if (error) return res.status(400).json({ error: error.message });
      result = data;
    }

    res.json(result || payload);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
