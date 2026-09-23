-- =========================================================================
-- AGRINOVA / ANAAJ - PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Execute this entire script inside the Supabase Dashboard -> SQL Editor
-- =========================================================================

-- 1. Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- TABLE 1: WAREHOUSE BOOKINGS (WDRA Storage & e-NWR Pledge Loans)
-- =========================================================================
CREATE TABLE IF NOT EXISTS warehouse_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code TEXT UNIQUE NOT NULL,
    user_id TEXT,
    user_name TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    user_district TEXT DEFAULT 'Nashik',
    user_state TEXT DEFAULT 'Maharashtra',
    crop_name TEXT NOT NULL,
    quantity_qtl NUMERIC NOT NULL CHECK (quantity_qtl > 0),
    warehouse_name TEXT NOT NULL,
    warehouse_location TEXT NOT NULL,
    holding_days INTEGER NOT NULL DEFAULT 60 CHECK (holding_days > 0),
    monthly_rent_per_qtl NUMERIC NOT NULL DEFAULT 25.0,
    total_rent NUMERIC NOT NULL,
    pledge_loan_opted BOOLEAN NOT NULL DEFAULT true,
    pledge_loan_amount NUMERIC NOT NULL DEFAULT 0.0,
    status TEXT NOT NULL DEFAULT 'CONFIRMED', -- 'CONFIRMED', 'STORED', 'DISPATCHED', 'CANCELLED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- TABLE 2: CROP MARKETPLACE LISTINGS (Farmer Spot Offerings)
-- =========================================================================
CREATE TABLE IF NOT EXISTS crop_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_code TEXT UNIQUE NOT NULL,
    farmer_id TEXT,
    farmer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    district TEXT NOT NULL DEFAULT 'Nashik',
    crop_name TEXT NOT NULL,
    variety TEXT DEFAULT 'FAQ Standard',
    quality_grade TEXT DEFAULT 'Grade A',
    quantity_qtl NUMERIC NOT NULL CHECK (quantity_qtl > 0),
    base_price_per_qtl NUMERIC NOT NULL CHECK (base_price_per_qtl > 0),
    mandi_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'SOLD', 'EXPIRED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- TABLE 3: MARKETPLACE BIDS (Buyer Competitive Offers)
-- =========================================================================
CREATE TABLE IF NOT EXISTS market_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES crop_listings(id) ON DELETE CASCADE,
    buyer_id TEXT,
    buyer_name TEXT NOT NULL,
    buyer_company TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    bid_price_per_qtl NUMERIC NOT NULL CHECK (bid_price_per_qtl > 0),
    quantity_qtl NUMERIC NOT NULL CHECK (quantity_qtl > 0),
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'REJECTED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- TABLE 4: FARMER GRIEVANCES & HELPDESK TICKETS
-- =========================================================================
CREATE TABLE IF NOT EXISTS farmer_grievances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_code TEXT UNIQUE NOT NULL,
    farmer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    state TEXT DEFAULT 'Maharashtra',
    district TEXT DEFAULT 'Nashik',
    category TEXT NOT NULL, -- 'Payment Issue', 'Mandi Weighbridge', 'Warehouse Dispute', 'Quality Assessment', 'Other'
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'URGENT'
    status TEXT NOT NULL DEFAULT 'UNDER_REVIEW', -- 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- TABLE 5: REAL-TIME PRICE ALERTS (Target Threshold Notifications)
-- =========================================================================
CREATE TABLE IF NOT EXISTS price_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    mandi_name TEXT NOT NULL,
    target_price NUMERIC NOT NULL CHECK (target_price > 0),
    condition TEXT NOT NULL DEFAULT 'ABOVE', -- 'ABOVE', 'BELOW'
    is_active BOOLEAN NOT NULL DEFAULT true,
    triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_warehouse_bookings_user_phone ON warehouse_bookings(user_phone);
CREATE INDEX IF NOT EXISTS idx_warehouse_bookings_created ON warehouse_bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crop_listings_status ON crop_listings(status);
CREATE INDEX IF NOT EXISTS idx_crop_listings_crop ON crop_listings(crop_name);
CREATE INDEX IF NOT EXISTS idx_farmer_grievances_phone ON farmer_grievances(phone);
CREATE INDEX IF NOT EXISTS idx_farmer_grievances_status ON farmer_grievances(status);
CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON price_alerts(is_active) WHERE is_active = true;

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enables public anon read and insert access for frontend pairing
-- =========================================================================
ALTER TABLE warehouse_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- Allow public read & write via Anon Key
CREATE POLICY "Allow public read on warehouse_bookings" ON warehouse_bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on warehouse_bookings" ON warehouse_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on warehouse_bookings" ON warehouse_bookings FOR UPDATE USING (true);

