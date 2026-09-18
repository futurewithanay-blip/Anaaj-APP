/**
 * anaaj FPO Membership & Join Request Service
 * Connects to PostgreSQL tables `fpo_join_requests` and `fpo_memberships` in Supabase.
 * Provides persistent, reactive cross-role request and membership lifecycle.
 */
import {
  fetchFpoMembers,
  addFpoMember,
  removeFpoMember,
  fetchFpoJoinRequests,
  createFpoJoinRequest,
  respondToFpoJoinRequest,
  isSupabaseConfigured
} from './supabaseClient';

const STORAGE_KEY_REQUESTS = 'anaaj_db_fpo_join_requests';
const STORAGE_KEY_MEMBERSHIPS = 'anaaj_db_fpo_memberships';
const EVENT_REQUESTS_UPDATED = 'anaaj_fpo_requests_updated';
const EVENT_MEMBERSHIPS_UPDATED = 'anaaj_fpo_memberships_updated';

// Initial seed FPO directory for farmers to browse, search, and connect with
export const SEED_FPOS = [
  {
    id: 'fpo-niphad-agro',
    name: 'Niphad Taluka Agro Producer Co. Ltd',
    district: 'Nashik',
    state: 'Maharashtra',
    village: 'Pimpalas, Niphad',
    distanceKm: 5,
    membersCount: 410,
    primaryCrops: ['Onion', 'Wheat', 'Gram', 'Tomato'],
    annualTurnover: '₹18 Cr',
    verified: true,
    rating: 4.9,
    facilities: ['Scientific Onion Storage (2,500 MT)', 'Electronic Weighbridge', 'Spot Payment Counter', 'Seed Subsidy Counter'],
    contactPhone: '+91 2554 224150',
    description: "Hyperlocal Niphad cluster collective. Offers transparent electronic farmgate weighment, zero transport loss, and direct bulk pooling for Lasalgaon APMC & processors."
  },
  {
    id: 'fpo-ozar-krishi',
    name: 'Ozar Krishi Logistics & Producer Co.',
    district: 'Nashik',
    state: 'Maharashtra',
    village: 'Ozar, Nashik',
    distanceKm: 9,
    membersCount: 320,
    primaryCrops: ['Tomato', 'Grapes', 'Vegetables', 'Onion'],
    annualTurnover: '₹26 Cr',
    verified: true,
    rating: 4.8,
    facilities: ['Air Cargo Packhouse Linkage', 'Pre-cooling Facility', 'Residue Testing Lab', 'Reefer Truck Dispatch'],
    contactPhone: '+91 253 278100',
    description: "Situated right beside Ozar Airport cargo terminal. Specializes in daily vegetable & tomato aggregation with direct supply routes to Mumbai and tier-1 metro retail chains."
  },
  {
    id: 'fpo-sahyadri',
    name: 'Sahyadri Farmers Producer Co. Ltd',
    district: 'Nashik',
    state: 'Maharashtra',
    village: 'Mohadi, Dindori',
    distanceKm: 14,
    membersCount: 520,
    primaryCrops: ['Onion', 'Tomato', 'Grapes', 'Wheat'],
    annualTurnover: '₹48 Cr',
    verified: true,
    rating: 4.9,
    facilities: ['Cold Storage (10k MT)', 'Grading Line', 'Export Packhouse', 'DBT Direct Settlement'],
    contactPhone: '+91 253 299100',
    description: "India's premier farmer-owned collective. Provides automated grading lines, WDRA cold stores, export linkage, and +₹120/Q bulk bonus."
  },
  {
    id: 'fpo-dindori-cluster',
    name: 'Dindori Valley Green Cluster FPO',
    district: 'Nashik',
    state: 'Maharashtra',
    village: 'Vani Road, Dindori',
    distanceKm: 18,
    membersCount: 280,
    primaryCrops: ['Soybean', 'Maize', 'Tomato', 'Pulses'],
    annualTurnover: '₹14 Cr',
    verified: true,
    rating: 4.7,
    facilities: ['Custom Hiring Tractor Pool', 'Solar Grain Dryer', 'Bio-Fertilizer Unit', 'Soil Testing Lab'],
    contactPhone: '+91 2557 241050',
    description: "Farmer collective dedicated to reducing cultivation input costs through shared modern farm machinery and guaranteed wholesale buyback contracts."
  },
  {
    id: 'fpo-pimpalgaon-horti',
    name: 'Pimpalgaon Horticulture & Onion Producer Co.',
    district: 'Nashik',
    state: 'Maharashtra',
    village: 'Pimpalgaon Baswant',
    distanceKm: 28,
    membersCount: 310,
    primaryCrops: ['Onion', 'Tomato', 'Capsicum'],
    annualTurnover: '₹18 Cr',
    verified: true,
    rating: 4.7,
    facilities: ['Chawl Storage Subsidies', 'Solar Dehydration Unit'],
    contactPhone: '+91 2550 250020',
    description: "Specialized in summer red onion storage chawls and collective supply to Mumbai & southern metro consumption centers."
  },
  {
    id: 'fpo-latur-soy',
    name: 'Marathwada Soybean & Pulses Producer Co.',
    district: 'Latur',
    state: 'Maharashtra',
    village: 'Murud, Latur',
    distanceKm: 185,
    membersCount: 380,
    primaryCrops: ['Soybean', 'Tur / Arhar', 'Chana'],
    annualTurnover: '₹22 Cr',
    verified: true,
    rating: 4.8,
    facilities: ['Oilseed Crushing Feed Hub', 'Moisture Testing Lab', 'Custom Hiring Centre'],
    contactPhone: '+91 2382 259000',
    description: "Specialized in oilseed aggregation and direct supply to edible oil refiners. Bulk contracts with +₹140/Q premium over local APMC."
  },
  {
    id: 'fpo-malwa-wheat',
    name: 'Malwa Golden Grain Producer Company',
    district: 'Indore',
    state: 'Madhya Pradesh',
    village: 'Sanwer, Indore',
    distanceKm: 310,
    membersCount: 440,
    primaryCrops: ['Wheat (Sharbati)', 'Garlic', 'Gram'],
    annualTurnover: '₹31 Cr',
    verified: true,
    rating: 4.9,
    facilities: ['Grain Cleaning & Sorting', 'Steel Silos Storage', 'e-NAM Trading Desk'],
    contactPhone: '+91 731 2412800',
    description: "Premium MP Sharbati & Lokwan wheat cluster connecting members directly to industrial flour mills and retail FMCG brands."
  },
  {
    id: 'fpo-vidarbha-cotton',
    name: 'Vidarbha White Gold Cotton Producers Union',
    district: 'Yavatmal',
    state: 'Maharashtra',
    village: 'Kalamb, Yavatmal',
    distanceKm: 420,
    membersCount: 650,
    primaryCrops: ['Cotton', 'Soybean', 'Tur Dal'],
    annualTurnover: '₹36 Cr',
    verified: true,
    rating: 4.8,
    facilities: ['Ginning Quality Assayer', 'Direct CCI Procurement Desk'],
    contactPhone: '+91 7232 242345',
    description: "Federation of 18 village clusters bargaining directly with textile spinning mills and CCI for maximum staple price realization."
  }
];

