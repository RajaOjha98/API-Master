"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useRouter } from "next/navigation";
import { FaLock, FaShieldAlt, FaDatabase, FaExclamationTriangle, FaServer, FaCheckCircle } from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import { Notifications } from "@/components/dashboard/Notifications";
import { AccessDenied } from "@/components/access/AccessDenied";
import { useAnalytics } from "@/context/AnalyticsContext";

export default function ProtectedPage() {
  const router = useRouter();
  const { refreshAnalytics } = useAnalytics();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showDeleteNotification, setShowDeleteNotification] = useState(false);

  // Handle navigation events (back/forward buttons)
  useEffect(() => {
    // Handle popstate events (browser back/forward)
    const handlePopState = () => {
      // Force revalidation when using browser navigation
      checkAccess(true);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Check access on component mount
  useEffect(() => {
    checkAccess();
  }, []);

  // Access validation function
  const checkAccess = async (isNavigation = false) => {
    setIsLoading(true);
    
    try {
      // Check if we have valid session storage data
      const sessionValidated = sessionStorage.getItem('apiKeyValidated');
      const sessionKey = sessionStorage.getItem('validApiKey');
      const validationTimestamp = sessionStorage.getItem('validationTimestamp');
      
      // Direct URL access or missing validation
      if (!sessionValidated || !sessionKey) {
        console.log("Access denied: No validation data");
        setHasAccess(false);
        setIsLoading(false);
        return;
      }
      
      // Handle navigation events specifically (back/forward buttons)
      if (isNavigation) {
        // Clear validation when using browser navigation
        sessionStorage.removeItem('apiKeyValidated');
        sessionStorage.removeItem('validApiKey');
        setHasAccess(false);
        setIsLoading(false);
        return;
      }
      
      // Verify that the API key is still valid
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, usage, limit')
        .eq('key', sessionKey)
        .single();
      
      if (error || !data) {
        // Invalid API key
        console.log("Access denied: API key not found in database");
        setShowDeleteNotification(true);
        sessionStorage.removeItem('apiKeyValidated');
        sessionStorage.removeItem('validApiKey');
        setTimeout(() => {
          setShowDeleteNotification(false);
        }, 2000);
        setHasAccess(false);
      } else if (data.usage >= data.limit) {
        // Key reached usage limit
        console.log("Access denied: API key usage limit reached");
        setShowDeleteNotification(true);
        sessionStorage.removeItem('apiKeyValidated');
        sessionStorage.removeItem('validApiKey');
        setTimeout(() => {
          setShowDeleteNotification(false);
        }, 2000);
        setHasAccess(false);
      } else {
        // Access granted
        console.log("Access granted: API key is valid");
        setApiKey(sessionKey);
        setHasAccess(true);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
        
        // Refresh analytics to reflect the latest data
        refreshAnalytics();
      }
    } catch (err) {
      console.error("Error validating API key:", err);
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a masked version of the API key for display
  const maskedApiKey = apiKey ? 
    `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}` : 
    '';

  // If still loading, show the same loading spinner as used elsewhere in the app
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  // If no access, show access denied component
  if (!hasAccess) {
    return <AccessDenied />;
  }

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
      
      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 text-gray-800 tracking-tight flex items-center gap-2">
              <FaShieldAlt size={24} className="md:w-8 md:h-8" color="#3b82f6" /> Protected Page
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Secured content only accessible with a valid API key
            </p>
          </div>
        </div>
        
        {/* Protected Content Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-full bg-blue-100 p-2">
                <FaServer className="text-blue-500" size={18} />
              </div>
              <h3 className="font-semibold text-gray-800">API Endpoints</h3>
            </div>
            <p className="text-sm text-gray-600">
              Access to all API-Master endpoints with full documentation and examples.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-full bg-purple-100 p-2">
                <FaDatabase className="text-purple-500" size={18} />
              </div>
              <h3 className="font-semibold text-gray-800">Data Access</h3>
            </div>
            <p className="text-sm text-gray-600">
              Query and interact with protected data sources through secure API channels.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-full bg-green-100 p-2">
                <FaLock className="text-green-500" size={18} />
              </div>
              <h3 className="font-semibold text-gray-800">Premium Features</h3>
            </div>
            <p className="text-sm text-gray-600">
              Access to premium features including advanced analytics and data visualization.
            </p>
          </div>
        </div>
        
        {/* Success Banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-center gap-4">
          <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
            <FaCheckCircle className="text-green-600" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-green-800">Authentication Successful</h3>
            <p className="text-sm text-green-700">
              You have successfully authenticated with your API key: {maskedApiKey}
            </p>
          </div>
        </div>
        
        {/* API Usage Guidelines */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">API Usage Guidelines</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2 mt-1 flex-shrink-0">
                <FaCheckCircle className="text-blue-600" size={16} />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Rate Limiting</h4>
                <p className="text-sm text-gray-600">Each API key has a limit of requests per day. Monitor your usage in the dashboard.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2 mt-1 flex-shrink-0">
                <FaCheckCircle className="text-blue-600" size={16} />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Data Security</h4>
                <p className="text-sm text-gray-600">All API requests are encrypted with TLS. Your data is secure during transmission.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2 mt-1 flex-shrink-0">
                <FaCheckCircle className="text-blue-600" size={16} />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Authentication</h4>
                <p className="text-sm text-gray-600">Include your API key in the Authorization header for all requests.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaExclamationTriangle className="text-yellow-500" size={14} />
              <span>Remember to keep your API key secure and never expose it in client-side code or public repositories.</span>
            </div>
          </div>
        </div>
      </main>
      
      {/* Notifications component for showing validation results */}
      <Notifications
        showNotification={showNotification}
        showAddNotification={false}
        showUpdateNotification={false}
        showDeleteNotification={showDeleteNotification}
        copyMessage="API Key Valid"
        deleteMessage="Invalid API Key"
      />
    </div>
  );
} 