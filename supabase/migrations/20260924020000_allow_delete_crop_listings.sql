-- Allow delete policy on crop_listings
CREATE POLICY "Allow public delete on crop_listings" ON crop_listings FOR DELETE USING (true);
