const express = require('express');
const router = express.Router();
const { processDailyReturns } = require('../services/dailyReturns');

/**
 * POST /api/cron/daily-returns
 *
 * Vercel-compatible HTTP endpoint for triggering daily ROI distribution.
 * Protected by CRON_SECRET environment variable (Bearer token).
 *
 * Set up a free cron job at https://cron-job.org to call this endpoint
 * every day at 00:01 UTC with header:  Authorization: Bearer <CRON_SECRET>
 */
router.post('/daily-returns', async (req, res) => {
    try {
        // ── Security: validate Bearer secret ─────────────────────────────────
        const cronSecret = process.env.CRON_SECRET;
        if (cronSecret) {
            const authHeader = req.headers['authorization'] || '';
            const provided = authHeader.replace(/^Bearer\s+/i, '').trim();
            if (provided !== cronSecret) {
                return res.status(401).json({ error: 'Unauthorized: invalid cron secret' });
            }
        }

        console.log('[Cron HTTP] Triggered daily-returns via HTTP');
        const result = await processDailyReturns();
        res.json({ ok: true, ...result });
    } catch (err) {
        console.error('[Cron HTTP] daily-returns failed:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
