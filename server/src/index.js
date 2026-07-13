const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const investmentRoutes = require('./routes/investments');
const walletRoutes = require('./routes/wallet');
const depositRoutes = require('./routes/deposits');
const withdrawalRoutes = require('./routes/withdrawals');
const adminRoutes = require('./routes/admin');
const marketRoutes = require('./routes/markets');
const announcementRoutes = require('./routes/announcements');
const referralRoutes = require('./routes/referrals');
const cronRoutes = require('./routes/cron');
const cron = require('node-cron');
const { processDailyReturns } = require('./services/dailyReturns');

const app = express();

app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  config.frontendUrl,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server requests (no origin) and any vercel.app deployment
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(compression());
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/cron', cronRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message, err.stack);
  const isDev = config.nodeEnv !== 'production';
  res.status(500).json({ error: isDev ? err.message : 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const isVercel = process.env.VERCEL === '1';

if (!isVercel) {
  // Run at midnight every day (non-Vercel environments)
  cron.schedule('0 0 * * *', () => {
    console.log('[Cron] Running daily returns...');
    processDailyReturns().catch(err => console.error('[Cron] uncaught:', err.message));
  });

  app.listen(config.port, () => {
    console.log(`Smart Edge API running on port ${config.port}`);
  });
}

module.exports = app;
