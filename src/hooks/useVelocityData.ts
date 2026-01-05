import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { VelocityDataPoint, VelocityMetrics } from '@/types/velocity';

interface UseVelocityDataOptions {
  entryCode: number | string | null;
  fetchOnMount?: boolean;
}

interface UseVelocityDataReturn {
  fullRaceData: VelocityDataPoint[];
  first10SecondsData: VelocityDataPoint[];
  metrics: VelocityMetrics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useVelocityData({
  entryCode,
  fetchOnMount = true,
}: UseVelocityDataOptions): UseVelocityDataReturn {
  const [fullRaceData, setFullRaceData] = useState<VelocityDataPoint[]>([]);
  const [first10SecondsData, setFirst10SecondsData] = useState<VelocityDataPoint[]>([]);
  const [metrics, setMetrics] = useState<VelocityMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!entryCode) {
      setFullRaceData([]);
      setFirst10SecondsData([]);
      setMetrics(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.getVelocityData(entryCode);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.data) {
        setFullRaceData(result.data.fullRace);
        setFirst10SecondsData(result.data.first10Seconds);
        setMetrics(result.data.metrics);
      }
    } catch (err) {
      setError('Failed to load velocity data');
    } finally {
      setLoading(false);
    }
  }, [entryCode]);

  useEffect(() => {
    if (fetchOnMount && entryCode) {
      fetchData();
    }
  }, [fetchOnMount, entryCode, fetchData]);

  return {
    fullRaceData,
    first10SecondsData,
    metrics,
    loading,
    error,
    refetch: fetchData,
  };
}

