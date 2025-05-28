"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { apiKeyService } from "@/services/apiKeyService";

export default function DebugPage() {
  const [supabaseInfo, setSupabaseInfo] = useState({ url: '', keyProvided: false });
  const [connectionStatus, setConnectionStatus] = useState("Checking...");
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  
  useEffect(() => {
    // Get Supabase connection info
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    setSupabaseInfo({ url, keyProvided: key });
    
    // Test connection
    async function testConnection() {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setConnectionStatus("Failed: " + error.message);
        } else {
          setConnectionStatus("Connected successfully");
          
          // Check if table exists
          const { data: tableData, error: tableError } = await supabase
            .from('api_keys')
            .select('*')
            .limit(1);
            
          if (tableError) {
            setTableInfo({ exists: false, error: tableError.message });
          } else {
            setTableInfo({ exists: true, sample: tableData });
            
            // Try to get all API keys
            try {
              const keys = await apiKeyService.getAllApiKeys();
              setApiKeys(keys);
            } catch (err: any) {
              setError(err.message || "Error fetching API keys");
            }
          }
        }
      } catch (err: any) {
        setConnectionStatus("Exception: " + err.message);
      }
    }
    
    testConnection();
  }, []);
  
  // Function to fix the table issue with "limit" keyword
  async function fixTableIssue() {
    try {
      // Create a new test API key
      const today = new Date();
      const added = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const expires = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
        .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      
      const newKey = {
        description: "Test Key",
        key: apiKeyService.generateApiKeyString(),
        added,
        expires,
        usage: 0,
        limit: 500
      };
      
      const createdKey = await apiKeyService.createApiKey(newKey);
      setApiKeys(keys => [...keys, createdKey]);
      setError(null);
    } catch (err: any) {
      setError("Test key creation failed: " + err.message);
    }
  }
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supabase Debug Page</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Connection Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="font-medium">Supabase URL:</div>
          <div>{supabaseInfo.url || "(not set)"}</div>
          
          <div className="font-medium">Supabase Key Provided:</div>
          <div>{supabaseInfo.keyProvided ? "Yes" : "No"}</div>
          
          <div className="font-medium">Connection Status:</div>
          <div className={connectionStatus.includes("Failed") || connectionStatus.includes("Exception") 
            ? "text-red-600" 
            : connectionStatus === "Connected successfully" 
              ? "text-green-600" 
              : "text-blue-600"}>
            {connectionStatus}
          </div>
        </div>
      </div>
      
      {tableInfo && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Database Table Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="font-medium">Table 'api_keys' exists:</div>
            <div className={tableInfo.exists ? "text-green-600" : "text-red-600"}>
              {tableInfo.exists ? "Yes" : "No"}
            </div>
            
            {!tableInfo.exists && (
              <>
                <div className="font-medium">Error:</div>
                <div className="text-red-600">{tableInfo.error}</div>
              </>
            )}
            
            {tableInfo.exists && tableInfo.sample && (
              <>
                <div className="font-medium">Sample Data:</div>
                <div className="overflow-x-auto">
                  <pre className="text-xs bg-gray-100 p-2 rounded">
                    {JSON.stringify(tableInfo.sample, null, 2)}
                  </pre>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">API Keys</h2>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 mb-4 rounded">
            {error}
          </div>
        )}
        
        <button 
          onClick={fixTableIssue}
          className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Test API Key
        </button>
        
        {apiKeys.length === 0 ? (
          <p>No API keys found in database.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Description</th>
                  <th className="border p-2 text-left">Key</th>
                  <th className="border p-2 text-left">Added</th>
                  <th className="border p-2 text-left">Usage/Limit</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map(key => (
                  <tr key={key.id}>
                    <td className="border p-2">{key.id}</td>
                    <td className="border p-2">{key.description}</td>
                    <td className="border p-2 font-mono text-xs">{key.key.substring(0, 8)}...{key.key.substring(key.key.length - 8)}</td>
                    <td className="border p-2">{key.added}</td>
                    <td className="border p-2">{key.usage}/{key.limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
        <ol className="list-decimal pl-5 space-y-3">
          <li>Check that your environment variables are correctly set in <code className="bg-gray-100 px-1">.env.local</code></li>
          <li>Verify that the Supabase URL and anon key are correct in your project settings</li>
          <li>Make sure the "api_keys" table exists and has the correct structure</li>
          <li>Check that you've fixed the "limit" column name with quotes since it's a reserved keyword</li>
          <li>Look for any error messages in the browser console</li>
          <li>Try creating a test API key using the button above</li>
        </ol>
      </div>
    </div>
  );
} 