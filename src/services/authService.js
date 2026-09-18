/**
 * AgriNova / Anaaj Authentication & Session Service
 * Backed by Supabase `user_profiles` & `auth_otps` tables with local storage caching.
 */
import {
  createAuthOtp,
  verifyAuthOtp,
  upsertUserProfile,
  fetchUserProfile,
  loginWithPassword,
  isSupabaseConfigured
} from './supabaseClient';

const AUTH_USER_KEY = 'anaaj_authenticated_user';
const AUTH_ROLE_KEY = 'anaaj_authenticated_role';

class AuthService {
  constructor() {
    this.currentUser = this.loadStoredUser();
  }

  loadStoredUser() {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.warn('[AuthService] Failed to load stored user:', e);
      return null;
    }
  }

  getCurrentUser() {
    if (!this.currentUser) {
      this.currentUser = this.loadStoredUser();
    }
    return this.currentUser;
  }

  setCurrentUser(user, role) {
    this.currentUser = user;
    try {
      if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        localStorage.setItem(AUTH_ROLE_KEY, role || user.role || 'farmer');
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
        localStorage.removeItem(AUTH_ROLE_KEY);
      }
    } catch (e) {
      console.warn('[AuthService] Failed to save session:', e);
    }
  }

  getStoredRole() {
    try {
      return localStorage.getItem(AUTH_ROLE_KEY) || (this.currentUser?.role) || 'farmer';
    } catch (e) {
      return 'farmer';
    }
  }

  /**
   * Log in with Phone/Email + Password
   * Denies access if not registered or password wrong
   */
  async loginWithCredentials(identifier, password, role = null) {
    const res = await loginWithPassword(identifier, password, role);
    if (res.success && res.user) {
      this.setCurrentUser(res.user, role || res.user.role);
    }
    return res;
  }

  /**
   * Quick Preview Demo Login
   */
  loginAsDemo(role = 'farmer') {
    let demoUser = null;
    if (role === 'farmer') {
      demoUser = {
        id: 'DEMO-FARMER-9876543210',
        name: 'Dnyaneshwar Patil',
        phone: '9876543210',
        role: 'farmer',
        village: 'Yeola',
        district: 'Nashik',
        state: 'Maharashtra',
        pincode: '423401',
        landAreaAcres: 8.5,
        primaryCrops: 'Onion, Wheat, Soybean',
        soilType: 'Black Cotton Clay',
        irrigationSource: 'Well & Canal Drip',
        kccLimit: 300000,
        isDemo: true
      };
    } else if (role === 'fpo') {
      demoUser = {
        id: 'DEMO-FPO-9822011223',
        name: 'Sahyadri Agro FPO',
        phone: '9822011223',
        role: 'fpo',
        fpoName: 'Sahyadri Agro Farmers Producer Co. Ltd.',
        regNumber: 'U01403MH2018PTC309812',
        memberCount: 520,
        district: 'Nashik',
        state: 'Maharashtra',
        primaryCrops: 'Grapes, Onion, Tomato',
        isDemo: true
      };
    } else {
      demoUser = {
        id: 'DEMO-BUYER-9811099887',
        name: 'ITC Agri Procurement Hub',
        phone: '9811099887',
        role: 'buyer',
        businessName: 'ITC Agri Business Division',
        buyerType: 'Corporate Processor',
        gst: '27AABCI1234F1Z8',
        district: 'Indore Hub',
        state: 'Madhya Pradesh',
        cropsInterested: 'Wheat, Soybean, Mustard',
        isDemo: true
      };
    }
    this.setCurrentUser(demoUser, role);
    return { success: true, user: demoUser };
  }

  /**
   * Request an OTP for a phone number (Used during registration)
   */
  async sendOtp(phone, role = 'farmer') {
    if (!phone || String(phone).replace(/\D/g, '').length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number' };
    }
    return await createAuthOtp(phone, role);
  }

  /**
   * Verify an OTP against Supabase auth_otps
   */
  async verifyOtp(phone, otpCode, role = 'farmer') {
    if (!otpCode || String(otpCode).trim().length < 4) {
      return { success: false, error: 'Please enter a 4-digit OTP' };
    }
    const result = await verifyAuthOtp(phone, otpCode, role);
    if (result.success && result.user) {
      this.setCurrentUser(result.user, role || result.user.role);
    }
    return result;
  }

  /**
   * Register a user with full profile and persist to Supabase user_profiles
   */
  async registerUser(profileData) {
    const result = await upsertUserProfile(profileData);
    if (result.success && result.data) {
      this.setCurrentUser(result.data, result.data.role);
    }
    return result;
  }

  /**
   * Logout user and clear stored session
   */
  logout() {
    this.setCurrentUser(null, null);
    return true;
  }
}

export const authService = new AuthService();
export default authService;
