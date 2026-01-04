import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { TrainerHorse } from '@/types/horse';

interface UseTrainerHorsesOptions {
  /** Whether to fetch on mount */
  fetchOnMount?: boolean;
}

interface UseTrainerHorsesReturn {
  horses: TrainerHorse[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  trainerCode: string | null;
  refetch: () => Promise<void>;
}

export function useTrainerHorses({
  fetchOnMount = true,
}: UseTrainerHorsesOptions = {}): UseTrainerHorsesReturn {
  const [horses, setHorses] = useState<TrainerHorse[]>([]);
  const [loading, setLoading] = useState(fetchOnMount);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [trainerCode, setTrainerCode] = useState<string | null>(null);

  const fetchHorses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.getTrainerHorses();

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.data) {
        setHorses(result.data.horses);
        setTotalCount(result.data.meta.total);
        setTrainerCode(result.data.meta.trainerCode);
      }
    } catch (err) {
      setError('Failed to load horses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fetchOnMount) {
      fetchHorses();
    }
  }, [fetchOnMount, fetchHorses]);

  return {
    horses,
    loading,
    error,
    totalCount,
    trainerCode,
    refetch: fetchHorses,
  };
}

