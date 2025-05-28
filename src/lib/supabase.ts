import { createClient } from '@supabase/supabase-js';

// These values should be stored in environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Log the connection information (but not the full key for security reasons)
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase key provided:', supabaseKey ? 'Yes (key exists)' : 'No');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection and log the result
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connected successfully');
  }
});

export type ApiKey = {
  id: number;
  description: string;
  key: string;
  added: string;
  expires: string;
  usage: number;
  limit: number;
}; 