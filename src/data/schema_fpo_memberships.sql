-- ============================================================================
-- anaaj: FPO Membership & Follow/Join Request Architecture
-- Dialect: PostgreSQL (Supabase / Neon / AWS RDS compatible)
-- ============================================================================

-- Enable pgcrypto / uuid extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum types (optional, can also use VARCHAR with CHECK constraints)
DO $$ BEGIN
  CREATE TYPE fpo_request_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE fpo_membership_status AS ENUM ('active', 'left', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- 1. Table: fpo_join_requests
-- Represents the "follow request" or affiliation application flow between a farmer and an FPO.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fpo_join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fpo_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending' | 'accepted' | 'rejected' | 'cancelled'
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP WITH TIME ZONE,
  response_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning fast lookups & notification feeds
CREATE INDEX IF NOT EXISTS idx_fpo_join_requests_fpo_status 
  ON fpo_join_requests (fpo_id, status);

CREATE INDEX IF NOT EXISTS idx_fpo_join_requests_farmer_status 
  ON fpo_join_requests (farmer_id, status);

-- Partial Unique Index: Ensures a farmer cannot have multiple concurrent 'pending' requests to the same FPO,
-- while allowing historical accepted/rejected requests to be re-applied in the future.
CREATE UNIQUE INDEX IF NOT EXISTS uq_fpo_farmer_pending_request 
  ON fpo_join_requests (farmer_id, fpo_id) 
  WHERE status = 'pending';


-- ----------------------------------------------------------------------------
-- 2. Table: fpo_memberships
-- Active and historical records of farmers associated with FPOs.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fpo_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fpo_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active' | 'left' | 'suspended'
  share_certificates_count INTEGER DEFAULT 1,
  voting_eligibility BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure a farmer can only hold one active membership per FPO at a given time
CREATE UNIQUE INDEX IF NOT EXISTS uq_fpo_farmer_active_membership 
  ON fpo_memberships (farmer_id, fpo_id) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_fpo_memberships_fpo 
  ON fpo_memberships (fpo_id, status);

CREATE INDEX IF NOT EXISTS idx_fpo_memberships_farmer 
  ON fpo_memberships (farmer_id, status);


-- ----------------------------------------------------------------------------
-- 3. Automated Trigger & Stored Procedure:
-- When an FPO accepts a join request, automatically create or re-activate the membership!
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_handle_fpo_join_request_update()
RETURNS TRIGGER AS $$
BEGIN
  -- If status transitioned to 'accepted'
  IF NEW.status = 'accepted' AND (OLD.status IS DISTINCT FROM 'accepted') THEN
    NEW.responded_at := CURRENT_TIMESTAMP;
    
    -- Insert new active membership or update existing
    INSERT INTO fpo_memberships (farmer_id, fpo_id, joined_at, status)
    VALUES (NEW.farmer_id, NEW.fpo_id, CURRENT_TIMESTAMP, 'active')
    ON CONFLICT (farmer_id, fpo_id) WHERE status = 'active' 
    DO NOTHING;
    
  ELSIF (NEW.status IN ('rejected', 'cancelled')) AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    NEW.responded_at := CURRENT_TIMESTAMP;
  END IF;

  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_fpo_join_request_status ON fpo_join_requests;
CREATE TRIGGER trg_fpo_join_request_status
BEFORE UPDATE ON fpo_join_requests
FOR EACH ROW
EXECUTE FUNCTION fn_handle_fpo_join_request_update();
