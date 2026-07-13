-- ============================================================
-- Migration: Add payment_instructions table
-- Run this in your Supabase project SQL Editor:
-- https://supabase.com/dashboard → SQL Editor
-- ============================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS payment_instructions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country VARCHAR(100) UNIQUE NOT NULL,
  method VARCHAR(100) NOT NULL,
  instructions TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE payment_instructions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
DROP POLICY IF EXISTS "Anyone can read payment instructions" ON payment_instructions;
CREATE POLICY "Anyone can read payment instructions"
  ON payment_instructions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can modify payment instructions" ON payment_instructions;
CREATE POLICY "Admin can modify payment instructions"
  ON payment_instructions FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- 4. Seed default instructions
INSERT INTO payment_instructions (country, method, instructions) VALUES
  ('Uganda', 'Rwanda Mobile Money',
'How to send VIP plan via Rwanda mobile money 

Dial *182#
1.Choose 1 send money 
2.Choose 3 international transfer 
3.Country /Rwanda 
4.Number MTN:250795719072
Airtel:250738546399
5.Enter amount to send 
5.Check Names: Razard DUKUZUMUREMYI
6.Reason: gift 
7.Enter password to Confirm 

After Deposit remember to submit payment Proof!'),
  ('Burundi', 'Burundi Payment',
'Uko wariha umutahe muri Smart Edge

Pfonda *163#*

1.kurungika

2.Numero:68457118  

3._Shiramwo umutahe

N.B: UMUTAHE MUNINI NI 3.000.000 FBU

4.Amazina: Ndayikeza Elisabeth
5. Shiramwo Pin hama Wemeze'),
  ('Rwanda', 'Momo Pay',
'Dial *182*8*1#
Enter Momo Code: 223468
Enter Amount To Deposit
Check if names is Samuel
Enter Pin to comfirm')
ON CONFLICT (country) DO UPDATE SET
  method = EXCLUDED.method,
  instructions = EXCLUDED.instructions,
  updated_at = NOW();
