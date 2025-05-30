"use client";

import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ApiKeyTable } from "@/components/dashboard/ApiKeyTable";
import { ApiKeyModal } from "@/components/dashboard/ApiKeyModal";
import { Notifications } from "@/components/dashboard/Notifications";
import { SupabaseDebug } from "@/components/debug/SupabaseDebug";
import { SupabaseError } from "@/components/error/SupabaseError";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { apiKeyService } from "@/services/apiKeyService";
import { useAnalytics } from "@/context/AnalyticsContext";

// Define ApiKey type to match what's in your components
interface ApiKey {
  id: number;
  description: string;
  key: string;
  added: string;
  expires: string;
  usage: number;
  limit: number;
}

// Simple fallback data
const initialApiKeys: ApiKey[] = [
  {
    id: 1,
    description: "Admin panel",
    key: "••••••••••••••••••••••••••••••••",
    added: "22 July 2023",
    expires: "22 July 2024",
    usage: 342,
    limit: 500
  }
];

export default function Dashboard() {
  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>(initialApiKeys);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [visibleKeyId, setVisibleKeyId] = React.useState<number | null>(null);
  const [copiedKeyId, setCopiedKeyId] = React.useState<number | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [modalDesc, setModalDesc] = React.useState("");
  const [modalKey, setModalKey] = React.useState("");
  const [editingKeyId, setEditingKeyId] = React.useState<number | null>(null);
  const MAX_DESCRIPTION_LENGTH = 50;
  const [showNotification, setShowNotification] = React.useState(false);
  const [showAddNotification, setShowAddNotification] = React.useState(false);
  const [showUpdateNotification, setShowUpdateNotification] = React.useState(false);
  const [showDeleteNotification, setShowDeleteNotification] = React.useState(false);

  // Get analytics refresh function from context
  const { refreshAnalytics } = useAnalytics();

  React.useEffect(() => {
    fetchApiKeys();
    
    // Test Supabase connection only if properly configured
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
          console.error('Supabase connection error:', error);
        } else {
          console.log('Supabase connected successfully');
        }
      });
    }
  }, []);

  // Clear notifications after 2 seconds
  React.useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  React.useEffect(() => {
    if (showAddNotification) {
      const timer = setTimeout(() => setShowAddNotification(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showAddNotification]);

  React.useEffect(() => {
    if (showUpdateNotification) {
      const timer = setTimeout(() => setShowUpdateNotification(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showUpdateNotification]);

  React.useEffect(() => {
    if (showDeleteNotification) {
      const timer = setTimeout(() => setShowDeleteNotification(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showDeleteNotification]);

  // Fetch API keys from Supabase
  const fetchApiKeys = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call Supabase through our service
      const keys = await apiKeyService.getAllApiKeys();
      setApiKeys(keys);
      setIsLoading(false);
      
      // Refresh analytics after fetching keys
      refreshAnalytics();
    } catch (err) {
      console.error("Failed to fetch API keys:", err);
      setError("Failed to load API keys. Please try again.");
      
      // Fallback to sample data if Supabase fails
      setTimeout(() => {
        setApiKeys(initialApiKeys);
        setIsLoading(false);
      }, 800);
    }
  };

  // Toggle API key visibility - show/hide the key
  const toggleKeyVisibility = (id: number) => {
    setVisibleKeyId(visibleKeyId === id ? null : id);
  };

  // Copy API key to clipboard
  const copyToClipboard = (key: string, id: number) => {
    // Use navigator.clipboard API to copy the key to clipboard
    navigator.clipboard.writeText(key)
      .then(() => {
        setCopiedKeyId(id);
        setShowNotification(true);
        // Reset copied indicator after 2 seconds
        setTimeout(() => {
          setCopiedKeyId(null);
        }, 2000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        setError("Failed to copy to clipboard. Please try again.");
      });
  };

  // Generate a new API key
  const generateRandomKey = () => {
    return 'MSTR-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Add new API key - Opens the modal with a new key
  const handleAdd = () => {
    setIsEdit(false);
    setModalDesc("");
    setModalKey(generateRandomKey());
    setEditingKeyId(null);
    setShowModal(true);
  };

  // Edit API key - Opens the modal with existing key data
  const handleEdit = (key: ApiKey) => {
    setIsEdit(true);
    setModalDesc(key.description);
    setModalKey(key.key);
    setEditingKeyId(key.id);
    setShowModal(true);
  };

  // Delete API key from Supabase
  const handleDelete = async (id: number) => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot delete API key');
      return;
    }
    
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update UI
      setApiKeys(apiKeys.filter(key => key.id !== id));
      setShowDeleteNotification(true);
      
      // Refresh analytics after deletion
      refreshAnalytics();
    } catch (err) {
      console.error("Error deleting API key:", err);
      setError("Failed to delete API key. Please try again.");
    }
  };

  // Save API key (add or update) to Supabase
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot save API key');
      return;
    }
    
    try {
      if (isEdit && editingKeyId !== null) {
        // Update existing key in Supabase
        const { error } = await supabase
          .from('api_keys')
          .update({ description: modalDesc })
          .eq('id', editingKeyId);
          
        if (error) throw error;
        
        // Update UI
        setApiKeys(
          apiKeys.map(key => 
            key.id === editingKeyId 
              ? { ...key, description: modalDesc } 
              : key
          )
        );
        setShowUpdateNotification(true);
      } else {
        // Add new key to Supabase
        const now = new Date();
        const added = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
        const expiry = new Date(now.setFullYear(now.getFullYear() + 1)).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
        
        const newKey = {
          description: modalDesc,
          key: modalKey,
          added: added,
          expires: expiry,
          usage: 0,
          limit: 500
        };
        
        const { data, error } = await supabase
          .from('api_keys')
          .insert(newKey)
          .select();
          
        if (error) throw error;
        
        // Update UI with the returned data (which includes the new ID)
        if (data && data.length > 0) {
          setApiKeys([...apiKeys, data[0] as ApiKey]);
        }
        setShowAddNotification(true);
      }
      
      setShowModal(false);
      
      // Refresh analytics after saving
      refreshAnalytics();
    } catch (err) {
      console.error("Error saving API key:", err);
      setError("Failed to save API key. Please try again.");
    }
  };

  // Simulate API usage for demo purposes
  const simulateUsage = async (id: number) => {
    try {
      // Find the current key
      const currentKey = apiKeys.find(key => key.id === id);
      if (!currentKey || currentKey.usage >= currentKey.limit) return;
      
      // Calculate new usage
      const randomUsage = Math.min(currentKey.usage + Math.floor(Math.random() * 50) + 10, currentKey.limit);
      
      // Update in Supabase
      const { error } = await supabase
        .from('api_keys')
        .update({ usage: randomUsage })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update UI
      setApiKeys(
        apiKeys.map(key => {
          if (key.id === id) {
            return { ...key, usage: randomUsage };
          }
          return key;
        })
      );
    } catch (err) {
      console.error("Error updating usage:", err);
    }
  };

  // Helper to display obscured or visible API key
  const displayKey = (key: string, id: number) => {
    if (visibleKeyId === id) {
      return key;
    }
    // If the key is already masked with dots, return as is
    if (key.startsWith("•")) {
      return key;
    }
    // Mask the key, showing the MSTR- prefix and the last 6 characters
    if (key.startsWith("MSTR-")) {
      const lastSix = key.slice(-6);
      return `MSTR-${"•".repeat(key.length - 11)}${lastSix}`;
    } else {
      // For keys without the MSTR- prefix, still show last 6 characters
      const lastSix = key.slice(-6);
      return `${"•".repeat(key.length - 6)}${lastSix}`;
    }
  };

  // Helper to truncate long text
  const truncateText = (text: string, maxLength: number = 20) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
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
        {/* Supabase Error Message */}
        <SupabaseError />
        
        {/* Header */}
        <Header handleAdd={handleAdd} />
        
        {/* API Key Table */}
        <ApiKeyTable 
          apiKeys={apiKeys}
          isLoading={isLoading}
          error={error}
          visibleKeyId={visibleKeyId}
          copiedKeyId={copiedKeyId}
          fetchApiKeys={fetchApiKeys}
          toggleKeyVisibility={toggleKeyVisibility}
          copyToClipboard={copyToClipboard}
          simulateUsage={simulateUsage}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleAdd={handleAdd}
          displayKey={displayKey}
          truncateText={truncateText}
        />
      </main>
      
      {/* Modal for adding/editing API keys */}
      <ApiKeyModal
        showModal={showModal}
        isEdit={isEdit}
        modalDesc={modalDesc}
        modalKey={modalKey}
        setModalDesc={setModalDesc}
        setShowModal={setShowModal}
        handleSave={handleSave}
        MAX_DESCRIPTION_LENGTH={MAX_DESCRIPTION_LENGTH}
      />
      
      {/* Notifications */}
      <Notifications
        showNotification={showNotification}
        showAddNotification={showAddNotification}
        showUpdateNotification={showUpdateNotification}
        showDeleteNotification={showDeleteNotification}
      />
      
      {/* Debug component for diagnosing Supabase issues */}
      <SupabaseDebug />
    </div>
  );
}
