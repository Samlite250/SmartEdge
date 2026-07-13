const supabase = require('../config/database');
const { generateTransactionRef } = require('../utils/helpers');

/**
 * processDailyReturns()
 *
 * Safe to call multiple times per day — uses `last_credit_date` to skip
 * investments that have already been credited today.
 *
 * For each active investment it:
 *   1. Skips if already credited today
 *   2. Credits the daily_return amount to the user's wallet (correct currency)
 *   3. Logs a `daily_return` transaction
 *   4. Increments days_passed and total_earned
 *   5. On maturity (days_passed reaches duration):
 *      - Credits the original capital back to the user's wallet
 *      - Logs a `capital_return` transaction
 *      - Marks the investment as `completed`
 *
 * Returns { processed, skipped, matured } counts.
 */
async function processDailyReturns() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const { data: investments, error } = await supabase
    .from('user_investments')
    .select('*')
    .eq('status', 'active');

  if (error) {
    console.error('[Daily Returns] Failed to fetch investments:', error.message);
    throw error;
  }

  if (!investments || investments.length === 0) {
    console.log('[Daily Returns] No active investments to process.');
    return { processed: 0, skipped: 0, matured: 0 };
  }

  let processed = 0;
  let skipped = 0;
  let matured = 0;

  for (const inv of investments) {
    try {
      // ── 1. Idempotency guard ──────────────────────────────────────────
      if (inv.last_credit_date === today) {
        skipped++;
        continue;
      }

      const earnings = Number(inv.daily_return);
      if (earnings <= 0) { skipped++; continue; }

      // ── 2. Fetch wallet (for balance + correct currency) ──────────────
      const { data: wallet, error: walletErr } = await supabase
        .from('wallets')
        .select('id, balance, currency')
        .eq('user_id', inv.user_id)
        .single();

      if (walletErr || !wallet) {
        console.error(`[Daily Returns] No wallet for user ${inv.user_id}`, walletErr?.message);
        continue;
      }

      const currency = wallet.currency || 'USD';

      // ── 3. Credit daily earnings ──────────────────────────────────────
      const newBalance = Number(wallet.balance) + earnings;
      await supabase.from('wallets').update({ balance: newBalance }).eq('id', wallet.id);

      // ── 4. Log daily_return transaction ───────────────────────────────
      await supabase.from('transactions').insert({
        user_id: inv.user_id,
        type: 'daily_return',
        amount: earnings,
        currency,
        status: 'completed',
        reference: generateTransactionRef(),
        description: `Daily return — investment #${inv.id.slice(0, 8)}`,
      });

      // ── 5. Update investment counters ─────────────────────────────────
      const newDaysPassed = (Number(inv.days_passed) || 0) + 1;
      const newTotalEarned = (Number(inv.total_earned) || 0) + earnings;
      const duration = Number(inv.duration) || 0;
      const investAmount = Number(inv.amount) || 0;

      const isComplete = newDaysPassed >= duration ||
        newTotalEarned >= Number(inv.total_expected_return);

      const updates = {
        days_passed: newDaysPassed,
        total_earned: newTotalEarned,
        last_credit_date: today,
      };

      // ── 6. Maturity: return capital ───────────────────────────────────
      if (isComplete) {
        // Credit original capital back
        const capitalBalance = newBalance + investAmount; // wallet already updated above
        await supabase.from('wallets').update({ balance: capitalBalance }).eq('id', wallet.id);

        await supabase.from('transactions').insert({
          user_id: inv.user_id,
          type: 'capital_return',
          amount: investAmount,
          currency,
          status: 'completed',
          reference: generateTransactionRef(),
          description: `Capital returned — investment #${inv.id.slice(0, 8)} matured`,
        });

        updates.status = 'completed';
        matured++;
      }

      await supabase.from('user_investments').update(updates).eq('id', inv.id);
      processed++;
    } catch (invErr) {
      console.error(`[Daily Returns] Error processing investment ${inv.id}:`, invErr.message);
    }
  }

  console.log(`[Daily Returns] ${today} — processed:${processed} skipped:${skipped} matured:${matured}`);
  return { processed, skipped, matured };
}

module.exports = { processDailyReturns };
