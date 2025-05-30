import { supabase } from '@/lib/supabase';

export interface SupabaseDebugInfo {
  hasCredentials: boolean;
  urlValid: boolean;
  keyValid: boolean;
  connectionTest: 'success' | 'failed' | 'pending';
  tableAccess: 'success' | 'failed' | 'pending';
  errorDetails?: string;
  environment: 'client' | 'server';
}

/**
 * Comprehensive Supabase debug utility for troubleshooting connection issues
 */
export const debugSupabase = async (): Promise<SupabaseDebugInfo> => {
  const debug: SupabaseDebugInfo = {
    hasCredentials: false,
    urlValid: false,
    keyValid: false,
    connectionTest: 'pending',
    tableAccess: 'pending',
    environment: typeof window !== 'undefined' ? 'client' : 'server'
  };

  // Check if we're on the client side
  if (typeof window === 'undefined') {
    debug.errorDetails = 'Running on server side - Supabase should only be called on client side';
    return debug;
  }

  // Check environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  debug.hasCredentials = !!(url && key);
  debug.urlValid = !!(url && url.includes('supabase.co'));
  debug.keyValid = !!(key && key.length > 50); // Basic validation

  if (!debug.hasCredentials) {
    debug.errorDetails = 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables';
    debug.connectionTest = 'failed';
    debug.tableAccess = 'failed';
    return debug;
  }

  // Test basic connection
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      debug.connectionTest = 'failed';
      debug.errorDetails = `Auth session error: ${error.message}`;
    } else {
      debug.connectionTest = 'success';
    }
  } catch (err) {
    debug.connectionTest = 'failed';
    debug.errorDetails = `Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`;
  }

  // Test table access
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('count')
      .limit(1);

    if (error) {
      debug.tableAccess = 'failed';
      debug.errorDetails = (debug.errorDetails ? debug.errorDetails + ' | ' : '') + 
        `Table access error: ${error.message}`;
    } else {
      debug.tableAccess = 'success';
    }
  } catch (err) {
    debug.tableAccess = 'failed';
    debug.errorDetails = (debug.errorDetails ? debug.errorDetails + ' | ' : '') + 
      `Table query error: ${err instanceof Error ? err.message : 'Unknown error'}`;
  }

  return debug;
};

/**
 * Log comprehensive debug information to console
 */
export const logSupabaseDebug = async () => {
  console.group('🔍 Supabase Debug Information');
  
  const debug = await debugSupabase();
  
  console.log('Environment:', debug.environment);
  console.log('Has Credentials:', debug.hasCredentials);
  console.log('URL Valid:', debug.urlValid);
  console.log('Key Valid:', debug.keyValid);
  console.log('Connection Test:', debug.connectionTest);
  console.log('Table Access:', debug.tableAccess);
  
  if (debug.errorDetails) {
    console.error('Error Details:', debug.errorDetails);
  }

  // Log environment variables (safely)
  if (typeof window !== 'undefined') {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    console.log('Supabase URL:', url ? `${url.substring(0, 30)}...` : 'Not set');
    console.log('Supabase Key:', key ? `${key.substring(0, 30)}...` : 'Not set');
  }
  
  console.groupEnd();
  
  return debug;
}; 