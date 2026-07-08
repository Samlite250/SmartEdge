const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { generateDepositRef } = require('../utils/helpers');

router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, username, phone, country, referralCode } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, username } },
    });

    if (authError) return res.status(400).json({ error: authError.message });

    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        username,
        phone,
        country: country || 'International',
        currency: country && country !== 'International' ? 
          (country === 'Uganda' ? 'UGX' : country === 'Kenya' ? 'KES' : country === 'Rwanda' ? 'RWF' : 'BIF') 
          : 'USD',
        role: 'user',
        referral_code: generateDepositRef().slice(0, 10),
      });

      if (profileError) return res.status(400).json({ error: profileError.message });

      if (referralCode) {
        const { data: referrer } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', referralCode)
          .single();

        if (referrer) {
          await supabase.from('referrals').insert({
            referrer_id: referrer.id,
            referred_id: authData.user.id,
            bonus: 0,
          });
        }
      }

      await supabase.from('wallets').insert({
        user_id: authData.user.id,
        balance: 0,
        currency: country && country !== 'International' ? 
          (country === 'Uganda' ? 'UGX' : country === 'Kenya' ? 'KES' : country === 'Rwanda' ? 'RWF' : 'BIF') 
          : 'USD',
      });
    }

    res.status(201).json({
      message: 'Registration successful. Please check your email to confirm.',
      user: authData.user,
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(401).json({ error: 'Invalid credentials' });

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({
      token: data.session.access_token,
      user: { ...data.user, profile },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
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
    const { accessToken, newPassword } = req.body;
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' });
  }
});

module.exports = router;