// Seed initial join requests
const INITIAL_REQUESTS = [
  {
    id: 'REQ-JOIN-001',
    farmer_id: 'farmer-dnyaneshwar',
    farmer_name: 'Dnyaneshwar Patil',
    farmer_village: 'Niphad, Nashik',
    farmer_phone: '+91 98231 44521',
    farmer_crop: 'Onion & Wheat',
    land_acres: 3.5,
    harvest_qty: '85 Quintals',
    fpo_id: 'fpo-sahyadri',
    fpo_name: 'Sahyadri Farmers Producer Co. Ltd',
    message: 'I have 85 Qtl export-grade Red Onion ready for pooling and wish to join the collective export consignment.',
    status: 'pending', // 'pending' | 'accepted' | 'rejected' | 'cancelled'
    requested_at: '2026-09-08T10:30:00.000Z',
    responded_at: null,
    response_note: null
  },
  {
    id: 'REQ-JOIN-002',
    farmer_id: 'farmer-vitthal',
    farmer_name: 'Vitthalrao Deshmukh',
    farmer_village: 'Pimpalgaon, Nashik',
    farmer_phone: '+91 94220 88123',
    farmer_crop: 'Tomato & Onion',
    land_acres: 4.2,
    harvest_qty: '120 Crates',
    fpo_id: 'fpo-sahyadri',
    fpo_name: 'Sahyadri Farmers Producer Co. Ltd',
    message: 'Looking forward to utilizing collective cold storage in Dindori hub for my tomato lots.',
    status: 'pending',
    requested_at: '2026-09-07T14:15:00.000Z',
    responded_at: null,
    response_note: null
  },
  {
    id: 'REQ-JOIN-003',
    farmer_id: 'farmer-ramdas',
    farmer_name: 'Ramdas Kadam',
    farmer_village: 'Chandwad, Nashik',
    farmer_phone: '+91 98555 12390',
    farmer_crop: 'Soybean',
    land_acres: 5.0,
    harvest_qty: '40 Quintals',
    fpo_id: 'fpo-sahyadri',
    fpo_name: 'Sahyadri Farmers Producer Co. Ltd',
    message: 'Submitted 7/12 land extract and Aadhaar for membership registration.',
    status: 'accepted',
    requested_at: '2026-09-01T09:00:00.000Z',
    responded_at: '2026-09-02T11:00:00.000Z',
    response_note: 'Verified landholding. Welcome to Sahyadri FPO cluster!'
  }
];