CREATE POLICY "Allow public read on crop_listings" ON crop_listings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on crop_listings" ON crop_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on crop_listings" ON crop_listings FOR UPDATE USING (true);

CREATE POLICY "Allow public read on market_bids" ON market_bids FOR SELECT USING (true);
CREATE POLICY "Allow public insert on market_bids" ON market_bids FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on farmer_grievances" ON farmer_grievances FOR SELECT USING (true);
CREATE POLICY "Allow public insert on farmer_grievances" ON farmer_grievances FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on price_alerts" ON price_alerts FOR SELECT USING (true);
CREATE POLICY "Allow public insert on price_alerts" ON price_alerts FOR INSERT WITH CHECK (true);

-- =========================================================================
-- INITIAL SEED DATA (For Immediate Demonstration)
-- =========================================================================
INSERT INTO crop_listings (listing_code, farmer_name, phone, state, district, crop_name, variety, quantity_qtl, base_price_per_qtl, mandi_name, status)
VALUES 
('LIST-MH-701', 'Dnyaneshwar Patil', '+91 98231 44521', 'Maharashtra', 'Nashik', 'Onion', 'Garwa (Red Nashik)', 150.0, 2680.0, 'Lasalgaon APMC', 'ACTIVE'),
('LIST-MH-702', 'Ramesh Jadhav', '+91 94220 18231', 'Maharashtra', 'Latur', 'Soybean', 'JS-335 Yellow', 80.0, 5210.0, 'Latur APMC', 'ACTIVE'),
('LIST-UP-703', 'Ram Sevak Shukla', '+91 98390 12345', 'Uttar Pradesh', 'Prayagraj', 'Wheat', 'Sharbati Lokwan', 120.0, 2650.0, 'Jasra Mandi', 'ACTIVE')
ON CONFLICT (listing_code) DO NOTHING;

INSERT INTO warehouse_bookings (booking_code, user_name, user_phone, user_district, user_state, crop_name, quantity_qtl, warehouse_name, warehouse_location, holding_days, monthly_rent_per_qtl, total_rent, pledge_loan_opted, pledge_loan_amount, status)
VALUES
('WB-2026-9812', 'Dnyaneshwar Patil', '+91 98231 44521', 'Nashik', 'Maharashtra', 'Onion', 100.0, 'MahaAgro Logistics Cold Hub #4', 'Pimpalgaon, Nashik (WDRA Reg: WR-MH-4402)', 60, 28.0, 5600.0, true, 185500.0, 'CONFIRMED')
ON CONFLICT (booking_code) DO NOTHING;

-- =========================================================================
-- TABLE 6: FPO MEMBERSHIPS
-- =========================================================================
CREATE TABLE IF NOT EXISTS fpo_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membership_code TEXT UNIQUE,
    fpo_id TEXT NOT NULL,
    fpo_name TEXT,
    farmer_id TEXT NOT NULL,
    farmer_name TEXT NOT NULL,
    farmer_phone TEXT NOT NULL,
    farmer_village TEXT,
    land_acres NUMERIC DEFAULT 1.0,
    crop TEXT,
    lot_ready_qtl NUMERIC DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- TABLE 7: FPO JOIN REQUESTS
-- =========================================================================
CREATE TABLE IF NOT EXISTS fpo_join_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_code TEXT UNIQUE NOT NULL,
    fpo_id TEXT NOT NULL,
    fpo_name TEXT NOT NULL,
    farmer_id TEXT NOT NULL,
    farmer_name TEXT NOT NULL,
    farmer_phone TEXT NOT NULL,
    farmer_village TEXT,
    farmer_crop TEXT,
    land_acres NUMERIC DEFAULT 1.0,
    harvest_qty TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    response_note TEXT,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at TIMESTAMPTZ
);

-- =========================================================================
-- TABLE 8: USER PROFILES & ACCOUNTS
-- =========================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id TEXT PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    village TEXT,
    district TEXT,
    state TEXT,
    pincode TEXT,
    avatar TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- TABLE 9: AUTHENTICATION SECURE OTPS
-- =========================================================================
CREATE TABLE IF NOT EXISTS auth_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    role TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE fpo_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE fpo_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_otps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all on fpo_memberships" ON fpo_memberships FOR ALL USING (true);
CREATE POLICY "Allow public all on fpo_join_requests" ON fpo_join_requests FOR ALL USING (true);
CREATE POLICY "Allow public all on user_profiles" ON user_profiles FOR ALL USING (true);
CREATE POLICY "Allow public all on auth_otps" ON auth_otps FOR ALL USING (true);

