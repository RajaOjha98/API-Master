import { createClient } from '@supabase/supabase-js';

// These values should be stored in environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Log the connection information (but not the full key for security reasons)
if (typeof window !== 'undefined') {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase key provided:', supabaseKey ? 'Yes (key exists)' : 'No');
}

// Provide fallback values for build time to prevent errors
const buildTimeFallbackUrl = supabaseUrl || 'https://placeholder.supabase.co';
const buildTimeFallbackKey = supabaseKey || 'placeholder-anon-key';

if (!supabaseUrl || !supabaseKey) {
  if (typeof window !== 'undefined') {
    console.error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
  }
}

// Create a single supabase client for the entire app
// Use fallback values during build time to prevent createClient from throwing errors
export const supabase = createClient(buildTimeFallbackUrl, buildTimeFallbackKey);

// Utility function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseKey && typeof window !== 'undefined');
};

// Only test connection on the client side, not during build
if (typeof window !== 'undefined' && supabaseUrl && supabaseKey) {
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Supabase connected successfully');
    }
  }).catch(err => {
    console.error('Supabase connection exception:', err);
  });
}

export type ApiKey = {
  id: number;
  description: string;
  key: string;
  added: string;
  expires: string;
  usage: number;
  limit: number;
}; 