"use client";

import React from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { FaExclamationTriangle, FaDatabase, FaCog } from 'react-icons/fa';

export function SupabaseError() {
  if (isSupabaseConfigured()) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mx-4 mb-6">
      <div className="flex items-start space-x-3">
        <FaExclamationTriangle className="text-red-500 text-xl mt-1" />
        <div className="flex-1">
          <h3 className="text-red-800 font-semibold text-lg mb-2">
            Database Connection Error
          </h3>
          <p className="text-red-700 mb-4">
            The application cannot connect to the database. This is likely because the Supabase environment variables are not configured properly.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <FaCog className="text-red-500 text-sm mt-1" />
              <div>
                <p className="text-red-800 font-medium">Required Environment Variables:</p>
                <ul className="text-red-700 text-sm mt-1 ml-4">
                  <li>• <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code></li>
                  <li>• <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <FaDatabase className="text-red-500 text-sm mt-1" />
              <div>
                <p className="text-red-800 font-medium">Steps to Fix:</p>
                <ol className="text-red-700 text-sm mt-1 ml-4 space-y-1">
                  <li>1. Go to your <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-600">Vercel dashboard</a></li>
                  <li>2. Navigate to your project settings</li>
                  <li>3. Go to Environment Variables section</li>
                  <li>4. Add the required Supabase credentials</li>
                  <li>5. Redeploy the application</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-red-100 rounded border">
            <p className="text-red-800 text-sm">
              <strong>Note:</strong> You can add <code className="bg-red-200 px-1 rounded">?debug=true</code> to the URL to see detailed diagnostic information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 