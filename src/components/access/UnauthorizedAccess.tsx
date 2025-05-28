"use client";

import React from 'react';
import { FaExclamationTriangle, FaLock, FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export const UnauthorizedAccess: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-red-600 p-4 flex items-center justify-center">
          <FaLock className="text-white" size={48} />
        </div>
        
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Unauthorized Access</h1>
          
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 text-red-600 p-2 rounded-full">
              <FaExclamationTriangle size={24} />
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">
            This page requires API key validation. Please enter your valid API key in the Playground to proceed.
          </p>
          
          <button
            onClick={() => router.push('/playground')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            Go to Playground to Validate API Key
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}; 