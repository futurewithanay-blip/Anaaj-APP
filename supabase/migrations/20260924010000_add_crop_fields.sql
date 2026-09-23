-- =========================================================================
-- MIGRATION: Add image_url, moisture_pct, harvest_date, notes to crop_listings
-- =========================================================================
ALTER TABLE crop_listings ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE crop_listings ADD COLUMN IF NOT EXISTS moisture_pct NUMERIC;
ALTER TABLE crop_listings ADD COLUMN IF NOT EXISTS harvest_date TEXT;
ALTER TABLE crop_listings ADD COLUMN IF NOT EXISTS notes TEXT;
