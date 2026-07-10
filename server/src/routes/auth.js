const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { generateDepositRef, generateReferralCode } = require('../utils/helpers');

router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, username, phone, country, referralCode } = req.body;

    const { createClient } = require('@supabase/supabase-js');
    const config = require('../config');
    // Use admin client (service key) for privileged operations
    const adminClient = createClient(config.supabase.url, config.supabase.serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,  // Auto-confirm so user can login immediately
      user_metadata: { full_name: fullName, username },
    });

    if (authError) return res.status(400).json({ error: authError.message });

    if (authData.user) {
      const userCurrency = country && country !== 'International'
        ? (country === 'Uganda' ? 'UGX' : country === 'Kenya' ? 'KES' : country === 'Rwanda' ? 'RWF' : 'BIF')
        : 'USD';

      // Check if profile was already created (e.g. by database trigger)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user.id)
        .maybeSingle();

      let profileError;
      if (existingProfile) {
        // Update existing profile (especially country, currency, phone, full_name, username)
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            username,
            phone,
            country: country || 'International',
            currency: userCurrency,
          })
          .eq('id', authData.user.id);
        profileError = error;
      } else {
        // Insert new profile
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
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
          .single();

        if (referrer) {
          await supabase.from('referrals').insert({
            referrer_id: referrer.id,
            referred_id: authData.user.id,
            bonus: 0,
          });
        }
      }

      // Check if wallet was already created (e.g. by database trigger)
      const { data: existingWallet } = await supabase
        .from('wallets')
        .select('id')
        .eq('user_id', authData.user.id)
        .maybeSingle();

      if (!existingWallet) {
        await supabase.from('wallets').insert({
          user_id: authData.user.id,
          balance: 0,
          currency: userCurrency,
        });
      } else {
        // Update currency if needed
        await supabase
          .from('wallets')
          .update({
            currency: userCurrency,
          })
          .eq('user_id', authData.user.id);
      }
    }

    res.status(201).json({
      message: 'Registration successful. You can now log in.',
      user: authData.user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // If email is not confirmed, auto-confirm via admin API and retry login
      if (error.message?.toLowerCase().includes('email not confirmed') ||
        error.message?.toLowerCase().includes('not confirmed')) {
        try {
          const { createClient } = require('@supabase/supabase-js');
          const config = require('../config');
          const adminClient = createClient(config.supabase.url, config.supabase.serviceKey, {
            auth: { autoRefreshToken: false, persistSession: false }
          });
          // Find the user's ID via profile (fast lookup by email)
          const { data: profile } = await supabase.from('profiles').select('id').eq('email', email).single();
          if (profile?.id) {
            await adminClient.auth.admin.updateUserById(profile.id, { email_confirm: true });
            // Retry login
            const retry = await supabase.auth.signInWithPassword({ email, password });
            if (!retry.error && retry.data?.session) {
              const { data: userProfile } = await supabase.from('profiles').select('*').eq('id', retry.data.user.id).single();
              return res.json({ token: retry.data.session.access_token, user: { ...retry.data.user, profile: userProfile } });
            }
          }
        } catch (adminErr) {
          console.error('Auto-confirm failed:', adminErr.message);
        }
        return res.status(401).json({ error: 'Email not confirmed. Please check your inbox or contact support.' });
      }
      return res.status(401).json({ error: error.message || 'Invalid credentials' });
    }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();

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
