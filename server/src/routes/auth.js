const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { getCountryCurrency, generateReferralCode } = require('../utils/helpers');
const config = require('../config');

const isMock = process.env.USE_MOCK === 'true' || !config.supabase.url || config.supabase.url.includes('your-project');

function getAuthClient() {
  if (isMock) return supabase;
  const { createClient } = require('@supabase/supabase-js');
  return createClient(config.supabase.url, config.supabase.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, phone, country, referralCode } = req.body;
    // Validate required country
    if (!country) {
      return res.status(400).json({ error: 'Country is required' });
    }

    const config = require('../config');
    const isMock = !config.supabase.url || config.supabase.url.includes('your-project');

    let userId;

    // Initialise adminClient based on environment
    let adminClient;
    if (isMock) {
      // Mock mode: reuse regular supabase client (no RLS)
      adminClient = supabase;
      const { data: authData, error: authError } = await adminClient.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (authError) return res.status(400).json({ error: authError.message });
      userId = authData.user.id;
    } else {
      // Real Supabase: use admin client for privileged operations
      const { createClient } = require('@supabase/supabase-js');
      adminClient = createClient(config.supabase.url, config.supabase.serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });
      if (authError) return res.status(400).json({ error: authError.message });
      userId = authData.user.id;
    }

    const userCurrency = getCountryCurrency(country);

    const { data: existingProfile } = await adminClient
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    let profileError;
    if (existingProfile) {
      const { error } = await adminClient
        .from('profiles')
        .update({
          full_name: fullName,
          phone,
          country: country,
          currency: userCurrency,
        })
        .eq('id', userId);
      profileError = error;
    } else {
      const { error } = await adminClient
        .from('profiles')
        .insert({
          id: userId,
          email,
          full_name: fullName,
          phone,
          country: country,
          currency: userCurrency,
          role: 'user',
          referral_code: generateReferralCode(),
        });
      profileError = error;
    }

    if (profileError) return res.status(400).json({ error: profileError.message });

    if (referralCode) {
      const { data: referrer } = await adminClient
        .from('profiles')
        .select('id')
        .eq('referral_code', referralCode)
        .single();

      if (referrer) {
        await supabase.from('referrals').insert({
          referrer_id: referrer.id,
          referred_id: userId,
          bonus: 0,
        });
      }
    }

    const { data: existingWallet } = await adminClient
      .from('wallets')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!existingWallet) {
      await adminClient.from('wallets').insert({
        user_id: userId,
        balance: 0,
        currency: userCurrency,
      });
    } else {
      await adminClient
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

    const authClient = getAuthClient();
    const { data, error } = await authClient.auth.signInWithPassword({ email, password });

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
            const retryClient = getAuthClient();
            const retry = await retryClient.auth.signInWithPassword({ email, password });
            if (!retry.error && retry.data?.session) {
              const { data: userProfile } = await supabase.from('profiles').select('*').eq('id', retry.data.user.id).single();
              return res.json({
                token: retry.data.session.access_token,
                refreshToken: retry.data.session.refresh_token,
                user: { ...retry.data.user, profile: userProfile }
              });
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
      refreshToken: data.session.refresh_token,
      user: { ...data.user, profile },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});


router.post('/logout', async (req, res) => {
  try {
    const authClient = getAuthClient();
    const { error } = await authClient.auth.signOut();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

    const authClient = getAuthClient();
    const { data, error } = await authClient.auth.refreshSession({ refresh_token: refreshToken });

    if (error || !data?.session) {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }

    res.json({
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const authClient = getAuthClient();
    const { error } = await authClient.auth.resetPasswordForEmail(email);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { accessToken, newPassword } = req.body;
    const { createClient } = require('@supabase/supabase-js');
    const client = isMock ? supabase : createClient(config.supabase.url, config.supabase.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${accessToken}` } }
    });
    const { error } = await client.auth.updateUser({ password: newPassword });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' });
  }
});

module.exports = router;
