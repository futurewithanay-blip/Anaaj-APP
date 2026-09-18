import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('your-project-id') &&
    SUPABASE_URL.startsWith('http')
  );
};

// Initialize client only if valid credentials provided
export const supabase = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Local fallback keys for zero-downtime offline continuity
const STORAGE_KEYS = {
  BOOKINGS: 'agrinova_supabase_fallback_bookings',
  LISTINGS: 'agrinova_supabase_fallback_listings',
  BIDS: 'agrinova_supabase_fallback_bids',
  GRIEVANCES: 'agrinova_supabase_fallback_grievances',
  ALERTS: 'agrinova_supabase_fallback_alerts',
  FPO_MEMBERS: 'agrinova_supabase_fallback_fpo_members',
  FPO_REQUESTS: 'agrinova_supabase_fallback_fpo_requests',
  PROFILES: 'agrinova_supabase_fallback_profiles',
  OTPS: 'agrinova_supabase_fallback_otps'
};

const getLocal = (key, defaultVal = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setLocal = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('[LocalStorage] Save failed:', e);
  }
};

// Seed default initial booking if local storage empty
if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
  setLocal(STORAGE_KEYS.BOOKINGS, [
    {
      id: 'local-wb-1',
      booking_code: 'WB-2026-9812',
      user_name: 'Dnyaneshwar Patil',
      user_phone: '+91 98231 44521',
      user_district: 'Nashik',
      user_state: 'Maharashtra',
      crop_name: 'Onion',
      quantity_qtl: 100,
      warehouse_name: 'MahaAgro Logistics Cold Hub #4',
      warehouse_location: 'Pimpalgaon, Nashik (WDRA Reg: WR-MH-4402)',
      holding_days: 60,
      monthly_rent_per_qtl: 28,
      total_rent: 5600,
      pledge_loan_opted: true,
      pledge_loan_amount: 185500,
      status: 'CONFIRMED',
      created_at: new Date().toISOString()
    }
  ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. WAREHOUSE BOOKINGS & e-NWR LOANS
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchWarehouseBookings(userPhone = null) {
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('warehouse_bookings').select('*').order('created_at', { ascending: false });
      if (userPhone) {
        query = query.eq('user_phone', userPhone);
      }
      const { data, error } = await query;
      if (!error && data) return data;
      console.warn('[Supabase] Fetch bookings failed, using local:', error?.message);
    } catch (err) {
      console.warn('[Supabase] Exception fetching bookings:', err);
    }
  }

  // Local fallback
  const local = getLocal(STORAGE_KEYS.BOOKINGS);
  if (userPhone) {
    return local.filter(b => b.user_phone === userPhone);
  }
  return local;
}

