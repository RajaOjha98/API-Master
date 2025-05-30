import { createClient } from '@supabase/supabase-js';

// These values should be stored in environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Enhanced logging for debugging
if (typeof window !== 'undefined') {
  console.log('🔍 Supabase Configuration Check:');
  console.log('URL:', supabaseUrl || '❌ NOT_SET');
  console.log('Key provided:', supabaseKey ? '✅ Yes' : '❌ No');
  console.log('URL starts with https:', supabaseUrl.startsWith('https://') ? '✅ Yes' : '❌ No');
  console.log('Key length:', supabaseKey.length);
}

// Provide fallback values for build time to prevent errors
const buildTimeFallbackUrl = supabaseUrl || 'https://placeholder.supabase.co';
const buildTimeFallbackKey = supabaseKey || 'placeholder-anon-key';

// Enhanced error messaging
if (!supabaseUrl || !supabaseKey) {
  if (typeof window !== 'undefined') {
    console.error('🚨 SUPABASE CONFIGURATION ERROR:');
    console.error('Missing required environment variables:');
    if (!supabaseUrl) console.error('- NEXT_PUBLIC_SUPABASE_URL is not set');
    if (!supabaseKey) console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
    console.error('Please check your Vercel environment variables settings.');
    console.error('Visit: https://vercel.com/[your-username]/[your-project]/settings/environment-variables');
  }
}

// Create a single supabase client for the entire app
// Use fallback values during build time to prevent createClient from throwing errors
export const supabase = createClient(buildTimeFallbackUrl, buildTimeFallbackKey);

// Utility function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const isConfigured = !!(supabaseUrl && supabaseKey && typeof window !== 'undefined');
  if (typeof window !== 'undefined' && !isConfigured) {
    console.warn('⚠️ Supabase is not properly configured. Some features may not work.');
  }
  return isConfigured;
};

// Enhanced connection testing with better error handling
if (typeof window !== 'undefined') {
  if (supabaseUrl && supabaseKey) {
    console.log('🔌 Testing Supabase connection...');
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('❌ Supabase connection error:', error);
        console.error('Common causes:');
        console.error('1. Invalid Supabase URL or key');
        console.error('2. Network connectivity issues');
        console.error('3. Supabase service unavailable');
      } else {
        console.log('✅ Supabase connected successfully');
        
        // Test basic table access
        supabase.from('api_keys').select('count', { count: 'exact' }).then(({ data, error }) => {
          if (error) {
            console.error('❌ Database table access error:', error);
            console.error('Possible causes:');
            console.error('1. Table "api_keys" does not exist');
            console.error('2. Row Level Security (RLS) policies blocking access');
            console.error('3. Insufficient permissions');
          } else {
            console.log('✅ Database table accessible');
          }
        });
      }
    }).catch(err => {
      console.error('❌ Supabase connection exception:', err);
    });
  } else {
    console.log('⏭️ Skipping Supabase connection test - environment variables not configured');
  }
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