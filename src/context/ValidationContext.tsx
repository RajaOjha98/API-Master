"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface ValidationContextType {
  isValidated: boolean;
  apiKey: string | null;
  setValidated: (value: boolean, key?: string) => void;
  clearValidation: () => void;
}

const ValidationContext = createContext<ValidationContextType | undefined>(undefined);

export function ValidationProvider({ children }: { children: ReactNode }) {
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Check session storage on mount (more temporary than localStorage)
  useEffect(() => {
    const storedValidation = sessionStorage.getItem('apiKeyValidated');
    const storedKey = sessionStorage.getItem('validApiKey');
    
    if (storedValidation === 'true' && storedKey) {
      setIsValidated(true);
      setApiKey(storedKey);
    }
  }, []);

  // Set validation state
  const setValidated = (value: boolean, key?: string) => {
    setIsValidated(value);
    
    if (value && key) {
      setApiKey(key);
      // Store in sessionStorage (cleared when tab closes)
      sessionStorage.setItem('apiKeyValidated', 'true');
      sessionStorage.setItem('validApiKey', key);
      // Keep in localStorage for reference but not for validation
      localStorage.setItem('validApiKey', key);
    } else {
      setApiKey(null);
      sessionStorage.removeItem('apiKeyValidated');
      sessionStorage.removeItem('validApiKey');
    }
  };

  // Clear validation
  const clearValidation = () => {
    setIsValidated(false);
    setApiKey(null);
    sessionStorage.removeItem('apiKeyValidated');
    sessionStorage.removeItem('validApiKey');
  };

  return (
    <ValidationContext.Provider value={{ isValidated, apiKey, setValidated, clearValidation }}>
      {children}
    </ValidationContext.Provider>
  );
}

export function useValidation() {
  const context = useContext(ValidationContext);
  if (context === undefined) {
    throw new Error('useValidation must be used within a ValidationProvider');
  }
  return context;
} 