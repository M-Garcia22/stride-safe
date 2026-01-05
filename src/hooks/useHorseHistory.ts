import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface TrendsEvent {
  id: string;
  date: string;
  type: 'race' | 'breeze';
  location: string;
  distance: string;
  performanceScore: number;
  wellnessScore: number;
  welfareAlert: boolean;
}

interface UseHorseHistoryOptions {
  horseId: string | number | null;
  days?: number;
  fetchOnMount?: boolean;
}

interface UseHorseHistoryReturn {
  events: TrendsEvent[];
  loading: boolean;
  error: string | null;
  horseName: string | null;
  totalEvents: number;
  refetch: () => Promise<void>;
}

export function useHorseHistory({
  horseId,
  days = 180,
  fetchOnMount = true,
}: UseHorseHistoryOptions): UseHorseHistoryReturn {
  const [events, setEvents] = useState<TrendsEvent[]>([]);
  const [loading, setLoading] = useState(fetchOnMount && !!horseId);
  const [error, setError] = useState<string | null>(null);
  const [horseName, setHorseName] = useState<string | null>(null);
  const [totalEvents, setTotalEvents] = useState(0);

  const fetchHistory = useCallback(async () => {
    if (!horseId) {
      setEvents([]);
      setHorseName(null);
      setTotalEvents(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.getHorseHistory(horseId, days);

      if (result.error) {
        setError(result.error.message);
        setEvents([]);
        return;
      }

      if (result.data) {
        setEvents(result.data.events);
        setHorseName(result.data.meta.horseName);
        setTotalEvents(result.data.meta.total);
      }
    } catch (err) {
      setError('Failed to load horse history. Please try again.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [horseId, days]);

  useEffect(() => {
    if (fetchOnMount && horseId) {
      fetchHistory();
    }
  }, [fetchOnMount, horseId, fetchHistory]);

  return {
    events,
    loading,
    error,
    horseName,
    totalEvents,
    refetch: fetchHistory,
  };
}

