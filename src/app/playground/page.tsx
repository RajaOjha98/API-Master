"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Notifications } from "@/components/dashboard/Notifications";
import { supabase } from "@/lib/supabase";
import { apiKeyService } from "@/services/apiKeyService";
import { FaKey, FaPaperPlane, FaPlayCircle, FaCode, FaRocket, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useValidation } from "@/context/ValidationContext";
import { useAnalytics } from "@/context/AnalyticsContext";

export default function Playground() {
  const router = useRouter();
  const { setValidated } = useValidation();
  const { refreshAnalytics } = useAnalytics();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  
  // Standard notifications used in Dashboard
  const [showNotification, setShowNotification] = useState(false);
  const [showAddNotification, setShowAddNotification] = useState(false);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [showDeleteNotification, setShowDeleteNotification] = useState(false);

  // Clear notifications after display time
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const validateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) return;
    
    setIsValidating(true);
    
    try {
      // Query for the API key in Supabase
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, usage, limit')
        .eq('key', apiKey)
        .single();
      
      if (error || !data) {
        // Invalid API key - use delete notification (red)
        setShowDeleteNotification(true);
        setTimeout(() => setShowDeleteNotification(false), 2000);
      } else {
        // Check if key has reached usage limit
        if (data.usage >= data.limit) {
          // Key reached limit - use delete notification (red)
          setShowDeleteNotification(true);
          setTimeout(() => setShowDeleteNotification(false), 2000);
        } else {
          // Valid API key - increment usage and show copy notification (blue)
          try {
            await apiKeyService.incrementUsage(data.id);
            setShowNotification(true);
            
            // Store API key in localStorage for reference
            localStorage.setItem('validApiKey', apiKey);
            
            // Set session-based validation flags
            sessionStorage.setItem('apiKeyValidated', 'true');
            sessionStorage.setItem('validApiKey', apiKey);
            sessionStorage.setItem('validationTimestamp', Date.now().toString());
            
            // Refresh analytics since usage has changed
            refreshAnalytics();
            
            // Redirect to protected page after a short delay to show the success notification
            setTimeout(() => {
              router.push('/protected');
            }, 1000);
          } catch (err) {
            console.error("Error incrementing API key usage:", err);
            setShowDeleteNotification(true);
            setTimeout(() => setShowDeleteNotification(false), 2000);
          }
        }
      }
    } catch (err) {
      console.error("Error validating API key:", err);
      setShowDeleteNotification(true);
      setTimeout(() => setShowDeleteNotification(false), 2000);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      {/* Fixed width sidebar container */}
      <div className="md:w-16 flex-shrink-0">
        <Sidebar 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </div>
      
      {/* Main content - doesn't shift with sidebar */}
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 text-gray-800 tracking-tight flex items-center gap-2">
              <FaPlayCircle size={24} className="md:w-8 md:h-8" color="#3b82f6" /> API Playground
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Test your API keys and explore the API-Master capabilities
            </p>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-full bg-blue-100 p-2">
                <FaKey className="text-blue-500" size={18} />
              </div>
              <h3 className="font-semibold text-gray-800">Validate Keys</h3>
            </div>
            <p className="text-sm text-gray-600">
              Test your API keys and track their usage metrics in real-time.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-full bg-green-100 p-2">
                <FaCode className="text-green-500" size={18} />
              </div>
              <h3 className="font-semibold text-gray-800">Integration</h3>
            </div>
            <p className="text-sm text-gray-600">
              Perfect environment to test your implementation before going live.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-full bg-purple-100 p-2">
                <FaRocket className="text-purple-500" size={18} />
              </div>
              <h3 className="font-semibold text-gray-800">Performance</h3>
            </div>
            <p className="text-sm text-gray-600">
              Monitor response times and track API call performance metrics.
            </p>
          </div>
        </div>
        
        {/* Status Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-center gap-4">
          <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
            <FaCheckCircle className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-blue-800">API Service Status: Operational</h3>
            <p className="text-sm text-blue-700">
              All systems running normally. Current API latency is &lt;100ms.
            </p>
          </div>
        </div>
        
        {/* API Key Form - Improved layout */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 max-w-3xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-800">Validate Your API Key</h3>
            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Counts toward usage
            </div>
          </div>
          
          <form onSubmit={validateApiKey} className="space-y-5">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="relative flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="apiKey"
                    name="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="block w-full text-gray-500 pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your API key"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isValidating || !apiKey.trim()}
                  className={`sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isValidating || !apiKey.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isValidating ? (
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  ) : (
                    <FaPaperPlane />
                  )}
                  {isValidating ? 'Validating...' : 'Validate'}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter an API key to validate and track its usage
              </p>
            </div>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaExclamationTriangle className="text-yellow-500" size={14} />
              <span>API keys are sensitive. Never share your API keys in public repositories or client-side code.</span>
            </div>
          </div>
        </div>
      </main>
      
      {/* Notifications - Using the same component as dashboard */}
      <Notifications
        showNotification={showNotification}
        showAddNotification={showAddNotification}
        showUpdateNotification={showUpdateNotification}
        showDeleteNotification={showDeleteNotification}
        copyMessage="Valid API Key"
        deleteMessage="Invalid API Key"
      />
    </div>
  );
} 