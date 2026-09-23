DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'crop_listings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE crop_listings;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'market_bids'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE market_bids;
  END IF;
END $$;
