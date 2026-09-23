-- Allow public update and delete on market_bids
CREATE POLICY "Allow public update on market_bids" ON market_bids FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on market_bids" ON market_bids FOR DELETE USING (true);

-- Add optional columns for negotiation & messages if not exists
ALTER TABLE market_bids ADD COLUMN IF NOT EXISTS counter_price_per_qtl NUMERIC;
ALTER TABLE market_bids ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE market_bids ADD COLUMN IF NOT EXISTS thread JSONB DEFAULT '[]'::jsonb;
