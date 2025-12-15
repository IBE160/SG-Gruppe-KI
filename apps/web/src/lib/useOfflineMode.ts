import { useState, useEffect, useCallback } from 'react';
import { db } from './db';
import { useAuth } from '@/context/AuthContext';

export const useOfflineMode = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isOfflineModeEnabled, setIsOfflineModeEnabled] = useState(false);
  const [isAutoSync, setIsAutoSync] = useState(true); // Assuming auto-sync is on by default
  const [hasUnsyncedData, setHasUnsyncedData] = useState(false);

  const checkUnsyncedData = useCallback(async () => {
    const dbInstance = await db;
    const logs = await dbInstance.getAll('logs');
    setHasUnsyncedData(logs.length > 0);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (isAutoSync) {
        synchronizeData();
      }
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    checkUnsyncedData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isAutoSync]);

  const setOfflineMode = (enabled: boolean) => {
    setIsOfflineModeEnabled(enabled);
    localStorage.setItem('offlineModeEnabled', JSON.stringify(enabled));
  };

  useEffect(() => {
    const storedOfflineSetting = localStorage.getItem('offlineModeEnabled');
    if (storedOfflineSetting) {
      setIsOfflineModeEnabled(JSON.parse(storedOfflineSetting));
    }
    const storedAutoSyncSetting = localStorage.getItem('autoSyncEnabled');
    if (storedAutoSyncSetting) {
      setIsAutoSync(JSON.parse(storedAutoSyncSetting));
    }
  }, []);

  const addPlanToCache = useCallback(async (plan: any) => {
    if (isOfflineModeEnabled) {
      const dbInstance = await db;
      await dbInstance.put('plans', plan);
      console.log('Plan cached in IndexedDB');
    }
  }, [isOfflineModeEnabled]);

  const addLogToCache = useCallback(async (log: any) => {
    if (isOfflineModeEnabled) {
        const dbInstance = await db;
        await dbInstance.put('logs', { ...log, id: log.id || new Date().toISOString() });
        console.log('Log cached in IndexedDB');
        setHasUnsyncedData(true);
    }
  }, [isOfflineModeEnabled]);

  const getCachedPlans = useCallback(async () => {
    const dbInstance = await db;
    return dbInstance.getAll('plans');
  }, []);

  const getCachedLogs = useCallback(async () => {
    const dbInstance = await db;
    return dbInstance.getAll('logs');
  }, []);

  const clearCache = useCallback(async () => {
    const dbInstance = await db;
    await dbInstance.clear('plans');
    await dbInstance.clear('logs');
    console.log('Local cache cleared');
    setHasUnsyncedData(false);
  }, []);

  const { accessToken } = useAuth();

  const synchronizeData = useCallback(async () => {
    if (isOffline) {
      console.warn('Cannot sync while offline.');
      return;
    }
    const dbInstance = await db;
    const logs = await dbInstance.getAll('logs');

    if (logs.length === 0) {
      console.log('No data to sync.');
      setHasUnsyncedData(false);
      return;
    }

    try {
      const response = await fetch('/api/v1/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(logs),
      });

      if (response.ok) {
        console.log('Data synchronized successfully');
        await dbInstance.clear('logs');
        setHasUnsyncedData(false);
      } else {
        console.error('Failed to synchronize data:', response.statusText);
      }
    } catch (error) {
      console.error('Error synchronizing data:', error);
    }
  }, [isOffline, accessToken]);

  return {
    isOffline,
    isOfflineModeEnabled,
    setOfflineMode,
    isAutoSync,
    setIsAutoSync,
    hasUnsyncedData,
    synchronizeData,
    addPlanToCache,
    addLogToCache,
    getCachedPlans,
    getCachedLogs,
    clearCache,
  };
};
