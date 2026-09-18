/**
 * AgriNova / Anaaj Authentication & Session Service
 * Backed by Supabase `user_profiles` & `auth_otps` tables with local storage caching.
 */
import {
  createAuthOtp,
  verifyAuthOtp,
  upsertUserProfile,
  fetchUserProfile,
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
   * Request an OTP for a phone number
   * Generates a 4-digit code and stores it in Supabase `auth_otps`
   */
  async sendOtp(phone, role = 'farmer') {
    if (!phone || String(phone).replace(/\D/g, '').length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number' };
    }
    return await createAuthOtp(phone, role);
  }

  /**
   * Verify an OTP against Supabase `auth_otps`
   * On success, fetches/creates profile from `user_profiles` and sets session
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
   * Register a user with full profile and persist to Supabase `user_profiles`
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
