const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { generateDepositRef, generateReferralCode, getCountryCurrency } = require('../utils/helpers');

router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, username, phone, country, referralCode } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Full name is required (min 2 characters)' });
    }

    const config = require('../config');
    const isMock = !config.supabase.url || config.supabase.url.includes('your-project');

    let userId;

    if (isMock) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, username } },
      });
      if (authError) return res.status(400).json({ error: authError.message });
      userId = authData.user.id;
    } else {
      const { createClient } = require('@supabase/supabase-js');
      const adminClient = createClient(config.supabase.url, config.supabase.serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      });

      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, username },
      });
      if (authError) return res.status(400).json({ error: authError.message });
      userId = authData.user.id;
    }

    const userCurrency = getCountryCurrency(country);

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    let profileError;
    if (existingProfile) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          username,
          phone,
          country: country || 'International',
          currency: userCurrency,
        })
        .eq('id', userId);
      profileError = error;
    } else {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email,
          full_name: fullName,
          username,
          phone,
          country: country || 'International',
          currency: userCurrency,
          role: 'user',
          referral_code: generateReferralCode(),
        });
      profileError = error;
    }

    if (profileError) return res.status(400).json({ error: profileError.message });

    if (referralCode) {
      const { data: referrer } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referralCode)
        .maybeSingle();

      if (referrer) {
        await supabase.from('referrals').insert({
          referrer_id: referrer.id,
          referred_id: userId,
          bonus: 0,
        });
      }
    }

    const { data: existingWallet } = await supabase
      .from('wallets')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!existingWallet) {
      await supabase.from('wallets').insert({
        user_id: userId,
        balance: 0,
        currency: userCurrency,
      });
    } else {
      await supabase
        .from('wallets')
        .update({ currency: userCurrency })
        .eq('user_id', userId);
    }

    res.status(201).json({
      message: 'Registration successful. You can now log in.',
      user: { id: userId, email },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(401).json({ error: error.message || 'Invalid credentials' });
    }

    if (!data?.user?.id) {
      return res.status(500).json({ error: 'Authentication returned no user' });
    }

    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();

    if (profileError || !profile) {
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }

    res.json({
      token: data.session.access_token,
      user: { ...data.user, profile },
    });
  } catch (error) {
    console.error('[Login Error]', error?.message || error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
});


router.post('/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Reset token is required. Use the link from your email.' });
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' });
  }
});

module.exports = router;