// Seed active memberships
const INITIAL_MEMBERSHIPS = [
  {
    id: 'MEM-001',
    farmer_id: 'F-101',
    farmer_name: 'Dnyaneshwar Patil',
    village: 'Niphad, Nashik',
    land_acres: 3.5,
    crop: 'Onion',
    lot_ready_qtl: 28,
    fpo_id: 'fpo-sahyadri',
    joined_at: '2026-01-15T10:00:00.000Z',
    left_at: null,
    status: 'active'
  },
  {
    id: 'MEM-002',
    farmer_id: 'F-102',
    farmer_name: 'Sanjay Shinde',
    village: 'Pimpalgaon, Nashik',
    land_acres: 4.2,
    crop: 'Onion',
    lot_ready_qtl: 35,
    fpo_id: 'fpo-sahyadri',
    joined_at: '2026-02-10T10:00:00.000Z',
    left_at: null,
    status: 'active'
  },
  {
    id: 'MEM-003',
    farmer_id: 'F-103',
    farmer_name: 'Rameshwar Jadhav',
    village: 'Chandwad, Nashik',
    land_acres: 5.0,
    crop: 'Onion',
    lot_ready_qtl: 42,
    fpo_id: 'fpo-sahyadri',
    joined_at: '2026-03-05T10:00:00.000Z',
    left_at: null,
    status: 'active'
  },
  {
    id: 'MEM-004',
    farmer_id: 'F-104',
    farmer_name: 'Balu Gaikwad',
    village: 'Sinnar, Nashik',
    land_acres: 2.8,
    crop: 'Onion',
    lot_ready_qtl: 20,
    fpo_id: 'fpo-sahyadri',
    joined_at: '2026-04-12T10:00:00.000Z',
    left_at: null,
    status: 'active'
  },
  {
    id: 'MEM-005',
    farmer_id: 'F-105',
    farmer_name: 'Kishor Deshmukh',
    village: 'Yeola, Nashik',
    land_acres: 6.0,
    crop: 'Soybean',
    lot_ready_qtl: 60,
    fpo_id: 'fpo-sahyadri',
    joined_at: '2026-05-20T10:00:00.000Z',
    left_at: null,
    status: 'active'
  }
];

