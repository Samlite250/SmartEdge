const supabase = require('../config/database');
const { generateTransactionRef } = require('../utils/helpers');

async function processDailyReturns() {
  try {
    const { data: investments, error } = await supabase
      .from('user_investments')
      .select('*')
      .eq('status', 'active');

    if (error) { console.error('Failed to fetch investments:', error); return; }
    if (!investments || investments.length === 0) return;

    const today = new Date().toISOString().split('T')[0];

    for (const inv of investments) {
      const earnings = Number(inv.daily_return);

      const { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', inv.user_id)
        .single();

      if (wallet) {
        const newBalance = Number(wallet.balance) + earnings;
        await supabase.from('wallets').update({ balance: newBalance }).eq('id', wallet.id);
      }

      const newTotalEarned = Number(inv.total_earned) + earnings;
      const updates = { total_earned: newTotalEarned };

      const endDate = new Date(inv.end_date);
      if (newTotalEarned >= Number(inv.total_expected_return) || new Date() >= endDate) {
        updates.status = 'completed';
      }

      await supabase.from('user_investments').update(updates).eq('id', inv.id);

      await supabase.from('transactions').insert({
        user_id: inv.user_id,
        type: 'daily_return',
        amount: earnings,
        currency: 'USD',
        status: 'completed',
        reference: generateTransactionRef(),
        description: `Daily return on investment #${inv.id.slice(0, 8)}`,
      });
    }

    console.log(`[Daily Returns] Processed ${investments.length} investments for ${today}`);
  } catch (err) {
    console.error('[Daily Returns] Error:', err);
  }
}

module.exports = { processDailyReturns };
