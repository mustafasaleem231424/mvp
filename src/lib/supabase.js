/**
 * Supabase Client
 * ================
 * Creates and exports the Supabase client for auth and database operations.
 * 
 * SECURITY: Never expose the service role key on the client side.
 * The anon key is safe for browser use (protected by Row Level Security).
 */

import { createClient } from '@supabase/supabase-js';

// These come from environment variables (set in .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Supabase client instance for browser-side use.
 * Uses the anonymous key — all data access is governed by RLS policies.
 */
export const supabase = (supabaseUrl && supabaseUrl.startsWith('http')) 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Mock function for when supabase is not configured
const mockResult = { data: null, error: { message: 'Supabase not configured' } };

/**
 * Helper: Get the currently authenticated user.
 * Returns null if not logged in.
 */
export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error.message);
    return null;
  }
  return user;
}

/**
 * Helper: Sign up a new user with email and password.
 */
export async function signUp(email, password) {
  if (!supabase) return mockResult;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

/**
 * Helper: Sign in with email and password.
 */
export async function signIn(email, password) {
  if (!supabase) return mockResult;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * Helper: Sign out the current user.
 */
export async function signOut() {
  if (!supabase) return mockResult;
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Helper: Save a scan result to the database.
 * 
 * @param {Object} scanData - The scan result to save
 * @param {string} scanData.userId - The user's ID
 * @param {Array} scanData.detections - Array of detection objects
 * @param {string} scanData.sprayDecision - 'SPRAY', 'NO_SPRAY', 'WAIT_FOR_BEES', etc.
 * @param {number} scanData.severity - Overall severity score (0-1)
 * @param {string} [scanData.imageUrl] - Optional image URL from storage
 */
export async function saveScanResult(scanData) {
  if (!supabase) return mockResult;
  const { data, error } = await supabase
    .from('scans')
    .insert([{
      user_id: scanData.userId,
      detections: scanData.detections,
      spray_decision: scanData.sprayDecision,
      severity: scanData.severity,
      image_url: scanData.imageUrl || null,
      created_at: new Date().toISOString(),
    }])
    .select();

  return { data, error };
}

/**
 * Helper: Fetch scan history for a user.
 * 
 * @param {string} userId - The user's ID
 * @param {number} limit - Maximum results to return
 */
export async function getScanHistory(userId, limit = 50) {
  if (!supabase) return mockResult;
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data, error };
}
