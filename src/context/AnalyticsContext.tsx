"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { analyticsService, AnalyticsData } from '@/services/analyticsService';

interface AnalyticsContextType {
  analytics: AnalyticsData;
  isLoading: boolean;
  refreshAnalytics: () => Promise<void>;
  lastUpdated: Date | null;
}

const defaultAnalytics: AnalyticsData = {
  totalApiCalls: 0,
  activeKeys: 0,
  successRate: 0,
  avgResponseTime: 0,
  totalApiCallsChange: 0,
  activeKeysChange: 0,
  successRateChange: 0,
  avgResponseTimeChange: 0
};

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [analytics, setAnalytics] = useState<AnalyticsData>(defaultAnalytics);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await analyticsService.getAnalyticsData();
      setAnalytics(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  React.useEffect(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  return (
    <AnalyticsContext.Provider value={{ analytics, isLoading, refreshAnalytics, lastUpdated }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
} 