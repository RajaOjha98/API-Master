"use client";

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface DebugInfo {
  envVarsPresent: {
    url: boolean;
    key: boolean;
  };
  actualValues: {
    url: string;
    keyLength: number;
  };
  connectionTest: string;
  tableTest: string;
}

export function SupabaseDebug() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Only run diagnostics in development or when specifically requested
      const shouldRunDiagnostics = process.env.NODE_ENV === 'development' || window.location.search.includes('debug=true');
      setShouldShow(shouldRunDiagnostics);
      
      if (shouldRunDiagnostics) {
        runDiagnostics();
      }
    }
  }, []);

  const runDiagnostics = async () => {
    // Ensure we're on client side
    if (typeof window === 'undefined') return;
    
    const info: DebugInfo = {
      envVarsPresent: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      actualValues: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT_SET',
        keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      },
      connectionTest: 'Testing...',
      tableTest: 'Testing...',
    };

    setDebugInfo({ ...info });

    // Test connection
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          info.connectionTest = `Connection Error: ${error.message}`;
        } else {
          info.connectionTest = 'Connection successful';
        }
      } else {
        info.connectionTest = 'Environment variables not configured';
      }
    } catch (err) {
      info.connectionTest = `Connection Exception: ${err}`;
    }

    // Test table access
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('api_keys')
          .select('count', { count: 'exact' });
        
        if (error) {
          info.tableTest = `Table Error: ${error.message}`;
        } else {
          info.tableTest = `Table accessible, count: ${data?.length || 0}`;
        }
      } else {
        info.tableTest = 'Cannot test - environment not configured';
      }
    } catch (err) {
      info.tableTest = `Table Exception: ${err}`;
    }

    setDebugInfo(info);
  };

  // Don't render anything during SSR or if shouldn't show
  if (typeof window === 'undefined' || !shouldShow) {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-xs z-50"
      >
        Debug
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Supabase Debug Info</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {debugInfo ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Environment Variables</h3>
              <p>URL Present: {debugInfo.envVarsPresent.url ? '✅' : '❌'}</p>
              <p>Key Present: {debugInfo.envVarsPresent.key ? '✅' : '❌'}</p>
              <p>URL Value: {debugInfo.actualValues.url}</p>
              <p>Key Length: {debugInfo.actualValues.keyLength}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Connection Test</h3>
              <p>{debugInfo.connectionTest}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Table Access Test</h3>
              <p>{debugInfo.tableTest}</p>
            </div>
            
            <button
              onClick={runDiagnostics}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Rerun Tests
            </button>
          </div>
        ) : (
          <p>Loading diagnostics...</p>
        )}
      </div>
    </div>
  );
} 