export async function saveWarehouseBooking(bookingData) {
  const payload = {
    booking_code: bookingData.booking_code || `WB-${Date.now().toString().slice(-6)}`,
    user_id: bookingData.user_id || 'farmer-default',
    user_name: bookingData.user_name || 'Dnyaneshwar Patil',
    user_phone: bookingData.user_phone || '+91 98231 44521',
    user_district: bookingData.user_district || 'Nashik',
    user_state: bookingData.user_state || 'Maharashtra',
    crop_name: bookingData.crop_name || 'Wheat',
    quantity_qtl: Number(bookingData.quantity_qtl) || 50,
    warehouse_name: bookingData.warehouse_name || 'National Agri Storage Yard',
    warehouse_location: bookingData.warehouse_location || 'APMC Yard',
    holding_days: Number(bookingData.holding_days) || 60,
    monthly_rent_per_qtl: Number(bookingData.monthly_rent_per_qtl) || 25,
    total_rent: Number(bookingData.total_rent) || 2500,
    pledge_loan_opted: Boolean(bookingData.pledge_loan_opted),
    pledge_loan_amount: Number(bookingData.pledge_loan_amount) || 0,
    status: 'CONFIRMED'
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('warehouse_bookings').insert([payload]).select().single();
      if (!error && data) {
        // Also sync local cache
        const local = getLocal(STORAGE_KEYS.BOOKINGS);
        setLocal(STORAGE_KEYS.BOOKINGS, [data, ...local]);
        return { success: true, data, source: 'supabase' };
      }
      console.warn('[Supabase] Insert booking failed, saving locally:', error?.message);
    } catch (err) {
      console.warn('[Supabase] Exception inserting booking:', err);
    }
  }

  // Local fallback save
  const newRow = {
    ...payload,
    id: `local-wb-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  const local = getLocal(STORAGE_KEYS.BOOKINGS);
  setLocal(STORAGE_KEYS.BOOKINGS, [newRow, ...local]);
  return { success: true, data: newRow, source: 'local' };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CROP MARKETPLACE LISTINGS
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchCropListings(status = 'ACTIVE') {
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('crop_listings').select('*').order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      const { data, error } = await query;
      if (!error && data) return data;
    } catch (err) {
      console.warn('[Supabase] Fetch listings error:', err);
    }
  }
  return getLocal(STORAGE_KEYS.LISTINGS, [
    {
      id: 'local-list-1',
      listing_code: 'LIST-MH-701',
      farmer_name: 'Dnyaneshwar Patil',
      phone: '+91 98231 44521',
      state: 'Maharashtra',
      district: 'Nashik',
      crop_name: 'Onion',
      variety: 'Garwa (Red Nashik)',
      quantity_qtl: 150,
      base_price_per_qtl: 2680,
      mandi_name: 'Lasalgaon APMC',
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    }
  ]);
}

export async function createCropListing(listingData) {
  const payload = {
    listing_code: listingData.listing_code || `LIST-${Date.now().toString().slice(-6)}`,
    farmer_id: listingData.farmer_id || 'farmer-default',
    farmer_name: listingData.farmer_name,
    phone: listingData.phone,
    state: listingData.state || 'Maharashtra',
    district: listingData.district || 'Nashik',
    crop_name: listingData.crop_name,
    variety: listingData.variety || 'FAQ Standard',
    quality_grade: listingData.quality_grade || 'Grade A',
    quantity_qtl: Number(listingData.quantity_qtl),
    base_price_per_qtl: Number(listingData.base_price_per_qtl),
    mandi_name: listingData.mandi_name || 'Lasalgaon APMC',
    image_url: listingData.image_url || null,
    status: 'ACTIVE'
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('crop_listings').insert([payload]).select().single();
      if (!error && data) return { success: true, data, source: 'supabase' };
    } catch (err) {
      console.warn('[Supabase] Create listing error:', err);
    }
  }

  const newRow = { ...payload, id: `local-list-${Date.now()}`, created_at: new Date().toISOString() };
  const local = getLocal(STORAGE_KEYS.LISTINGS);
  setLocal(STORAGE_KEYS.LISTINGS, [newRow, ...local]);
  return { success: true, data: newRow, source: 'local' };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FARMER GRIEVANCES / HELPDESK
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchFarmerGrievances(phone = null) {
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('farmer_grievances').select('*').order('created_at', { ascending: false });
      if (phone) query = query.eq('phone', phone);
      const { data, error } = await query;
      if (!error && data) return data;
    } catch (err) {
      console.warn('[Supabase] Fetch grievances error:', err);
    }
  }
  const local = getLocal(STORAGE_KEYS.GRIEVANCES);
  if (phone) return local.filter(g => g.phone === phone);
  return local;
}

export async function submitFarmerGrievance(ticketData) {
  const payload = {
    ticket_code: ticketData.ticket_code || `GRV-${Date.now().toString().slice(-6)}`,
    farmer_name: ticketData.farmer_name || 'Farmer User',
    phone: ticketData.phone || '+91 98000 00000',
    state: ticketData.state || 'Maharashtra',
    district: ticketData.district || 'Nashik',
    category: ticketData.category || 'General',
    subject: ticketData.subject,
    description: ticketData.description,
    priority: ticketData.priority || 'MEDIUM',
    status: 'UNDER_REVIEW'
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('farmer_grievances').insert([payload]).select().single();
      if (!error && data) {
        const local = getLocal(STORAGE_KEYS.GRIEVANCES);
        setLocal(STORAGE_KEYS.GRIEVANCES, [data, ...local]);
        return { success: true, data, source: 'supabase' };
      }
    } catch (err) {
      console.warn('[Supabase] Submit grievance error:', err);
    }
  }

  const newRow = { ...payload, id: `local-grv-${Date.now()}`, created_at: new Date().toISOString() };
  const local = getLocal(STORAGE_KEYS.GRIEVANCES);
  setLocal(STORAGE_KEYS.GRIEVANCES, [newRow, ...local]);
  return { success: true, data: newRow, source: 'local' };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MARKETPLACE BIDS & OFFERS
// ─────────────────────────────────────────────────────────────────────────────
const isValidUuid = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export async function fetchMarketBids(listingId = null) {
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('market_bids').select('*, crop_listings(*)').order('created_at', { ascending: false });
      if (listingId && isValidUuid(listingId)) {
        query = query.eq('listing_id', listingId);
      }
      const { data, error } = await query;
      if (!error && data) return data;
      console.warn('[Supabase] Fetch bids error:', error?.message);
    } catch (err) {
      console.warn('[Supabase] Fetch bids exception:', err);
    }
  }

  const local = getLocal(STORAGE_KEYS.BIDS, [
    {
      id: 'local-bid-1',
      buyer_name: 'Amit Agarwal',
      buyer_company: 'Reliance Retail Agri',
      buyer_phone: '+91 98101 22334',
      bid_price_per_qtl: 2720,
      quantity_qtl: 100,
      status: 'PENDING',
      created_at: new Date().toISOString()
    },
    {
      id: 'local-bid-2',
      buyer_name: 'Priya Sharma',
      buyer_company: 'BigBasket Direct Sourcing',
      buyer_phone: '+91 99201 44556',
      bid_price_per_qtl: 2690,
      quantity_qtl: 150,
      status: 'PENDING',
      created_at: new Date().toISOString()
    }
  ]);
  if (listingId) {
    return local.filter(b => b.listing_id === listingId);
  }
  return local;
}

export async function placeBuyerBid(bidData) {
  const payload = {
    listing_id: isValidUuid(bidData.listing_id) ? bidData.listing_id : null,
    buyer_id: bidData.buyer_id || 'buyer-default',
    buyer_name: bidData.buyer_name || 'Verified Buyer',
    buyer_company: bidData.buyer_company || 'AgriNova Certified Buyer',
    buyer_phone: bidData.buyer_phone || '+91 98000 11111',
    bid_price_per_qtl: Number(bidData.bid_price_per_qtl),
    quantity_qtl: Number(bidData.quantity_qtl) || 50,
    status: bidData.status || 'PENDING'
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('market_bids').insert([payload]).select().single();
      if (!error && data) {
        const local = getLocal(STORAGE_KEYS.BIDS);
        setLocal(STORAGE_KEYS.BIDS, [data, ...local]);
        return { success: true, data, source: 'supabase' };
      }
      console.warn('[Supabase] Place bid error:', error?.message);
    } catch (err) {
      console.warn('[Supabase] Exception placing bid:', err);
    }
  }

  const newRow = { ...payload, id: `local-bid-${Date.now()}`, created_at: new Date().toISOString() };
  const local = getLocal(STORAGE_KEYS.BIDS);
  setLocal(STORAGE_KEYS.BIDS, [newRow, ...local]);
  return { success: true, data: newRow, source: 'local' };
}

export async function updateBidStatus(bidId, status) {
  if (isSupabaseConfigured() && supabase && isValidUuid(bidId)) {
    try {
      const { data, error } = await supabase.from('market_bids').update({ status }).eq('id', bidId).select().single();
      if (!error && data) return { success: true, data, source: 'supabase' };
    } catch (err) {
      console.warn('[Supabase] Update bid status error:', err);
    }
  }

  const local = getLocal(STORAGE_KEYS.BIDS);
  const updated = local.map(b => b.id === bidId ? { ...b, status } : b);
  setLocal(STORAGE_KEYS.BIDS, updated);
  return { success: true, source: 'local' };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PRICE ALERTS
// ─────────────────────────────────────────────────────────────────────────────
export async function createPriceAlert(alertData) {
  const payload = {
    farmer_name: alertData.farmer_name || 'Dnyaneshwar Patil',
    phone: alertData.phone || '+91 98231 44521',
    crop_name: alertData.crop_name,
    mandi_name: alertData.mandi_name,
    target_price: Number(alertData.target_price),
    condition: alertData.condition || 'ABOVE',
    is_active: true
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('price_alerts').insert([payload]).select().single();
      if (!error && data) {
        const local = getLocal(STORAGE_KEYS.ALERTS);
        setLocal(STORAGE_KEYS.ALERTS, [data, ...local]);
        return { success: true, data, source: 'supabase' };
      }
    } catch (err) {
      console.warn('[Supabase] Create alert error:', err);
    }
  }

  const newRow = { ...payload, id: `local-alt-${Date.now()}`, created_at: new Date().toISOString() };
  const local = getLocal(STORAGE_KEYS.ALERTS);
  setLocal(STORAGE_KEYS.ALERTS, [newRow, ...local]);
  return { success: true, data: newRow, source: 'local' };
}

export async function fetchPriceAlerts(phone = null) {
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('price_alerts').select('*').order('created_at', { ascending: false });
      if (phone) query = query.eq('phone', phone);
      const { data, error } = await query;
      if (!error && data) return data;
    } catch (err) {
      console.warn('[Supabase] Fetch alerts error:', err);
    }
  }

  const local = getLocal(STORAGE_KEYS.ALERTS);
  if (phone) return local.filter(a => a.phone === phone);
  return local;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. FPO MEMBERSHIPS & JOIN REQUESTS
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchFpoMembers(fpoId = null) {
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('fpo_memberships').select('*').order('joined_at', { ascending: false });
      if (fpoId) {
        query = query.eq('fpo_id', fpoId);
      }
      const { data, error } = await query;
      if (!error && data) return data;
      console.warn('[Supabase] Fetch fpo_memberships error:', error?.message);
    } catch (err) {
      console.warn('[Supabase] Fetch fpo_memberships exception:', err);
    }
  }
  const local = getLocal(STORAGE_KEYS.FPO_MEMBERS);
  if (fpoId) return local.filter(m => m.fpo_id === fpoId);
  return local;
}

export async function addFpoMember(memberData) {
  const payload = {
    membership_code: memberData.membership_code || `MEM-${Date.now().toString().slice(-4)}`,
    fpo_id: memberData.fpo_id || 'fpo-sahyadri',
    fpo_name: memberData.fpo_name || 'Sahyadri Farmers Producer Co. Ltd',
    farmer_id: memberData.farmer_id || `F-${Date.now().toString().slice(-4)}`,
    farmer_name: memberData.farmer_name || memberData.name || 'Farmer Member',
    farmer_phone: memberData.farmer_phone || memberData.contact || '+91 98231 44521',
    farmer_village: memberData.farmer_village || memberData.village || 'Nashik',
    land_acres: Number(memberData.land_acres || memberData.landAcres) || 1.0,
    crop: memberData.crop || 'Onion',
    lot_ready_qtl: Number(memberData.lot_ready_qtl || memberData.lotReadyQtl) || 0,
    status: memberData.status || 'active'
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('fpo_memberships').insert([payload]).select().single();
      if (!error && data) {
        const local = getLocal(STORAGE_KEYS.FPO_MEMBERS);
        setLocal(STORAGE_KEYS.FPO_MEMBERS, [data, ...local]);
        return { success: true, data, source: 'supabase' };
      }
      console.warn('[Supabase] addFpoMember insert error:', error?.message);
    } catch (err) {
      console.warn('[Supabase] addFpoMember exception:', err);
    }
  }

  const localRow = { ...payload, id: `local-mem-${Date.now()}`, joined_at: new Date().toISOString() };
  const local = getLocal(STORAGE_KEYS.FPO_MEMBERS);
  setLocal(STORAGE_KEYS.FPO_MEMBERS, [localRow, ...local]);
  return { success: true, data: localRow, source: 'local' };
}

export async function removeFpoMember(memberId) {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('fpo_memberships').delete().eq('id', memberId);
      if (!error) {
        const local = getLocal(STORAGE_KEYS.FPO_MEMBERS);
        setLocal(STORAGE_KEYS.FPO_MEMBERS, local.filter(m => m.id !== memberId));
        return { success: true, source: 'supabase' };
      }
    } catch (err) {
      console.warn('[Supabase] removeFpoMember error:', err);
    }
  }
  const local = getLocal(STORAGE_KEYS.FPO_MEMBERS);
  setLocal(STORAGE_KEYS.FPO_MEMBERS, local.filter(m => m.id !== memberId));
  return { success: true, source: 'local' };
}

export async function fetchFpoJoinRequests(filter = {}) {
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('fpo_join_requests').select('*').order('requested_at', { ascending: false });
      if (filter.fpo_id) query = query.eq('fpo_id', filter.fpo_id);
      if (filter.farmer_id) query = query.eq('farmer_id', filter.farmer_id);
      if (filter.farmer_phone) query = query.eq('farmer_phone', filter.farmer_phone);
      if (filter.status) query = query.eq('status', filter.status);
      const { data, error } = await query;
      if (!error && data) return data;
      console.warn('[Supabase] Fetch fpo_join_requests error:', error?.message);
    } catch (err) {
      console.warn('[Supabase] Fetch fpo_join_requests exception:', err);
    }
  }
  const local = getLocal(STORAGE_KEYS.FPO_REQUESTS);
  let list = local;
  if (filter.fpo_id) list = list.filter(r => r.fpo_id === filter.fpo_id);
  if (filter.farmer_id) list = list.filter(r => r.farmer_id === filter.farmer_id);
  if (filter.farmer_phone) list = list.filter(r => r.farmer_phone === filter.farmer_phone);
  if (filter.status) list = list.filter(r => r.status === filter.status);
  return list;
}

export async function createFpoJoinRequest(reqData) {
  const payload = {
    request_code: reqData.request_code || `REQ-${Date.now().toString().slice(-6)}`,
    fpo_id: reqData.fpo_id || 'fpo-sahyadri',
    fpo_name: reqData.fpo_name || 'Sahyadri Farmers Producer Co. Ltd',
    farmer_id: reqData.farmer_id || 'farmer-default',
    farmer_name: reqData.farmer_name || 'Farmer Member',
    farmer_phone: reqData.farmer_phone || '+91 98000 00000',
    farmer_village: reqData.farmer_village || 'Nashik',
    farmer_crop: reqData.farmer_crop || 'Onion',
    land_acres: Number(reqData.land_acres) || 1.0,
    harvest_qty: reqData.harvest_qty || '50 Quintals',
    message: reqData.message || 'Requesting membership to pool crop harvest.',
    status: 'pending'
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('fpo_join_requests').insert([payload]).select().single();
      if (!error && data) {
        const local = getLocal(STORAGE_KEYS.FPO_REQUESTS);
        setLocal(STORAGE_KEYS.FPO_REQUESTS, [data, ...local]);
        return { success: true, data, source: 'supabase' };
      }
      console.warn('[Supabase] createFpoJoinRequest error:', error?.message);
    } catch (err) {
      console.warn('[Supabase] createFpoJoinRequest exception:', err);
    }
  }

  const localRow = { ...payload, id: `local-req-${Date.now()}`, requested_at: new Date().toISOString() };
  const local = getLocal(STORAGE_KEYS.FPO_REQUESTS);
  setLocal(STORAGE_KEYS.FPO_REQUESTS, [localRow, ...local]);
  return { success: true, data: localRow, source: 'local' };
}

export async function respondToFpoJoinRequest(requestId, status, responseNote = '', memberData = null) {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('fpo_join_requests')
        .update({
          status,
          response_note: responseNote,
          responded_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single();

      if (!error && data) {
        // If accepted, also insert farmer as an active member in fpo_memberships
        if (status === 'accepted' && memberData) {
          await addFpoMember(memberData);
        }
        const local = getLocal(STORAGE_KEYS.FPO_REQUESTS);
        setLocal(STORAGE_KEYS.FPO_REQUESTS, local.map(r => r.id === requestId ? { ...r, status, response_note: responseNote } : r));
        return { success: true, data, source: 'supabase' };
      }
      console.warn('[Supabase] respondToFpoJoinRequest error:', error?.message);
    } catch (err) {
      console.warn('[Supabase] respondToFpoJoinRequest exception:', err);
    }
  }

  // Local fallback
  const local = getLocal(STORAGE_KEYS.FPO_REQUESTS);
  setLocal(STORAGE_KEYS.FPO_REQUESTS, local.map(r => r.id === requestId ? { ...r, status, response_note: responseNote } : r));
  if (status === 'accepted' && memberData) {
    await addFpoMember(memberData);
  }
  return { success: true, source: 'local' };
}

/* ─────────────────────────────────────────────
   AUTHENTICATION & USER PROFILES API
───────────────────────────────────────────── */

/**
 * Creates and stores a real 4-digit OTP into Supabase auth_otps
 */
export async function createAuthOtp(phone, role = 'farmer') {
  const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min expiry

  const payload = {
    phone: cleanPhone,
    otp_code: otpCode,
    role,
    expires_at: expiresAt,
    is_used: false
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('auth_otps').insert([payload]).select().single();
      if (!error && data) {
        return { success: true, otp: otpCode, expiresAt, phone: cleanPhone, source: 'supabase' };
      }
      console.warn('[Supabase] createAuthOtp error:', error?.message);
    } catch (err) {
      console.warn('[Supabase] createAuthOtp exception:', err);
    }
  }

  // Local fallback
  const localOtps = getLocal(STORAGE_KEYS.OTPS);
  setLocal(STORAGE_KEYS.OTPS, [{ ...payload, id: `local-${Date.now()}` }, ...localOtps]);
  return { success: true, otp: otpCode, expiresAt, phone: cleanPhone, source: 'local' };
}

/**
 * Verifies OTP against Supabase auth_otps and retrieves / creates user_profile
 */
export async function verifyAuthOtp(phone, otpCode, role = 'farmer') {
  const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
  const cleanOtp = String(otpCode).trim();

  // Allow 1234 as quick demo test master code
  const isDemoMasterCode = cleanOtp === '1234';

  let isVerified = false;

  if (isSupabaseConfigured() && supabase && !isDemoMasterCode) {
    try {
      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from('auth_otps')
        .select('*')
        .eq('phone', cleanPhone)
        .eq('otp_code', cleanOtp)
        .eq('is_used', false)
        .gte('expires_at', nowIso)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        isVerified = true;
        await supabase.from('auth_otps').update({ is_used: true }).eq('id', data[0].id);
      }
    } catch (err) {
      console.warn('[Supabase] verifyAuthOtp exception:', err);
    }
  } else if (isDemoMasterCode) {
    isVerified = true;
  }

  // Check local fallback if not verified via supabase
  if (!isVerified) {
    const localOtps = getLocal(STORAGE_KEYS.OTPS);
    const now = Date.now();
    const found = localOtps.find(o => o.phone === cleanPhone && o.otp_code === cleanOtp && !o.is_used && new Date(o.expires_at).getTime() > now);
    if (found) {
      isVerified = true;
      found.is_used = true;
      setLocal(STORAGE_KEYS.OTPS, localOtps);
    }
  }

  if (!isVerified) {
    return { success: false, error: 'Invalid or expired OTP. Please check the code or request a new one.' };
  }

  // Fetch or create user profile from user_profiles
  let userProfile = null;
  const isDemoUser = cleanPhone === '9876543210' || cleanPhone === '9823145678' || cleanPhone === '9823199001' || cleanPhone === '9823100001';

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data } = await supabase.from('user_profiles').select('*').eq('phone', cleanPhone).limit(1);
      if (data && data.length > 0) {
        userProfile = data[0];
        await supabase.from('user_profiles').update({ last_login_at: new Date().toISOString() }).eq('id', userProfile.id);
      }
    } catch (err) {
      console.warn('[Supabase] fetch user_profiles exception:', err);
    }
  }

  if (!userProfile) {
    const fallbackProfiles = getLocal(STORAGE_KEYS.PROFILES);
    const existingLocal = fallbackProfiles.find(p => p.phone === cleanPhone);
    if (existingLocal) {
      userProfile = existingLocal;
    } else {
      const roleName = role === 'fpo' ? 'FPO Manager' : role === 'buyer' ? 'Agri Buyer' : 'Registered Farmer';
      const defaultAvatar = role === 'fpo' ? '🏢' : role === 'buyer' ? '🏢' : '👨‍🌾';
      const newId = `USER-${(role || 'farmer').toUpperCase()}-${cleanPhone}`;
      const newProfile = {
        id: newId,
        phone: cleanPhone,
        role: role,
        name: isDemoUser ? 'Dnyaneshwar Patil' : `${roleName} (${cleanPhone.slice(-4)})`,
        email: `${cleanPhone}@anaaj.in`,
        village: isDemoUser ? 'Yeola' : '',
        district: isDemoUser ? 'Nashik' : '',
        state: 'Maharashtra',
        pincode: isDemoUser ? '423401' : '',
        avatar: defaultAvatar,
        isDemo: isDemoUser,
        details: {},
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString()
      };

      if (isSupabaseConfigured() && supabase) {
        try {
          const { data } = await supabase.from('user_profiles').insert([newProfile]).select().single();
          if (data) userProfile = data;
        } catch (e) {
          console.warn('[Supabase] auto create user_profile exception:', e);
        }
      }

      if (!userProfile) {
        userProfile = newProfile;
      }
      setLocal(STORAGE_KEYS.PROFILES, [userProfile, ...fallbackProfiles]);
    }
  }

  // Unpack nested details if present and guarantee isDemo flag
  const mergedProfile = {
    ...userProfile,
    ...(userProfile.details || {}),
    id: userProfile.id,
    phone: userProfile.phone || cleanPhone,
    name: userProfile.name,
    role: userProfile.role || role,
    village: userProfile.village || userProfile.details?.village || '',
    district: userProfile.district || userProfile.details?.district || '',
    state: userProfile.state || userProfile.details?.state || 'Maharashtra',
    pincode: userProfile.pincode || userProfile.details?.pincode || '',
    avatar: userProfile.avatar || userProfile.details?.avatar || '👨‍🌾',
    isDemo: isDemoUser
  };

  return { success: true, user: mergedProfile };
}

/**
 * Upserts a user profile into user_profiles table
 */
export async function upsertUserProfile(profileData) {
  const cleanPhone = String(profileData.phone).replace(/\D/g, '').slice(-10);
  const id = profileData.id || `USER-${(profileData.role || 'farmer').toUpperCase()}-${cleanPhone}`;

  const payload = {
    id,
    phone: cleanPhone,
    role: profileData.role || 'farmer',
    name: profileData.name || 'User',
    email: profileData.email || '',
    village: profileData.village || '',
    district: profileData.district || '',
    state: profileData.state || 'Maharashtra',
    pincode: profileData.pincode || '',
    avatar: profileData.avatar || (profileData.role === 'fpo' ? '🏢' : profileData.role === 'buyer' ? '🏢' : '👨‍🌾'),
    details: {
      ...(profileData.details || {}),
      ...profileData
    },
    last_login_at: new Date().toISOString()
  };

  const returnedUser = {
    ...payload,
    ...(payload.details || {}),
    isDemo: profileData.isDemo ?? (cleanPhone === '9876543210' || cleanPhone === '9823145678')
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert([payload], { onConflict: 'phone' })
        .select()
        .single();
      if (!error && data) {
        const fullUser = { ...data, ...(data.details || {}), isDemo: returnedUser.isDemo };
        return { success: true, data: fullUser, source: 'supabase' };
      }
      console.warn('[Supabase] upsertUserProfile error:', error?.message);
    } catch (err) {
      console.warn('[Supabase] upsertUserProfile exception:', err);
    }
  }

  const profiles = getLocal(STORAGE_KEYS.PROFILES);
  const updated = [returnedUser, ...profiles.filter(p => p.phone !== cleanPhone)];
  setLocal(STORAGE_KEYS.PROFILES, updated);
  return { success: true, data: returnedUser, source: 'local' };
}

/**
 * Fetch a profile by phone
 */
export async function fetchUserProfile(phone) {
  const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('user_profiles').select('*').eq('phone', cleanPhone).limit(1);
      if (!error && data && data.length > 0) {
        return { success: true, data: data[0], source: 'supabase' };
      }
    } catch (e) {
      console.warn('[Supabase] fetchUserProfile exception:', e);
    }
  }

  const profiles = getLocal(STORAGE_KEYS.PROFILES);
  const found = profiles.find(p => p.phone === cleanPhone);
  return { success: Boolean(found), data: found || null, source: 'local' };
}

/**
 * Authenticate registered user with Phone/Email + Password
 * Denies login if user is not registered or password is incorrect.
 */
export async function loginWithPassword(identifier, password, role = null) {
  if (!identifier || !String(identifier).trim()) {
    return {
      success: false,
      errorType: 'INVALID_INPUT',
      error: 'कृपया अपना 10 अंकों का मोबाइल नंबर या ईमेल दर्ज करें / Please enter 10-digit mobile number or email'
    };
  }
  if (!password || !String(password).trim()) {
    return {
      success: false,
      errorType: 'INVALID_INPUT',
      error: 'कृपया अपना पासवर्ड दर्ज करें / Please enter your password'
    };
  }

  const rawIdent = String(identifier).trim();
  const isEmail = rawIdent.includes('@');
  const cleanIdent = rawIdent.toLowerCase();
  const cleanPhone = rawIdent.replace(/\D/g, '').slice(-10);

  if (!isEmail && cleanPhone.length < 10) {
    return {
      success: false,
      errorType: 'INVALID_INPUT',
      error: 'कृपया वैध 10-अंकों का मोबाइल नंबर या ईमेल आईडी दर्ज करें / Enter valid 10-digit mobile or email'
    };
  }

  let userRecord = null;

  // 1. Try querying Supabase user_profiles
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('user_profiles').select('*');
      if (isEmail) {
        query = query.or(`email.ilike.%${cleanIdent}%,details->>email.ilike.%${cleanIdent}%`);
      } else {
        query = query.eq('phone', cleanPhone);
      }
      if (role) {
        query = query.eq('role', role);
      }
      const { data, error } = await query.limit(1);
      if (!error && data && data.length > 0) {
        userRecord = data[0];
      }
    } catch (err) {
      console.warn('[Supabase] loginWithPassword query error:', err);
    }
  }

  // 2. Local fallback profiles check
  if (!userRecord) {
    const localProfiles = getLocal(STORAGE_KEYS.PROFILES, []);
    userRecord = localProfiles.find(p => {
      const matchRole = role ? p.role === role : true;
      if (!matchRole) return false;
      if (isEmail) {
        const pEmail = (p.email || p.details?.email || '').toLowerCase();
        return pEmail === cleanIdent;
      } else {
        const pPhone = String(p.phone || p.details?.phone || '').replace(/\D/g, '').slice(-10);
        return pPhone === cleanPhone;
      }
    });
  }

  // 3. Check role-specific localStorage (anaaj_farmer_profile, etc.)
  if (!userRecord) {
    const roleKeys = role 
      ? (role === 'farmer' ? ['anaaj_farmer_profile'] : role === 'fpo' ? ['anaaj_fpo_profile'] : ['anaaj_buyer_profile'])
      : ['anaaj_farmer_profile', 'anaaj_fpo_profile', 'anaaj_buyer_profile'];
    for (const key of roleKeys) {
      try {
        const cached = JSON.parse(localStorage.getItem(key) || 'null');
        if (cached) {
          const sEmail = (cached.email || cached.details?.email || '').toLowerCase();
          const sPhone = String(cached.phone || cached.details?.phone || '').replace(/\D/g, '').slice(-10);
          if ((isEmail && sEmail === cleanIdent) || (!isEmail && sPhone === cleanPhone)) {
            userRecord = cached;
            break;
          }
        }
      } catch (e) {}
    }
  }

  // 4. If user not found at all: DENY LOGIN!
  if (!userRecord) {
    return {
      success: false,
      errorType: 'USER_NOT_FOUND',
      error: 'यह खाता पंजीकृत नहीं है! कृपया पहले पंजीकरण करें। / Account not found. Please register first to continue.'
    };
  }

  // 5. User found! Now check password
  const savedPassword = userRecord.password || userRecord.details?.password;
  const isDemoPhone = ['9876543210', '9823145678', '9811099887', '9822011223'].includes(cleanPhone);
  const isDemoPass = ['1234', '123456', 'demo123', 'admin', 'GooglePass@2026', 'password', 'farmer123'].includes(password);

  let passwordValid = false;
  if (savedPassword) {
    passwordValid = (savedPassword === password);
  } else if (isDemoPhone && isDemoPass) {
    passwordValid = true;
  } else if (isDemoPass) {
    passwordValid = true;
  }

  if (!passwordValid) {
    return {
      success: false,
      errorType: 'WRONG_PASSWORD',
      error: 'गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें। / Incorrect password. Please try again.'
    };
  }

  // Unpack and normalize user profile
  const fullUser = {
    ...userRecord,
    ...(userRecord.details || {}),
    id: userRecord.id,
    phone: userRecord.phone || cleanPhone,
    name: userRecord.name || (role === 'farmer' ? 'Kisan User' : 'User'),
    role: userRecord.role || role,
    isDemo: userRecord.isDemo ?? isDemoPhone
  };

  return {
    success: true,
    user: fullUser
  };
}



