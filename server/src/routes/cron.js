const express = require('express');
const router = express.Router();
const { processDailyReturns } = require('../services/dailyReturns');

/**
 * POST /api/cron/daily-returns
 *
 * Called automatically by Vercel's native cron (defined in vercel.json — no third-party needed).
 * Vercel sends x-vercel-cron: 1 on native invocations.
 * Manual / test calls require Authorization: Bearer <CRON_SECRET>
 */
router.post('/daily-returns', async (req, res) => {
    try {
        const isVercelCron = req.headers['x-vercel-cron'] === '1';
        const cronSecret = process.env.CRON_SECRET;

        if (!isVercelCron && cronSecret) {
            const authHeader = req.headers['authorization'] || '';
            const provided = authHeader.replace(/^Bearer\s+/i, '').trim();
            if (provided !== cronSecret) {
                return res.status(401).json({ error: 'Unauthorized: invalid cron secret' });
            }
        }

        console.log(`[Cron] daily-returns triggered (vercel-native: ${isVercelCron})`);
        const result = await processDailyReturns();
        res.json({ ok: true, ...result });
    } catch (err) {
        console.error('[Cron] daily-returns failed:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