class FpoMembershipService {
  constructor() {
    this._initStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY_REQUESTS) {
          this._dispatch(EVENT_REQUESTS_UPDATED);
        } else if (e.key === STORAGE_KEY_MEMBERSHIPS) {
          this._dispatch(EVENT_MEMBERSHIPS_UPDATED);
        }
      });
    }
  }

  _initStorage() {
    if (typeof window === 'undefined') return;
    try {
      if (!localStorage.getItem(STORAGE_KEY_REQUESTS)) {
        localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(INITIAL_REQUESTS));
      }
      if (!localStorage.getItem(STORAGE_KEY_MEMBERSHIPS)) {
        localStorage.setItem(STORAGE_KEY_MEMBERSHIPS, JSON.stringify(INITIAL_MEMBERSHIPS));
      }
      // Async sync from live Supabase tables
      this.syncFromSupabase();
    } catch (e) {
      console.warn('LocalStorage unavailable for FpoMembershipService', e);
    }
  }

  async syncFromSupabase() {
    try {
      const [remoteRequests, remoteMembers] = await Promise.all([
        fetchFpoJoinRequests(),
        fetchFpoMembers()
      ]);

      if (remoteRequests && remoteRequests.length > 0) {
        const local = this.getJoinRequests();
        const map = new Map();
        [...remoteRequests, ...local].forEach(item => {
          const key = item.id || item.request_code;
          if (key && !map.has(key)) map.set(key, item);
        });
        const merged = Array.from(map.values());
        localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(merged));
        this._dispatch(EVENT_REQUESTS_UPDATED);
      }

      if (remoteMembers && remoteMembers.length > 0) {
        const local = this.getMemberships();
        const map = new Map();
        [...remoteMembers, ...local].forEach(item => {
          const key = item.id || item.membership_code || item.farmer_id;
          if (key && !map.has(key)) map.set(key, item);
        });
        const merged = Array.from(map.values());
        localStorage.setItem(STORAGE_KEY_MEMBERSHIPS, JSON.stringify(merged));
        this._dispatch(EVENT_MEMBERSHIPS_UPDATED);
      }
    } catch (err) {
      console.warn('FPO Supabase sync error:', err);
    }
  }

  // ─── Join Requests API ─────────────────────────────────────────────────────

  getJoinRequests(filter = {}) {
    if (typeof window === 'undefined') return INITIAL_REQUESTS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_REQUESTS);
      let list = data ? JSON.parse(data) : INITIAL_REQUESTS;

      if (filter.fpo_id) {
        list = list.filter(r => r.fpo_id === filter.fpo_id);
      }
      if (filter.farmer_id) {
        list = list.filter(r => r.farmer_id === filter.farmer_id);
      }
      if (filter.status) {
        list = list.filter(r => r.status === filter.status);
      }

      return list.sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at));
    } catch (e) {
      console.error(e);
      return INITIAL_REQUESTS;
    }
  }

  /**
   * Submit a new join request (farmer -> fpo)
   * Enforces partial uniqueness: cannot send another pending request to the same FPO
   */
  async createJoinRequest({ farmer_id, farmer_name, farmer_village, farmer_phone, farmer_crop, land_acres, harvest_qty, fpo_id, fpo_name, message }) {
    const list = this.getJoinRequests();

    // Check unique (farmer_id, fpo_id, status = 'pending')
    const existingPending = list.find(r => r.farmer_id === farmer_id && r.fpo_id === fpo_id && r.status === 'pending');
    if (existingPending) {
      throw new Error('A pending join request to this FPO already exists. Please wait for FPO review.');
    }

    const newReq = {
      id: `REQ-JOIN-${Date.now().toString().slice(-4)}`,
      request_code: `REQ-JOIN-${Date.now().toString().slice(-6)}`,
      farmer_id: farmer_id || 'farmer-dnyaneshwar',
      farmer_name: farmer_name || 'Dnyaneshwar Patil',
      farmer_village: farmer_village || 'Niphad, Nashik',
      farmer_phone: farmer_phone || '+91 98231 44521',
      farmer_crop: farmer_crop || 'Onion & Wheat',
      land_acres: Number(land_acres) || 3.5,
      harvest_qty: harvest_qty || '85 Quintals',
      fpo_id: fpo_id || 'fpo-sahyadri',
      fpo_name: fpo_name || 'Sahyadri Farmers Producer Co. Ltd',
      message: message || 'Requesting membership to access collective pooling and institutional sales.',
      status: 'pending',
      requested_at: new Date().toISOString(),
      responded_at: null,
      response_note: null
    };

    list.unshift(newReq);
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(list));
    this._dispatch(EVENT_REQUESTS_UPDATED, newReq);

    // Persist to Supabase fpo_join_requests table
    try {
      await createFpoJoinRequest(newReq);
    } catch (err) {
      console.warn('Supabase join request write warning:', err);
    }

    return newReq;
  }

  /**
   * FPO accepts or rejects a join request
   * When accepted, automatically inserts a record into fpo_memberships
   */
  async respondToRequest(requestId, status, response_note = '') {
    const list = this.getJoinRequests();
    const index = list.findIndex(r => r.id === requestId || r.request_code === requestId);
    if (index === -1) throw new Error('Request not found');

    const req = list[index];
    req.status = status; // 'accepted' | 'rejected'
    req.responded_at = new Date().toISOString();
    req.response_note = response_note;

    list[index] = req;
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(list));
    this._dispatch(EVENT_REQUESTS_UPDATED, req);

    let memberData = null;
    // If accepted, add to memberships table
    if (status === 'accepted') {
      memberData = {
        membership_code: `MEM-${Date.now().toString().slice(-4)}`,
        farmer_id: req.farmer_id,
        farmer_name: req.farmer_name,
        farmer_phone: req.farmer_phone,
        farmer_village: req.farmer_village,
        land_acres: req.land_acres,
        crop: req.farmer_crop,
        lot_ready_qtl: 30, // baseline ready lot
        fpo_id: req.fpo_id,
        fpo_name: req.fpo_name,
        status: 'active'
      };
      this.addMembership(memberData);
    }

    // Persist to Supabase
    try {
      await respondToFpoJoinRequest(requestId, status, response_note, memberData);
    } catch (err) {
      console.warn('Supabase respondToRequest warning:', err);
    }

    return req;
  }

  // ─── Memberships API ───────────────────────────────────────────────────────

  getMemberships(filter = {}) {
    if (typeof window === 'undefined') return INITIAL_MEMBERSHIPS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_MEMBERSHIPS);
      let list = data ? JSON.parse(data) : INITIAL_MEMBERSHIPS;

      if (filter.fpo_id) {
        list = list.filter(m => m.fpo_id === filter.fpo_id);
      }
      if (filter.farmer_id) {
        list = list.filter(m => m.farmer_id === filter.farmer_id);
      }
      if (filter.status) {
        list = list.filter(m => m.status === filter.status);
      }

      return list;
    } catch (e) {
      console.error(e);
      return INITIAL_MEMBERSHIPS;
    }
  }

  async addMembership({ farmer_id, farmer_name, village, land_acres, crop, lot_ready_qtl, fpo_id, fpo_name, contact }) {
    const list = this.getMemberships();

    // Check if already active
    const exists = list.find(m => m.farmer_id === farmer_id && m.fpo_id === fpo_id && m.status === 'active');
    if (exists) return exists;

    const newMember = {
      id: `MEM-${Date.now().toString().slice(-4)}`,
      membership_code: `MEM-${Date.now().toString().slice(-4)}`,
      farmer_id: farmer_id || `F-${Date.now().toString().slice(-4)}`,
      farmer_name: farmer_name || 'Farmer Member',
      village: village || 'Nashik District',
      farmer_village: village || 'Nashik District',
      farmer_phone: contact || '+91 98231 44521',
      land_acres: Number(land_acres) || 3.0,
      crop: crop || 'Mixed',
      lot_ready_qtl: Number(lot_ready_qtl) || 25,
      fpo_id: fpo_id || 'fpo-sahyadri',
      fpo_name: fpo_name || 'Sahyadri Farmers Producer Co. Ltd',
      joined_at: new Date().toISOString(),
      left_at: null,
      status: 'active'
    };

    list.unshift(newMember);
    localStorage.setItem(STORAGE_KEY_MEMBERSHIPS, JSON.stringify(list));
    this._dispatch(EVENT_MEMBERSHIPS_UPDATED, newMember);

    // Persist to Supabase fpo_memberships table
    try {
      await addFpoMember(newMember);
    } catch (err) {
      console.warn('Supabase addMember warning:', err);
    }

    return newMember;
  }

  leaveMembership(membershipId) {
    const list = this.getMemberships();
    const index = list.findIndex(m => m.id === membershipId);
    if (index !== -1) {
      list[index].status = 'left';
      list[index].left_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY_MEMBERSHIPS, JSON.stringify(list));
      this._dispatch(EVENT_MEMBERSHIPS_UPDATED, list[index]);
    }
  }

  // ─── Subscriptions / Reactive Events ───────────────────────────────────────

  subscribe(callback) {
    if (typeof window === 'undefined') return () => {};
    const handler = () => callback();
    window.addEventListener(EVENT_REQUESTS_UPDATED, handler);
    window.addEventListener(EVENT_MEMBERSHIPS_UPDATED, handler);
    return () => {
      window.removeEventListener(EVENT_REQUESTS_UPDATED, handler);
      window.removeEventListener(EVENT_MEMBERSHIPS_UPDATED, handler);
    };
  }

  _dispatch(eventName, detail) {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}

export const fpoMembershipService = new FpoMembershipService();
export default fpoMembershipService;
