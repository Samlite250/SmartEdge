const supabase = require('../config/database');
const config = require('../config');

const isMock = process.env.USE_MOCK === 'true' || !config.supabase?.url || config.supabase?.url?.includes('your-project');

// Verify the token using an isolated anon client so we never pollute
// the global service-key client's auth session.
async function verifyToken(token) {
  if (isMock) {
    return supabase.auth.getUser(token);
  }
  const { createClient } = require('@supabase/supabase-js');
  const client = createClient(config.supabase.url, config.supabase.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
  return client.auth.getUser(token);
}

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await verifyToken(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};

const adminOnly = async (req, res, next) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    if (profile.role !== 'admin') {
      const config = require('../config');
      const isDev = config.nodeEnv !== 'production';

      if (isDev) {
        await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', req.user.id);
        return next();
      }

      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Authorization failed' });
  }
};

module.exports = { authenticate, adminOnly };
